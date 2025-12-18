
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

/**
 * GESTÃO DE SEGURANÇA - JWT SECRET
 * 
 * Por que esta alteração é crítica:
 * Em produção, um atacante que conheça o "fallback secret" (ex: 'default_dev_secret') 
 * pode assinar seus próprios tokens JWT, forjando identidades de usuários e 
 * obtendo acesso administrativo (Privilege Escalation).
 * 
 * Esta implementação garante que o backend falhe imediatamente se não houver 
 * uma chave forte configurada em ambiente produtivo.
 */
const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  const isProduction = process.env.NODE_ENV === 'production';

  if (!secret) {
    if (isProduction) {
      // Interrompe a execução da função imediatamente.
      // Em Vercel, isso resultará em um erro 500 no log de runtime,
      // protegendo os dados de um login com segredo fraco.
      throw new Error(
        "CRITICAL_SECURITY_ERROR: A variável de ambiente JWT_SECRET não foi definida em PROD. " +
        "Tokens não falsificáveis exigem um segredo de alta entropia configurado no painel da Vercel."
      );
    }

    // Em ambiente de desenvolvimento, permitimos o fallback para não travar o DX (Developer Experience).
    console.warn(
      "⚠️ SECURITY WARNING: Usando segredo JWT padrão de desenvolvimento. " +
      "Isso é INSEGURO para uso externo. Configure JWT_SECRET no seu .env.local"
    );
    return 'default_dev_secret_only_for_local_tests';
  }

  return secret;
};

// O segredo é carregado uma única vez na inicialização da instância da função.
const JWT_SECRET = getJwtSecret();

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Assina um novo JWT Access Token.
 * Expiração curta (15m) para mitigar riscos de roubo de sessão.
 */
export function signJwt(payload: { sub: string; email: string; plan_tier: string }) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
}

/**
 * Verifica a autenticidade e validade do token.
 * Se o segredo for inválido ou o token tiver sido alterado, lança um erro.
 */
export function verifyJwt(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as { sub: string; email: string; plan_tier: string };
  } catch (error) {
    // Log silencioso no backend para auditoria se necessário
    throw error; 
  }
}

export function generateRefreshToken(): string {
  return crypto.randomBytes(40).toString('hex');
}
