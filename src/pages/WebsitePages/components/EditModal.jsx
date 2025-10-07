import React, { useState } from 'react';
import Button from '../../../components/ui/Button';

const EditModal = ({ isOpen, onClose, onComplete }) => {
  const [imageKitLink, setImageKitLink] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState('File name will be displayed here');
  const [isSaving, setIsSaving] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');

  const handleImageKitChange = (e) => {
    setImageKitLink(e?.target?.value);
  };

  const handleFileUpload = (e) => {
    const file = e?.target?.files?.[0];
    if (file) {
      setSelectedFile(file);
      setFileName(file?.name);
    }
  };

  const handleSave = () => {
    setError('');
    setIsSaving(true);

    // Frontend-only mock logic (no backend)
    setTimeout(() => {
      if (selectedFile) {
        const url = URL.createObjectURL(selectedFile);
        const type = selectedFile.type || 'application/octet-stream';
        onComplete?.({ url, type, name: fileName, file: selectedFile });
      } else if (imageKitLink?.trim()) {
        const url = imageKitLink.trim();
        const derivedType = url.match(/\.(mp4|webm|mov)$/i)
          ? 'video/*'
          : 'image/*';
        onComplete?.({ url, type: derivedType, name: fileName, file: null });
      } else {
        setError('Please upload a file or provide a link');
        setIsSaving(false);
        return;
      }

      setProgress(100);
      setTimeout(() => {
        setIsSaving(false);
        setProgress(0);
        setSelectedFile(null);
        setImageKitLink('');
        setFileName('File name will be displayed here');
        onClose();
      }, 600);
    }, 1000);
  };

  const handleClose = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="flex justify-center items-center min-h-screen bg-black bg-opacity-50 fixed inset-0 z-50">
      <div className="bg-white rounded-[14px] w-full max-w-[916px] mx-4 sm:mx-6 lg:mx-auto">
        <div className="flex flex-col items-center p-4 sm:p-6">
          {/* Header */}
          <div className="flex justify-between items-center w-full mb-6 pl-[22px]">
            <h2 className="text-[20px] sm:text-[24px] font-bellefair font-normal leading-[28px] text-left text-global-3">
              Upload Media File
            </h2>
            <button
              onClick={handleClose}
              className="w-[34px] h-[34px] flex items-center justify-center hover:opacity-70 transition-opacity"
            >
              <img
                src="/images/img_basil_cross_solid.svg"
                alt="Close"
                className="w-[34px] h-[34px]"
              />
            </button>
          </div>

          {/* ImageKit Link Input */}
          <div className="w-full mb-4">
            <input
              type="text"
              value={imageKitLink}
              onChange={handleImageKitChange}
              placeholder="Paste ImageKit link"
              className="w-full px-[10px] py-[10px] pr-[34px] text-[14px] font-bellefair font-normal leading-[17px] text-left text-global-4 bg-white border border-[#bababa] rounded-[10px] focus:outline-none focus:ring-2 focus:ring-global-2 focus:border-transparent"
            />
          </div>

          {/* Open ImageKit Link */}
          <div className="w-full flex justify-end mb-5 pr-[22px]">
            <button
              onClick={() => window.open('https://imagekit.io/', '_blank')}
              className="text-[14px] font-bellefair font-normal leading-[17px] text-right text-global-2 underline hover:opacity-70 transition-opacity"
            >
              Open ImageKit
            </button>
          </div>

          {error ? (
            <div className="w-full mb-3 px-[22px]">
              <div className="text-red-600 text-[16px]">{error}</div>
            </div>
          ) : null}

          {/* OR Divider */}
          <div className="mb-5 ">
            <span className="text-[14px] font-bellefair font-normal leading-[17px] text-center text-global-1">
              OR
            </span>
          </div>

          {/* Upload Section */}
          <div className="flex flex-col sm:flex-row gap-[10px] items-center justify-between w-full mb-10 px-[22px]">
            <div className="relative w-full sm:w-auto">
              <input
                type="file"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                accept="image/*,video/*"
              />
              <Button
                onClick={() => {}}
                variant="primary"
                size="medium"
                className="bg-sidebar-1 text-button-1 w-full sm:w-auto px-[34px] py-[10px] text-[14px] font-bellefair font-normal leading-[17px] text-center border border-[#bababa] rounded-[10px]"
              >
                Upload file
              </Button>
            </div>

            <div className="flex-1 px-[10px] py-[10px] pr-[34px] text-[14px] font-bellefair font-normal leading-[17px] text-left text-global-4 bg-slate-200 border border-[#bababa] rounded-[10px] min-w-[200px] sm:min-w-[280px]">
              {fileName}
            </div>
          </div>

          {isSaving && (
            <div className="w-full px-[22px] mb-4">
              <div className="w-full bg-gray-200 rounded h-[8px]">
                <div
                  className="h-[8px] rounded bg-[#099a0e]"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="w-full px-[22px] pb-[14px]">
            <Button
              onClick={isSaving ? () => {} : handleSave}
              disabled={isSaving}
              className="!bg-[#099a0e] w-full  text-white px-[34px] py-[4px] text-[20px] font-bellefair font-normal leading-[23px] text-center rounded-[10px] hover:opacity-90 transition-opacity"
            >
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditModal;
