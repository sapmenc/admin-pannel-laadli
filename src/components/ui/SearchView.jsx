import React, { useState } from 'react';

const SearchView = ({ 
  placeholder = "Search by Product", 
  onSearch, 
  className = '' 
}) => {
  const [searchValue, setSearchValue] = useState('');

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  return (
    <div className={`relative flex flex-row items-center h-[50px] w-[402px] ${className}`}>
      <div className="flex flex-row items-center w-full h-full bg-global-2 border border-global-text-2 rounded-[10px] px-4">
        <input
          type="text"
          value={searchValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-searchview-1 font-bellefair text-xl leading-6 outline-none placeholder-searchview-1"
        />
      </div>
      <img 
        src="/images/img_search.svg" 
        alt="Search" 
        className="absolute right-4 h-[30px] w-[30px] cursor-pointer"
      />
    </div>
  );
};

export default SearchView;