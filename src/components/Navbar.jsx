import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-row items-center justify-between w-full h-[50px] px-8 py-4">
      <div className="flex items-center">
        <img 
          src="/images/img_headerlogo.png" 
          alt="Header Logo" 
          className="h-12 w-[165px] object-contain cursor-pointer"
          onClick={() => navigate('/')}
        />
      </div>
      <div className="flex items-center">
        <img 
          src="/images/img_iconamoonprofile.svg" 
          alt="Profile" 
          className="h-[50px] w-[50px] cursor-pointer hover:opacity-80"
        />
      </div>
    </div>
  );
};

export default Header;