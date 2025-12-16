import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 32, showText = true }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 32 32" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="text-nexus-primary shrink-0"
      >
        {/* Seta estilizada baseada na imagem enviada (Arrow Up Right) */}
        <path 
          d="M6 24 L14 16 L18 20 L26 8" 
          stroke="currentColor" 
          strokeWidth="4" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
        <path 
          d="M26 8 H18 M26 8 V16" 
          stroke="currentColor" 
          strokeWidth="4" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
        {/* Efeito de brilho/sombra suave atrás para dar volume */}
        <path 
          d="M6 24 L14 16 L18 20 L26 8" 
          stroke="currentColor" 
          strokeWidth="4" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="opacity-50 blur-[2px]"
        />
      </svg>
      
      {showText && (
        <div className="flex flex-col justify-center">
          <span className="font-sans font-bold text-white tracking-wide text-xl leading-none">
            NEXUS<span className="font-light text-gray-300">TRADE</span>
          </span>
        </div>
      )}
    </div>
  );
};