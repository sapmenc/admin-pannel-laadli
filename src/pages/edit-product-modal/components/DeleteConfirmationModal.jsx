import React from 'react';
import ModalOverlay from './DeleteModal';

const DeleteConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  productName 
}) => {
  return (
    <ModalOverlay isOpen={isOpen} onClose={onClose}>
      <div className="p-6 rounded-lg text-2xl w-full  bg-white flex flex-col  items-align-center justify-content-center">
        <p className="text-[#4b2b2b] text-center mb-6">
          Are you sure, you want to delete <span className="font-semibold">{productName}</span>
        </p>
        
        <div className="flex justify-center items-center space-x-4 m-was-xs">
          <button
            onClick={onConfirm}
            className="mt-6 w-[200px] py-2 bg-[#f6e3c5] text-[#4b2b2b] font-serif text-xl rounded-md shadow-md border border-[#eac089] hover:shadow-lg transition-all"
          >
            Yes
          </button>
          <button
            onClick={onClose}
            className="active mt-6 w-[200px] py-2 bg-sidebar-1 text-[#4b2b2b] font-serif text-xl rounded-md shadow-md border border-[#eac089] hover:shadow-lg transition-all"
          >
            No
          </button>
        </div>
      </div>
    </ModalOverlay>
  );
};

export default DeleteConfirmationModal;