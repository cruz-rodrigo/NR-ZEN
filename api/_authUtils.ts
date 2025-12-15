import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'default_dev_secret';

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signJwt(payload: { sub: string; email: string; plan_tier: string }) {
  // Short-lived Access Token (15 minutes)
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
}

export function verifyJwt(token: string) {
  return jwt.verify(token, JWT_SECRET) as { sub: string; email: string; plan_tier: string };
}

export function generateRefreshToken(): string {
  return crypto.randomBytes(40).toString('hex');
}