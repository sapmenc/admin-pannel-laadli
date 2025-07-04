import React, { useState, useEffect, useMemo } from 'react';
import { useUpdateProduct } from '../../hooks/use-edit-product';
import ModalOverlay from './components/ModalOverlay';
import FileUploadSection from './components/FileUploadsection';
import { toast } from 'react-toastify';

const EditProductModal = ({ isOpen, onClose, product, onProductUpdate }) => {
  const { mutate: updateProduct, isLoading } = useUpdateProduct({
    onSuccess: (updatedProduct) => {
      toast.success('Product updated successfully!');
      onProductUpdate(updatedProduct);
      handleClose();
    },
    onError: (error) => {
      toast.error(`Update failed: ${error.message}`);
    }
  });

  const [formData, setFormData] = useState({
    name: '',
    category: 'Premium',
    description: ''
  });

  const [files, setFiles] = useState(Array(5).fill(null));
  const [selectedOption, setSelectedOption] = useState(null);
  const [errors, setErrors] = useState({});
  const [initialState, setInitialState] = useState(null);

  useEffect(() => {
    if (product && isOpen) {
      const initialFormData = {
        name: product.name || '',
        category: product.category || 'Premium',
        description: product.description || ''
      };

      const media = product.media || [];
      const paddedMedia = [...media, ...Array(5 - media.length).fill(null)].slice(0, 5);

      setFormData(initialFormData);
      setFiles(paddedMedia);
      setSelectedOption(product.selectedOption ?? null);
      setInitialState({
        formData: initialFormData,
        files: paddedMedia,
        selectedOption: product.selectedOption ?? null
      });
    }
  }, [product, isOpen]);

  const hasChanges = useMemo(() => {
    if (!initialState) return false;

    const formChanged = Object.keys(formData).some(
      key => formData[key] !== initialState.formData[key]
    );

    const filesChanged = files.some((file, index) => {
      const initialFile = initialState.files[index];
      if (!file && !initialFile) return false;
      if (!file || !initialFile) return true;
      if (file instanceof File || initialFile instanceof File) return true;
      return file !== initialFile; // file is a string (URL)
    });

    const optionChanged = selectedOption !== initialState.selectedOption;

    return formChanged || filesChanged || optionChanged;
  }, [formData, files, selectedOption, initialState]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleFileSelect = (index, file) => {
    const newFiles = [...files];
    newFiles[index] = file;
    setFiles(newFiles);
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

    const updates = {
      ...formData,
      selectedOption,
      lastUpdated: new Date().toISOString(),
      media: files
        .map(file => (typeof file === 'string' ? file : null))
        .filter(Boolean)
    };

    const filesToUpload = files
      .map(file => (file instanceof File ? file : null))
      .filter(Boolean);

    updateProduct({
      id: product._id,
      updates,
      files: filesToUpload
    });
  };

  const handleClose = () => {
    if (product) {
      setFormData({
        name: product.name || '',
        category: product.category || 'Premium',
        description: product.description || ''
      });
      const media = product.media || [];
      const paddedMedia = [...media, ...Array(5 - media.length).fill(null)].slice(0, 5);
      setFiles(paddedMedia);
      setSelectedOption(product.selectedOption ?? null);
    }
    setErrors({});
    onClose();
  };

  return (
    <ModalOverlay isOpen={isOpen} onClose={handleClose}>
      <div className="p-6 bg-[var(--global-bg-1)] rounded-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-[var(--global-text-2)] font-bellefair text-2xl">
            {isLoading ? 'Updating...' : 'Edit Product'}
          </h2>
          <button 
            onClick={handleClose} 
            className="text-2xl text-[var(--global-text-2)]"
            disabled={isLoading}
          >
            ×
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-8">
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Product Name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={`w-full rounded-md border ${
                errors.name ? 'border-red-500' : 'border-[var(--global-text-2)]'
              } px-4 py-3 bg-white text-base font-lora placeholder:text-[var(--global-text-2)] text-[var(--global-text-2)]`}
              disabled={isLoading}
            />
            {errors.name && <span className="text-red-500 text-sm">{errors.name}</span>}

            <select
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              className="w-full rounded-md border border-[var(--global-text-2)] px-4 py-3 bg-white text-base font-lora text-[var(--global-text-2)]"
              disabled={isLoading}
            >
              <option value="Premium">Premium</option>
              <option value="Luxe">Luxe</option>
            </select>

            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={6}
              className={`w-full rounded-md border ${
                errors.description ? 'border-red-500' : 'border-[var(--global-text-2)]'
              } px-4 py-3 bg-white text-base font-lora placeholder:text-[var(--global-text-2)] text-[var(--global-text-2)] resize-vertical`}
              disabled={isLoading}
            />
            {errors.description && <span className="text-red-500 text-sm">{errors.description}</span>}

            <div className="border border-[var(--global-text-2)] bg-[#fff8f0] text-[var(--global-text-2)] text-sm font-lora rounded-lg p-3">
              Note: Please optimize image and video assets to improve site loading speed. Use{' '}
              <a href="https://cloudconvert.com" target="_blank" rel="noopener noreferrer" className="underline">
                CloudConvert
              </a>{' '}
              tool to convert images & Video to Webp & Webm format respectively.
            </div>
          </div>

          <div className="hidden md:block border-r border-[#A0A0A0] mx-4 opacity-60"></div>

          <div className='flex flex-col gap-4 w-full'>
            <div className="border border-[var(--global-text-2)] bg-[#fff8f0] text-[var(--global-text-2)] text-sm font-lora rounded-lg p-3">
              Note: First Image will be selected as Main Cover Image of Product.
            </div>
            <div className="grid grid-cols-2 gap-2 gap-y-3">
              {files.map((file, index) => (
                <div key={index} className="flex items-start space-x-0">
                  <input
                    type="radio"
                    name="primaryFile"
                    checked={selectedOption === index}
                    onChange={() => setSelectedOption(index)}
                    className="accent-[var(--global-text-2)] mt-3 mr-2"
                    disabled={isLoading}
                  />
                  <FileUploadSection
                    onFileSelect={(file) => handleFileSelect(index, file)}
                    selectedFile={file}
                    disabled={isLoading}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-6 flex justify-center">
          <button
            onClick={handleSave}
            disabled={isLoading}
            className={`mt-6 w-[200px] py-2 ${
              isLoading 
                ? 'bg-gray-300' 
                : hasChanges 
                  ? 'bg-[var(--bg-sidebar-1)] hover:shadow-lg' 
                  : 'bg-[#f6e3c5] hover:shadow-lg'
            } text-[#4b2b2b] font-serif text-xl rounded-md shadow-md border ${
              isLoading ? 'border-gray-400' : 'border-[#eac089]'
            } transition-all`}
          >
            {isLoading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </ModalOverlay>
  );
};

export default EditProductModal;
