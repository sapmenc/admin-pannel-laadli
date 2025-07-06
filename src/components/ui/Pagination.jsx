import React, { useState, useEffect } from 'react';

const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  className = ''
}) => {
  const [activePage, setActivePage] = useState(currentPage);
  const [visiblePages, setVisiblePages] = useState(8); // Always show 8 page numbers

  useEffect(() => {
    setActivePage(currentPage);
  }, [currentPage]);

  const handlePageClick = (page) => {
    if (page < 1 || page > totalPages) return;
    setActivePage(page);
    if (onPageChange) {
      onPageChange(page);
    }
  };

  const handlePrevious = () => {
    handlePageClick(activePage - 1);
  };

  const handleNext = () => {
    handlePageClick(activePage + 1);
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisible = Math.min(visiblePages, totalPages);

    // Always show up to 8 pages, starting from 1
    for (let i = 1; i <= maxVisible; i++) {
      pages.push(
        <div
          key={i}
          className={`flex items-center justify-center h-[25px] w-[23px] cursor-pointer ${i === activePage ? 'bg-global-3 rounded-[5px]' : ''
            }`}
          onClick={() => handlePageClick(i)}
        >
          <span className="text-global-2 font-cinzel text-base leading-6 text-center">
            {i}
          </span>
        </div>
      );
    }

    // Add ellipsis if there are more pages than visible
    if (totalPages > visiblePages) {
      pages.push(
        <div key="ellipsis" className="flex items-center justify-center h-[25px]">
          <span className="text-global-2 font-cinzel text-base leading-6">...</span>
        </div>
      );
    }

    return pages;
  };

  return (
    <div className={`flex flex-row items-center justify-center h-[41px] w-[292px] bg-global-1 px-2 ${className}`}>
      <img
        src="/images/img_fearrowdown_gray_800.svg"
        alt="Previous"
        style={{ transform: 'rotate(-180deg)' }}
        className={`h-[17px] w-[17px] cursor-pointer mr-4 ${activePage === 1 ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        onClick={handlePrevious}
      />


      <div className="flex flex-row items-center space-x-4">
        {renderPageNumbers()}
      </div>

      <img
        src="/images/img_fearrowdown_gray_800.svg"
        alt="Next"
        className={`h-[17px] w-[17px] cursor-pointer ml-4 ${activePage >= totalPages ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        onClick={handleNext}
      />
    </div>
  );
};

export default Pagination;