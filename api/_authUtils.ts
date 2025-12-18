
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

/**
 * Obtém o segredo JWT de forma segura.
 * Se estiver em produção e o segredo faltar, lança erro APENAS quando solicitado.
 */
const getJwtSecret = (forceStrict = false): string => {
  const secret = process.env.JWT_SECRET;
  const isProduction = process.env.NODE_ENV === 'production';

  if (!secret) {
    if (isProduction || forceStrict) {
      throw new Error("JWT_SECRET_MISSING: Defina a variável JWT_SECRET no painel da Vercel.");
    }
    return 'default_dev_secret_only_for_local_tests';
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
  // A verificação acontece aqui, evitando crash no import do arquivo
  const secret = getJwtSecret(true); 
  return jwt.sign(payload, secret, { expiresIn: '15m' });
}

/**
 * Verifica a autenticidade e validade do token.
 */
export function verifyJwt(token: string) {
  const secret = getJwtSecret(true);
  return jwt.verify(token, secret) as { sub: string; email: string; plan_tier: string };
}

export function generateRefreshToken(): string {
  return crypto.randomBytes(40).toString('hex');
}
