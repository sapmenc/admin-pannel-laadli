import React, { useState } from 'react';

const Switch = ({ 
  checked = false, 
  onChange, 
  disabled = false,
  className = ''
}) => {
  const [isChecked, setIsChecked] = useState(checked);

  const handleToggle = () => {
    if (!disabled) {
      const newValue = !isChecked;
      setIsChecked(newValue);
      if (onChange) {
        onChange(newValue);
      }
    }
  };

  return (
    <div 
      className={`relative h-[35px] w-[35px] cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      onClick={handleToggle}
    >
      {isChecked ? (
        <img 
          src="/images/img_famiconstoggle.svg" 
          alt="Toggle On" 
          className="h-full w-full"
        />
      ) : (
        <div className="relative h-full w-full">
          <img 
            src="/images/img_vector_gray_800.svg" 
            alt="Toggle Background" 
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-[81px] w-[39px]"
          />
          <img 
            src="/images/img_vector.svg" 
            alt="Toggle Handle" 
            className="absolute top-1/2 ml-3 transform -translate-x-1/2 -translate-y-1/2 h-[10px] w-[10px]"
          />
        </div>
      )}
    </div>
  );
};

export default Switch;