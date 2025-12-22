
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
  const baseStyles = "inline-flex items-center justify-center font-bold transition-all duration-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.96] select-none rounded-[20px]";
  
  const variants = {
    primary: "bg-blue-600 text-white shadow-[0_10px_25px_-5px_rgba(37,99,235,0.4)] hover:bg-blue-700 hover:shadow-[0_15px_30px_-5px_rgba(37,99,235,0.5)] border-none",
    secondary: "bg-white text-slate-700 border-2 border-slate-100 hover:border-blue-600 hover:text-blue-600 shadow-sm",
    white: "bg-white text-blue-600 hover:bg-slate-50 shadow-xl border-none",
    dark: "bg-slate-900 text-white hover:bg-slate-800 shadow-lg border-none",
    ghost: "text-slate-500 hover:text-blue-600 hover:bg-blue-50 border-none",
    danger: "bg-red-500 text-white hover:bg-red-600 shadow-lg border-none",
    glass: "bg-white/10 text-white border border-white/20 backdrop-blur-md hover:bg-white/20"
  };

  const sizes = {
    sm: "px-4 h-10 text-xs",
    md: "px-6 h-12 text-sm",
    lg: "px-10 h-16 text-lg",
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
