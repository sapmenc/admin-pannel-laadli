import React, { useState } from 'react';

const Pagination = ({ 
  currentPage = 1, 
  totalPages = 7, 
  onPageChange,
  className = ''
}) => {
  const [activePage, setActivePage] = useState(currentPage);

  const handlePageClick = (page) => {
    setActivePage(page);
    if (onPageChange) {
      onPageChange(page);
    }
  };

  const handlePrevious = () => {
    if (activePage > 1) {
      handlePageClick(activePage - 1);
    }
  };

  const handleNext = () => {
    if (activePage < totalPages) {
      handlePageClick(activePage + 1);
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <div
          key={i}
          className={`flex items-center justify-center h-[25px] w-[23px] cursor-pointer ${
            i === activePage ? 'bg-global-3 rounded-[5px]' : ''
          }`}
          onClick={() => handlePageClick(i)}
        >
          <span className="text-global-2 font-cinzel text-base leading-6 text-center">
            {i}
          </span>
        </div>
      );
    }
    return pages;
  };

  return (
    <div className={`flex flex-row items-center h-[41px] w-[292px] bg-global-1 px-2 ${className}`}>
      <img 
        src="/images/img_fearrowdown.svg" 
        alt="Previous" 
        className="h-[17px] w-[17px] cursor-pointer mr-4 rotate-180"
        onClick={handlePrevious}
      />
      
      <div className="flex flex-row items-center space-x-4">
        {renderPageNumbers()}
      </div>

      <img 
        src="/images/img_fearrowdown_gray_800.svg" 
        alt="Next" 
        className="h-[17px] w-[17px] cursor-pointer ml-4"
        onClick={handleNext}
      />
    </div>
  );
};

export default Pagination;