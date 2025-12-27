
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'white' | 'glass' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  className = '',
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center font-heading font-black uppercase tracking-[0.15em] transition-all duration-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.96] select-none rounded-[22px]";
  
  const variants = {
    primary: "bg-blue-600 text-white shadow-[0_15px_35px_-5px_rgba(37,99,235,0.45)] hover:bg-blue-700 hover:shadow-[0_25px_50px_-10px_rgba(37,99,235,0.5)] border-none",
    secondary: "bg-white text-slate-700 border-2 border-slate-100 hover:border-blue-600 hover:text-blue-600 shadow-sm",
    white: "bg-white text-blue-600 hover:bg-slate-50 shadow-2xl border-none",
    dark: "bg-slate-900 text-white hover:bg-slate-800 shadow-xl border-none",
    ghost: "text-slate-500 hover:text-blue-600 hover:bg-blue-50 border-none",
    danger: "bg-red-500 text-white hover:bg-red-600 shadow-lg border-none",
    glass: "bg-white/10 text-white border-2 border-white/20 backdrop-blur-xl hover:bg-white/20"
  };

  const sizes = {
    sm: "px-6 h-12 text-[10px]",
    md: "px-10 h-16 text-[12px]",
    lg: "px-16 h-20 text-[14px]",
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
