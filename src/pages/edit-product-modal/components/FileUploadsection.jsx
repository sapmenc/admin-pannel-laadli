import React, { useEffect, useState } from 'react';

const FileUploadSection = ({ onFileSelect, selectedFile }) => {
  const [previewURL, setPreviewURL] = useState(null);

  useEffect(() => {
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setPreviewURL(url);

      return () => URL.revokeObjectURL(url); // cleanup
    } else {
      setPreviewURL(null);
    }
  }, [selectedFile]);

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) onFileSelect(file);
  };

  const renderPreview = () => {
    if (!selectedFile || !previewURL) return null;

    if (selectedFile.type.startsWith('image/')) {
      return (
        <img
          src={previewURL}
          alt="preview"
          className="w-full h-full object-cover rounded-xl"
        />
      );
    }

    if (selectedFile.type.startsWith('video/')) {
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
    }

    return (
      <span className="truncate block text-sm text-center text-[var(--global-text-2)]">
        {selectedFile.name}
      </span>
    );
  };

  return (
    <div className="w-[140px] h-[80px] bg-white border border-[var(--global-text-2)] rounded-xl flex items-center justify-center relative overflow-hidden">
      <input
        type="file"
        accept="image/*,video/*"
        onChange={handleChange}
        className="absolute inset-0 opacity-0 cursor-pointer"
      />
      {selectedFile ? (
        renderPreview()
      ) : (
        <div className="text-[var(--global-text-2)] font-lora text-center px-2 text-sm">
          <div className="flex flex-col items-center">
            <span className="text-2xl">⬆️</span>
            <span>Upload your file</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploadSection;
