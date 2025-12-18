
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { verifyJwt } from './_authUtils.js';

/**
 * Interface estendida para requisições autenticadas.
 * O campo user é injetado pelo middleware após a validação do JWT.
 */
export interface AuthedRequest extends VercelRequest {
  user?: { id: string; email: string; plan_tier: string };
  headers: { authorization?: string; [key: string]: string | string[] | undefined };
  method?: string;
  body: any;
  query: { [key: string]: string | string[] };
}

/**
 * Middleware requireAuth
 * Intercepta a requisição e valida o Bearer Token no cabeçalho Authorization.
 */
export function requireAuth(
  handler: (req: AuthedRequest, res: VercelResponse) => Promise<any> | any,
) {
  return async (req: AuthedRequest, res: VercelResponse) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'Unauthorized', 
        message: 'Cabeçalho de autenticação ausente ou malformatado.' 
      });
    }

    const token = authHeader.substring('Bearer '.length);

    try {
      // A verificação falhará se o JWT_SECRET for inconsistente ou se o token expirou.
      const payload = verifyJwt(token);
      
      // Injeta os dados do usuário para uso nos handlers seguintes (ex: filtragem de tenant por user_id)
      req.user = { 
        id: payload.sub, 
        email: payload.email, 
        plan_tier: payload.plan_tier 
      };
      
      return handler(req, res);
    } catch (e: any) {
      // Diferencia erros de expiração de erros de assinatura (falsificação)
      const isExpired = e.name === 'TokenExpiredError';
      
      return res.status(401).json({ 
        error: 'Unauthorized', 
        message: isExpired ? 'Sessão expirada. Por favor, renove seu acesso.' : 'Token de acesso inválido.',
        code: isExpired ? 'TOKEN_EXPIRED' : 'INVALID_TOKEN'
      });
    }
  };
}
