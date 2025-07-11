import React from 'react';
import ModalOverlay from './FilterModal';

const FilterModal = ({ 
  isOpen, 
  onClose, 
  onApply, 
  onClear,
  selectedCategory,
  onCategoryChange,
  selectedStatus,
  onStatusChange
}) => {

  const handleToggle = () => {
    const newValue = !(selectedStatus === true);
    onStatusChange(newValue);
  };

  const handleApply = () => {
    onApply({
      category: selectedCategory,
      status: selectedStatus || false,
    });
    onClose();
  };

  const handleClearAndClose = () => {
    onClear();
    onClose();
  };

  const isApplyEnabled = selectedCategory || selectedStatus;

  return (
    <ModalOverlay isOpen={isOpen} onClose={onClose}>
      <div className="p-6 bg-white rounded-lg max-w-xs text-global-2 text-2xl font-bellefair">
        <div className="space-y-8 flex flex-col">

          {/* Category Filter */}
          <div className="flex items-center gap-5">
            <h3>Category</h3>
            <div className="flex gap-8">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="category"
                  value="Luxe"
                  checked={selectedCategory === 'Luxe'}
                  onChange={() => onCategoryChange('Luxe')}
                  className="h-5 w-5 border-2 border-gray-300 text-[#4b2b2b] checked:bg-[#4b2b2b] checked:border-[#4b2b2b] appearance-none rounded-full transition-colors duration-200"
                />
                <span>Luxe</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="category"
                  value="Premium"
                  checked={selectedCategory === 'Premium'}
                  onChange={() => onCategoryChange('Premium')}
                  className="h-5 w-5 border-2 border-gray-300 text-[#4b2b2b] checked:bg-[#4b2b2b] checked:border-[#4b2b2b] appearance-none rounded-full transition-colors duration-200"
                />
                <span>Premium</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="category"
                  value="Other Drapes"
                  checked={selectedCategory === 'Other Drapes'}
                  onChange={() => onCategoryChange('Other Drapes')}
                  className="h-5 w-5 border-2 border-gray-300 text-[#4b2b2b] checked:bg-[#4b2b2b] checked:border-[#4b2b2b] appearance-none rounded-full transition-colors duration-200"
                />
                <span>Drapes</span>
              </label>
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-5">
            <h3>Status</h3>
            <div className="flex items-center space-x-2">
              <div 
                className="relative h-[35px] w-[35px] cursor-pointer"
                onClick={handleToggle}
              >
                {selectedStatus === true ? (
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
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between pt-6 gap-6 ">
            <button
              onClick={handleClearAndClose}
              className="w-full py-3 bg-[#f6e3c5] text-sidebar-1 font-serif text-xl rounded-md shadow-md border border-[#eac089] hover:shadow-lg transition-all"
            >
              Clear
            </button>
            <button
              onClick={handleApply}
              disabled={!isApplyEnabled}
              className={`w-full py-3 font-serif text-xl rounded-md shadow-md border transition-all ${
                isApplyEnabled
                  ? 'bg-sidebar-1 text-[#4b2b2b] border-sidebar-1 hover:bg-sidebar-1-dark hover:shadow-lg'
                  : 'w-full py-3 bg-[#f6e3c5] text-sidebar-1 font-serif text-xl rounded-md shadow-md border border-[#eac089] hover:shadow-lg transition-all'
              }`}
            >
              Apply
            </button>
          </div>

        </div>
      </div>
    </ModalOverlay>
  );
};

export default FilterModal;
