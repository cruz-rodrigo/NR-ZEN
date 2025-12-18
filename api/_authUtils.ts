
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

/**
 * Obtém o segredo JWT de forma segura.
 */
const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  
  if (!secret) {
    // Se estiver explicitamente em produção na Vercel, o segredo é obrigatório
    if (process.env.NODE_ENV === 'production' && process.env.VERCEL) {
      throw new Error("JWT_SECRET_MISSING: Configure a variável JWT_SECRET no painel da Vercel.");
    }
    // Caso contrário (dev ou preview), usa um fallback para não travar o login
    return 'fallback_secret_for_testing_purposes_only';
  }
  return secret;
};

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Assina um novo JWT Access Token.
 */
export function signJwt(payload: { sub: string; email: string; plan_tier: string }) {
  const secret = getJwtSecret(); 
  return jwt.sign(payload, secret, { expiresIn: '15m' });
}

/**
 * Verifica a autenticidade e validade do token.
 */
export function verifyJwt(token: string) {
  const secret = getJwtSecret();
  return jwt.verify(token, secret) as { sub: string; email: string; plan_tier: string };
}

export function generateRefreshToken(): string {
  return crypto.randomBytes(40).toString('hex');
}
