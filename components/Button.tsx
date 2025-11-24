import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'white' | 'glass';
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
  // Added whitespace-nowrap to prevent text wrapping
  // Adjusted active:scale to 0.97 for better tactile feedback
  const baseStyles = "inline-flex items-center justify-center font-semibold whitespace-nowrap transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg active:scale-[0.97] select-none";
  
  const variants = {
    // Primary: Royal Blue Gradient vibe (Solid color)
    primary: "bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-md hover:shadow-lg hover:shadow-blue-600/30 border border-transparent focus:ring-blue-600",
    
    // Secondary: White bg with Blue text/border. 
    // INCREASED CONTRAST: border-slate-300 instead of 200 for better visibility on white backgrounds
    secondary: "bg-white text-slate-700 border border-slate-300 hover:border-blue-600 hover:text-blue-700 hover:bg-blue-50/50 focus:ring-blue-200 shadow-sm",
    
    // White: Pure white, strong shadow (Good for dark backgrounds like Pricing or Hero)
    white: "bg-white text-blue-700 hover:bg-slate-50 border border-transparent shadow-lg focus:ring-white/50",
    
    // Ghost: Subtle, no border
    ghost: "text-slate-600 hover:text-blue-700 hover:bg-slate-100 focus:ring-slate-200",
    
    // Danger
    danger: "bg-red-600 text-white hover:bg-red-700 shadow-sm focus:ring-red-500",
    
    // Glass: For the Hero section (Translucent). Improved text contrast.
    glass: "bg-white/10 text-white border border-white/30 hover:bg-white/20 backdrop-blur-md shadow-lg focus:ring-white/50"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-8 py-3.5 text-base",
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