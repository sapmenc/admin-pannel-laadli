import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    // Add actual logout logic here, like clearing tokens
    localStorage.clear(); // or just remove auth token
    navigate('/login');
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex flex-row items-center justify-between w-full h-[50px] px-8 py-4 relative mb-5">
      <div className="flex items-center">
        <img 
          src="/images/img_headerlogo.png" 
          alt="Header Logo" 
          className="h-12 w-[165px] object-contain cursor-pointer"
          onClick={() => navigate('/')}
        />
      </div>

      <div className="flex items-center relative" ref={dropdownRef}>
        <img 
          src="/images/img_iconamoonprofile.svg" 
          alt="Profile" 
          className="h-[50px] w-[50px] cursor-pointer hover:opacity-80"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        />

        {dropdownOpen && (
          <div className="absolute right-0 top-[60px] z-50 bg-[#CCAE84] rounded-md shadow-md w-[160px] py-2">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 hover:bg-[#b99b70] transition-all duration-200"
            >
              <img 
                src="/images/upload_icons.png" // your red arrow logout icon
                alt="Logout Icon" 
                style={{ transform: 'rotate(90deg)' }}
                className="h-8 w-8 mr-3"
              />
              <span className="text-black font-lora text-base">Log Out</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
