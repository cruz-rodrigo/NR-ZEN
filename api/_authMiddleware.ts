import type { VercelRequest, VercelResponse } from '@vercel/node';
import { verifyJwt } from './_authUtils';

export interface AuthedRequest extends VercelRequest {
  user?: { id: string; email: string; plan_tier: string };
  headers: { authorization?: string; [key: string]: string | string[] | undefined };
  method?: string;
}

export function requireAuth(
  handler: (req: AuthedRequest, res: VercelResponse) => Promise<void> | void,
) {
  return async (req: AuthedRequest, res: VercelResponse) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: Missing token' });
    }

    const token = authHeader.substring('Bearer '.length);

    try {
      const payload = verifyJwt(token);
      req.user = { id: payload.sub, email: payload.email, plan_tier: payload.plan_tier };
      return handler(req, res);
    } catch (e) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
  };
}