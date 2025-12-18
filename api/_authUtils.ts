
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

/**
 * Obtém o segredo JWT de forma segura.
 * Se a variável de ambiente não existir, utiliza um fallback para não interromper o serviço
 * durante a fase de demonstração e testes iniciais.
 */
const getJwtSecret = (): string => {
  return process.env.JWT_SECRET || 'nrzen_default_secret_key_for_immediate_usage_2025';
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
  // Token válido por 4 horas para facilitar o uso durante testes
  return jwt.sign(payload, secret, { expiresIn: '4h' });
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
