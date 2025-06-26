import React from "react";

const Button = ({ text, onClick, className = "", disabled = false, children }) => {
  return (
    <button 
      onClick={onClick}
      className={className}
      disabled={disabled}
    >
      {children ?? text}
    </button>
  );
};

export default Button;