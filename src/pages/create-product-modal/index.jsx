import React, { useState } from 'react';
import ModalOverlay from '../edit-product-modal/components/ModalOverlay';
import FileUploadSection from '../edit-product-modal/components/FileUploadsection';
import { useCreateProduct } from '../../hooks/use-create-product';

const CreateProductModal = ({ isOpen, onClose, onProductCreate }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Premium',
    description: '',
    slug: '',
    status: false
  });

  const [files, setFiles] = useState(Array(5).fill(null));
  const [selectedOption, setSelectedOption] = useState(null);
  const [errors, setErrors] = useState({});
  const [localLoading, setLocalLoading] = useState(false);
  const { mutate: createProduct } = useCreateProduct();

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
    if (!formData.slug.trim()) newErrors.slug = 'Product tag is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('category', formData.category);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('slug', formData.slug);
    formDataToSend.append('status', 'false');

    files.forEach(file => {
      if (file) formDataToSend.append('media', file);
    });

    setLocalLoading(true);

    try {
      await createProduct(formDataToSend, {
        onSuccess: (data) => {
          const newProduct = {
            ...data,
            files,
            selectedOption,
            createdOn: new Date().toLocaleString('en-GB'),
            lastUpdated: new Date().toLocaleString('en-GB'),
            status: false
          };
          if (onProductCreate) onProductCreate(newProduct);
          handleClose();
        },
        onError: () => setLocalLoading(false)
      });
    } catch (error) {
      console.error('Error creating product:', error);
      setLocalLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      category: 'Premium',
      description: '',
      slug: '',
      status: false
    });
    setFiles(Array(5).fill(null));
    setErrors({});
    setSelectedOption(null);
    setLocalLoading(false);
    onClose();
  };

  return (
    <ModalOverlay isOpen={isOpen} onClose={handleClose}>
      <div className="p-6 bg-[var(--global-bg-1)] rounded-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-[var(--global-text-2)] font-bellefair text-2xl">New Product</h2>
          <button onClick={handleClose} className="text-2xl text-[var(--global-text-2)]">×</button>
        </div>

        {/* Main Layout with Divider */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Form Section */}
          <div className="w-full md:w-1/2 space-y-4">
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
              <option value="Premium">Premium</option>
              <option value="Luxe">Luxe</option>
            </select>

            <input
              type="text"
              placeholder="One tag only"
              value={formData.slug}
              onChange={(e) => handleInputChange('slug', e.target.value)}
              className={`w-full rounded-xl border ${
                errors.slug ? 'border-red-500' : 'border-[var(--global-text-2)]'
              } px-4 py-3 bg-white text-base font-lora placeholder:text-[var(--global-text-2)] text-[var(--global-text-2)]`}
            />
            {errors.slug && <span className="text-red-500 text-sm">{errors.slug}</span>}
            <div className="text-xs text-[var(--global-text-2)] -mt-2">
              This will be used in the product URL (e.g., yoursite.com/products/[tag])
            </div>

            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={2}
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

          {/* Middle Divider */}
          <div className="hidden md:block border-r border-[#A0A0A0] mx-4 opacity-60"></div>

          {/* Upload Section */}
          <div className="w-full md:w-1/2 grid grid-cols-2 gap-4">
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
            disabled={localLoading}
            className={`mt-6 w-[200px] py-2 bg-[#f6e3c5] text-[#4b2b2b] font-serif text-xl rounded-md shadow-md border border-[#eac089] hover:shadow-lg transition-all ${
              localLoading ? 'opacity-70 cursor-not-allowed' : ''
            } flex items-center justify-center gap-2`}
          >
            {localLoading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-[#4b2b2b]"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
                Creating...
              </>
            ) : (
              'Create'
            )}
          </button>
        </div>
      </div>
    </ModalOverlay>
  );
};

export default CreateProductModal;
