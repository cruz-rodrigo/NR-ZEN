
import React from 'react';
import { AlertCircle, Mail } from 'lucide-react';

interface Props {
  email: string;
  confirmEmail: string;
  onEmailChange: (val: string) => void;
  onConfirmEmailChange: (val: string) => void;
  labelEmail?: string;
  labelConfirm?: string;
}

const EmailConfirmationFields: React.FC<Props> = ({
  email,
  confirmEmail,
  onEmailChange,
  onConfirmEmailChange,
  labelEmail = "E-mail Corporativo",
  labelConfirm = "Confirme seu E-mail"
}) => {
  const mismatch = confirmEmail.length > 0 && 
    email.trim().toLowerCase() !== confirmEmail.trim().toLowerCase();

  return (
    <div className="space-y-4 w-full">
      {/* E-mail Principal */}
      <div className="w-full">
        <label className="block text-sm font-bold text-slate-700 mb-1.5">{labelEmail}</label>
        <div className="relative">
          <input 
            type="email" 
            required
            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none transition-all font-medium text-slate-700"
            value={email}
            onChange={e => onEmailChange(e.target.value)}
            placeholder="seu@email.com"
          />
          <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        </div>
      </div>

      {/* Confirmação de E-mail */}
      <div className="w-full">
        <label className="block text-sm font-bold text-slate-700 mb-1.5">{labelConfirm}</label>
        <div className="relative">
          <input 
            type="email" 
            required
            onPaste={(e) => e.preventDefault()} // Impede erros de copiar/colar o erro
            className={`w-full pl-11 pr-4 py-3 bg-white border rounded-xl focus:ring-2 outline-none transition-all font-medium text-slate-700 ${
              mismatch ? 'border-red-500 focus:ring-red-500 bg-red-50/30' : 'border-slate-200 focus:ring-blue-600'
            }`}
            value={confirmEmail}
            onChange={e => onConfirmEmailChange(e.target.value)}
            placeholder="Repita o e-mail"
          />
          <Mail size={18} className={`absolute left-4 top-1/2 -translate-y-1/2 ${mismatch ? 'text-red-400' : 'text-slate-400'}`} />
        </div>
        {mismatch ? (
          <p className="text-red-600 text-[10px] mt-1.5 font-bold flex items-center gap-1 animate-fade-in">
            <AlertCircle size={12} /> Os e-mails não coincidem.
          </p>
        ) : (
          <p className="text-[10px] text-slate-400 font-medium leading-tight mt-1.5 italic">
            Redigite para garantir o acesso correto.
          </p>
        )}
      </div>
    </div>
  );
};

export default EmailConfirmationFields;
