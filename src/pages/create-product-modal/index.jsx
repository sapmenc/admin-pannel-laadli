import React, { useState } from 'react';
import ModalOverlay from '../edit-product-modal/components/ModalOverlay';
import FileUploadSection from '../edit-product-modal/components/FileUploadsection';

const CreateProductModal = ({ isOpen, onClose, onProductCreate }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Premium',
    description: ''
  });

  const [files, setFiles] = useState(Array(5).fill(null));
  const [selectedOption, setSelectedOption] = useState(null);
  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleFileSelect = (index, file) => {
    setFiles(prev => {
      const updated = [...prev];
      updated[index] = file;
      return updated;
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.description.trim()) newErrors.description = 'Product description is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    const newProduct = {
      id: Date.now(),
      ...formData,
      files,
      selectedOption,
      createdOn: new Date().toLocaleString('en-GB'),
      lastUpdated: new Date().toLocaleString('en-GB'),
      status: true
    };

    if (onProductCreate) onProductCreate(newProduct);
    handleClose();
  };

  const handleClose = () => {
    setFormData({ name: '', category: 'Premium', description: '' });
    setFiles(Array(5).fill(null));
    setErrors({});
    setSelectedOption(null);
    onClose();
  };

  return (
    <ModalOverlay isOpen={isOpen} onClose={handleClose}>
      <div className="p-6 bg-[var(--global-bg-1)] rounded-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-[var(--global-text-2)] font-bellefair text-2xl">New Product</h2>
          <button onClick={handleClose} className="text-2xl text-[var(--global-text-2)]">×</button>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Product Name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={`w-full rounded-xl border ${
                errors.name ? 'border-red-500' : 'border-[var(--global-text-2)]'
              } px-4 py-3 bg-white text-base font-lora placeholder:text-[var(--global-text-2)] text-[var(--global-text-2)]`}
            />
            {errors.name && <span className="text-red-500 text-sm">{errors.name}</span>}

            <select
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              className="w-full rounded-xl border border-[var(--global-text-2)] px-4 py-3 bg-white text-base font-lora text-[var(--global-text-2)]"
            >
              <option value="Premium" >Premium</option>
              <option value="Luxe">Luxe</option>
            </select>

            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={4}
              className={`w-full rounded-xl border ${
                errors.description ? 'border-red-500' : 'border-[var(--global-text-2)]'
              } px-4 py-3 bg-white text-base font-lora placeholder:text-[var(--global-text-2)] text-[var(--global-text-2)] resize-vertical`}
            />
            {errors.description && <span className="text-red-500 text-sm">{errors.description}</span>}

            <div className="border border-[var(--global-text-2)] bg-[#fff8f0] text-[var(--global-text-2)] text-sm font-lora rounded-lg p-3">
              Note: Please optimize image and video assets to improve site loading speed. Use{' '}
              <a href="https://cloudconvert.com" target="_blank" rel="noopener noreferrer" className="underline">
                CloudConvert
              </a>{' '}
              to reduce file sizes.
            </div>
          </div>

          {/* Upload Section (2 in row layout) */}
          <div className="grid grid-cols-2 gap-4">
            {files.map((file, index) => (
              <div key={index} className="flex items-center space-x-3">
                <input
                  type="radio"
                  name="primaryFile"
                  checked={selectedOption === index}
                  onChange={() => setSelectedOption(index)}
                  className="accent-[var(--global-text-2)] mt-1"
                />
                <FileUploadSection
                  onFileSelect={(file) => handleFileSelect(index, file)}
                  selectedFile={file}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-6 flex justify-center">
          <button
            onClick={handleSave}
            className="mt-6 w-[200px] py-2 bg-[#f6e3c5] text-[#4b2b2b] font-serif text-xl rounded-md shadow-md border border-[#eac089] hover:shadow-lg transition-all"
          >
            Create
          </button>
        </div>
      </div>
    </ModalOverlay>
  );
};

export default CreateProductModal;