import React, { useEffect } from 'react';

const ModalOverlay = ({ isOpen, onClose, children }) => {
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end"
      onClick={handleOverlayClick}
    >
      <div 
        className="flex justify-center relative right-4 bg-white rounded-lg shadow-xl w-[380px] max-h-[36vh] overflow-y-auto border-1 border-[#4b2b2b]"
        style={{ top: '50%', transform: 'translateY(-82%)'}}
      >
        {children}
      </div>
    </div>
  );
};

export default ModalOverlay;