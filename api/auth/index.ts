
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { checkDbConnection } from '../_supabaseServer.js';
import { hashPassword, comparePassword, signJwt, generateRefreshToken, verifyJwt } from '../_authUtils.js';
import { stripe } from '../_stripeClient.js';
import { PLANS, BillingCycle } from '../../src/config/plans.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { action } = req.query;

  try {
    const supabase = checkDbConnection();

    // --- ME (Get current user data via JWT) ---
    if (action === 'me') {
      const authHeader = req.headers.authorization;
      if (!authHeader?.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' });
      
      const token = authHeader.substring(7);
      const decoded = verifyJwt(token);
      
      const { data: user, error } = await supabase
        .from('users')
        .select('id, name, email, plan_tier')
        .eq('id', decoded.sub)
        .single();

      if (error || !user) return res.status(404).json({ error: 'User not found' });
      return res.status(200).json({ user });
    }

    // --- LOGIN ---
    if (action === 'login') {
      if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
      const { email: rawEmail, password } = req.body;
      const email = rawEmail ? rawEmail.toLowerCase().trim() : '';

      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (error || !user) return res.status(401).json({ error: 'E-mail ou senha inválidos.' });

      const valid = await comparePassword(password, user.password_hash);
      if (!valid) return res.status(401).json({ error: 'E-mail ou senha inválidos.' });

      const token = signJwt({ sub: user.id, email: user.email, plan_tier: user.plan_tier });
      
      const refreshToken = generateRefreshToken();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      const { error: tokenError } = await supabase
        .from('refresh_tokens')
        .insert([{ 
          user_id: user.id, 
          token: refreshToken, 
          expires_at: expiresAt.toISOString(), 
          revoked: false 
        }]);

      if (tokenError) {
        console.error("Erro ao salvar refresh token:", tokenError);
        return res.status(500).json({ error: 'Falha ao criar sessão de acesso.' });
      }

      return res.status(200).json({
        token,
        refreshToken,
        user: { id: user.id, name: user.name, email: user.email, plan_tier: user.plan_tier }
      });
    }

    // --- LOGIN + CHECKOUT (Transactional) ---
    if (action === 'login-and-checkout') {
      if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
      const { email: rawEmail, password, plan, cycle } = req.body;
      const email = rawEmail ? rawEmail.toLowerCase().trim() : '';

      const planConfig = PLANS.find(p => p.id === plan && !p.isCustom);
      const billingCycle: BillingCycle = cycle === 'yearly' ? 'yearly' : 'monthly';
      const priceId = planConfig?.stripe?.[billingCycle];
      if (!planConfig || !priceId) {
        return res.status(400).json({ error: 'INVALID_PLAN' });
      }

      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (error || !user) return res.status(401).json({ error: 'E-mail ou senha inválidos.' });

      const valid = await comparePassword(password, user.password_hash);
      if (!valid) return res.status(401).json({ error: 'E-mail ou senha inválidos.' });

      const token = signJwt({ sub: user.id, email: user.email, plan_tier: user.plan_tier });
      const refreshToken = generateRefreshToken();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      const { error: tokenError } = await supabase
        .from('refresh_tokens')
        .insert([{ user_id: user.id, token: refreshToken, expires_at: expiresAt.toISOString(), revoked: false }]);

      if (tokenError) {
        console.error("Erro ao salvar refresh token:", tokenError);
        return res.status(500).json({ error: 'Falha ao criar sessão de acesso.' });
      }

      // Garantir/gerar o customer id
      let customerId = user.stripe_customer_id;
      if (!customerId) {
        const customer = await stripe.customers.create({
          email: user.email,
          name: user.name || user.email,
          metadata: { userId: user.id }
        });
        customerId = customer.id;

        await supabase
          .from('users')
          .update({ stripe_customer_id: customerId })
          .eq('id', user.id);
      }

      const protocol = req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http';
      const host = req.headers.host || 'localhost:5173';
      const origin = `${protocol}://${host}`;

      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        mode: 'subscription',
        payment_method_types: ['card'],
        success_url: `${origin}/#/billing/success?session_id={CHECKOUT_SESSION_ID}&old_tier=${user.plan_tier}`,
        cancel_url: `${origin}/#/billing/cancel`,
        line_items: [{ price: priceId, quantity: 1 }],
        metadata: {
          userId: user.id,
          planSlug: planConfig.id,
          billingCycle
        },
        subscription_data: {
          metadata: { userId: user.id, planSlug: planConfig.id }
        }
      });

      return res.status(200).json({
        url: session.url,
        token,
        refreshToken,
        user: { id: user.id, name: user.name, email: user.email, plan_tier: user.plan_tier }
      });
    }

    // --- REGISTER ---
    if (action === 'register') {
      if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
      const { name, email: rawEmail, password } = req.body;
      const email = rawEmail ? rawEmail.toLowerCase().trim() : '';

      if (!name || !email || !password) return res.status(400).json({ error: 'Preencha todos os campos.' });

      const { data: existing } = await supabase
        .from('users').select('id').eq('email', email).maybeSingle();

      if (existing) return res.status(400).json({ error: 'Este e-mail já está cadastrado.' });

      const password_hash = await hashPassword(password);
      const { data, error } = await supabase
        .from('users')
        .insert([{ name, email, password_hash, plan_tier: 'trial' }])
        .select('id, email, name')
        .single();

      if (error) return res.status(500).json({ error: 'Erro ao salvar no banco: ' + error.message });
      return res.status(201).json({ user: data });
    }

    // --- REGISTER + CHECKOUT (Transactional) ---
    if (action === 'register-and-checkout') {
      if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
      const { name, email: rawEmail, password, plan, cycle } = req.body;
      const email = rawEmail ? rawEmail.toLowerCase().trim() : '';

      const planConfig = PLANS.find(p => p.id === plan && !p.isCustom);
      const billingCycle: BillingCycle = cycle === 'yearly' ? 'yearly' : 'monthly';
      const priceId = planConfig?.stripe?.[billingCycle];

      if (!planConfig || !priceId) return res.status(400).json({ error: 'INVALID_PLAN' });
      if (!name || !email || !password) return res.status(400).json({ error: 'Preencha todos os campos.' });

      const { data: existing } = await supabase
        .from('users').select('id').eq('email', email).maybeSingle();

      if (existing) return res.status(400).json({ error: 'Este e-mail já está cadastrado.' });

      const password_hash = await hashPassword(password);
      const { data: newUser, error } = await supabase
        .from('users')
        .insert([{ name, email, password_hash, plan_tier: 'trial' }])
        .select('id, email, name, plan_tier, stripe_customer_id')
        .single();

      if (error || !newUser) return res.status(500).json({ error: 'Erro ao salvar no banco: ' + (error?.message || 'unknown') });

      let customerId = newUser.stripe_customer_id;
      if (!customerId) {
        const customer = await stripe.customers.create({
          email: newUser.email,
          name: newUser.name || newUser.email,
          metadata: { userId: newUser.id }
        });
        customerId = customer.id;

        await supabase
          .from('users')
          .update({ stripe_customer_id: customerId })
          .eq('id', newUser.id);
      }

      const token = signJwt({ sub: newUser.id, email: newUser.email, plan_tier: newUser.plan_tier });
      const refreshToken = generateRefreshToken();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      await supabase
        .from('refresh_tokens')
        .insert([{ user_id: newUser.id, token: refreshToken, expires_at: expiresAt.toISOString(), revoked: false }]);

      const protocol = req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http';
      const host = req.headers.host || 'localhost:5173';
      const origin = `${protocol}://${host}`;

      const session = await stripe.checkout.sessions.create({
        customer: customerId!,
        mode: 'subscription',
        payment_method_types: ['card'],
        success_url: `${origin}/#/billing/success?session_id={CHECKOUT_SESSION_ID}&old_tier=${newUser.plan_tier}`,
        cancel_url: `${origin}/#/billing/cancel`,
        line_items: [{ price: priceId, quantity: 1 }],
        metadata: { userId: newUser.id, planSlug: planConfig.id, billingCycle },
        subscription_data: { metadata: { userId: newUser.id, planSlug: planConfig.id } }
      });

      return res.status(201).json({
        url: session.url,
        token,
        refreshToken,
        user: { id: newUser.id, name: newUser.name, email: newUser.email, plan_tier: newUser.plan_tier }
      });
    }

    // --- REFRESH TOKEN ---
    if (action === 'refresh') {
      const { refreshToken } = req.body;
      if (!refreshToken) return res.status(400).json({ error: 'Token necessário.' });

      const { data: storedToken, error } = await supabase
        .from('refresh_tokens')
        .select('*, users(*)')
        .eq('token', refreshToken)
        .eq('revoked', false)
        .single();

      if (error || !storedToken || new Date(storedToken.expires_at) < new Date()) {
        return res.status(401).json({ error: 'Sessão inválida ou expirada.' });
      }

      const user = storedToken.users as any;
      const newToken = signJwt({ sub: user.id, email: user.email, plan_tier: user.plan_tier });

      return res.status(200).json({ token: newToken, refreshToken });
    }

    return res.status(400).json({ error: 'Ação inválida.' });

  } catch (err: any) {
    console.error('API Error:', err.message);
    return res.status(500).json({ 
      error: 'Erro Interno', 
      message: err.message || 'Erro inesperado no servidor.' 
    });
  }
}
