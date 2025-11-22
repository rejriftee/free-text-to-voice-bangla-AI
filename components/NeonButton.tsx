import React from 'react';

interface NeonButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'cyan' | 'pink';
  isLoading?: boolean;
}

const NeonButton: React.FC<NeonButtonProps> = ({ 
  children, 
  variant = 'cyan', 
  isLoading = false, 
  className = '',
  disabled,
  ...props 
}) => {
  const baseColor = variant === 'cyan' ? 'cyan' : 'fuchsia';
  
  // Tailwind safelist logic requires complete strings if not dynamically compiled correctly in some environments, 
  // but standard tailwind handles interpolated strings if the class names exist. 
  // To be safe, I'll use static maps or template literals that resolve to valid utility classes.
  
  const colors = {
    cyan: {
      text: 'text-cyan-950',
      bg: 'bg-cyan-400',
      hoverBg: 'hover:bg-cyan-300',
      shadow: 'shadow-[0_0_20px_rgba(34,211,238,0.6)]',
      hoverShadow: 'hover:shadow-[0_0_30px_rgba(34,211,238,0.8)]',
      disabled: 'disabled:bg-gray-700 disabled:text-gray-500 disabled:shadow-none disabled:cursor-not-allowed'
    },
    pink: {
      text: 'text-fuchsia-950',
      bg: 'bg-fuchsia-400',
      hoverBg: 'hover:bg-fuchsia-300',
      shadow: 'shadow-[0_0_20px_rgba(232,121,249,0.6)]',
      hoverShadow: 'hover:shadow-[0_0_30px_rgba(232,121,249,0.8)]',
      disabled: 'disabled:bg-gray-700 disabled:text-gray-500 disabled:shadow-none disabled:cursor-not-allowed'
    }
  };

  const theme = colors[variant];

  return (
    <button
      disabled={disabled || isLoading}
      className={`
        ${theme.bg} ${theme.text} ${theme.shadow} ${theme.hoverBg} ${theme.hoverShadow} ${theme.disabled}
        font-bold uppercase tracking-widest py-4 px-8 rounded-full transition-all duration-300
        flex items-center justify-center gap-3 text-lg w-full md:w-auto transform active:scale-95
        ${className}
      `}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {children}
    </button>
  );
};

export default NeonButton;
