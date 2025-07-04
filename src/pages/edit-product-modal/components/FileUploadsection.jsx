import React, { useEffect, useState } from 'react';


const FileUploadSection = ({ onFileSelect, selectedFile }) => {
  const [previewURL, setPreviewURL] = useState(null);

  useEffect(() => {
    if (!selectedFile) {
      setPreviewURL(null);
      return;
    }

    if (typeof selectedFile === 'string') {
      setPreviewURL(selectedFile);
      return;
    }

    if (selectedFile instanceof File || selectedFile instanceof Blob) {
      const url = URL.createObjectURL(selectedFile);
      setPreviewURL(url);

      return () => URL.revokeObjectURL(url);
    }

    setPreviewURL(null);
  }, [selectedFile]);

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) onFileSelect(file);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onFileSelect(null); // Reset file on click
  };

  const getFileType = () => {
    if (!selectedFile) return null;

    if (typeof selectedFile === 'string') {
      if (selectedFile.match(/\.(jpeg|jpg|gif|png|webp)$/i)) return 'image';
      if (selectedFile.match(/\.(mp4|webm|ogg|mov)$/i)) return 'video';
      return 'other';
    }

    if (selectedFile.type) {
      if (selectedFile.type.startsWith('image/')) return 'image';
      if (selectedFile.type.startsWith('video/')) return 'video';
    }

    return 'other';
  };

  const renderPreview = () => {
    if (!previewURL) return null;

    const fileType = getFileType();

    switch (fileType) {
      case 'image':
        return (
          <img
            src={previewURL}
            alt="preview"
            className="w-full h-full object-cover rounded-xl"
          />
        );
      case 'video':
        return (
          <video
            src={previewURL}
            className="w-full h-full object-cover rounded-xl"
            controls={false}
            muted
            loop
            autoPlay
          />
        );
      default:
        return (
          <span className="truncate block text-sm text-center text-[var(--global-text-2)]">
            {selectedFile?.name || 'File Preview'}
          </span>
        );
    }
  };

  return (
    <div className="w-[170px] h-[100px] bg-[#F7F7F7] border border-[var(--global-text-2)] rounded-xl flex items-center justify-center relative overflow-hidden">
      <input
        type="file"
        accept="image/*,video/*"
        onChange={handleChange}
        className="absolute inset-0 opacity-0 cursor-pointer"
      />

      {previewURL ? (
        <>
          {renderPreview()}
          <button
            className="absolute top-1 right-1 bg-white text-[#4b2b2b] rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shadow hover:bg-gray-100 z-10"
            onClick={handleClear}
          >
            ✕
          </button>
        </>
      ) : (
        <div className="text-[#64625d] font-lora text-center px-2 text-sm">
          <div className="flex flex-col items-center">
            <img src='images/upload_icons.png' alt="Upload Icon" className="w-14 h-15 mb-1" />
            <span>Upload your file</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploadSection;
