import React from 'react';

const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'md', 
  disabled = false,
  icon = null,
  className = ''
}) => {
  const baseClasses = 'flex flex-row items-center justify-center border border-global-text-2 rounded-[10px] bg-global-2 cursor-pointer hover:opacity-80 transition-opacity';
  
  const sizeClasses = {
    sm: 'px-3 py-1 text-sm h-8',
    md: 'px-4 py-2 h-[50px]',
    lg: 'px-5 py-3 text-lg h-12'
  };

  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`${baseClasses} ${sizeClasses[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {icon && (
        <img src={icon} alt="" className="h-[30px] w-[30px] mr-3" />
      )}
      <span className="text-global-1 font-bellefair text-xl leading-6">
        {children}
      </span>
    </button>
  );
};

export default Button;