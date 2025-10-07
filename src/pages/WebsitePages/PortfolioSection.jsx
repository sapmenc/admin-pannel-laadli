import React, { useEffect, useState } from "react";
import Header from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import Button from "../../components/ui/Button";
import EditModal from "./components/EditModal";
import { usePortfolioContent, useUpdatePortfolioContent } from "../../hooks/website-portfolio";
import { toast } from 'react-toastify';

const FileUploadBox = ({ file, setFile, label, onEdit, onRemove }) => {
  const [reelThumb, setReelThumb] = useState(null);

  const isIgLink = (val) => {
    if (!val || typeof val !== 'string') return false;
    return /instagram\.com\//i.test(val);
  };

  // Use same simple URL handling as OurStorySection for consistency

  useEffect(() => {
    const fetchThumb = async () => {
      if (!file || !file.url || !isIgLink(file.url)) {
        setReelThumb(null);
        return;
      }
      try {
        const resp = await fetch(`https://noembed.com/embed?url=${encodeURIComponent(file.url)}`);
        if (!resp.ok) throw new Error('noembed failed');
        const data = await resp.json();
        setReelThumb(data.thumbnail_url || null);
      } catch (_e) {
        setReelThumb(null);
      }
    };
    fetchThumb();
  }, [file]);

  const handleFileChange = (e) => {
    const uploaded = e.target.files[0];
    if (uploaded) {
      const url = URL.createObjectURL(uploaded);
      setFile({ type: uploaded.type, url, file: uploaded });
    }
  };

  return (
    <div className="relative w-full lg:w-[100%] bg-slate-200 rounded-[14px] h-[200px] sm:h-[250px] lg:h-[340px] flex items-center justify-center overflow-hidden">
      {!file ? (
        <label className="cursor-pointer text-gray-500 text-sm">
          <input
            type="file"
            accept="image/*,video/*"
            onChange={handleFileChange}
            className="hidden"
          />
          + Upload {label ? label : "File"}
        </label>
      ) : file.type.startsWith("image") ? (
        <img
          src={file.url}
          alt="preview"
          className="w-full h-full object-cover rounded-[14px]"
        />
      ) : isIgLink(file.url) ? (
        <div className="w-full h-full rounded-[14px] relative overflow-hidden">
          {reelThumb ? (
            <img src={reelThumb} alt="Instagram Reel" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-600">Instagram Reel</div>
          )}
          <a
            href={file.url}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="w-14 h-14 bg-white/80 rounded-full flex items-center justify-center shadow">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#000" className="w-8 h-8 ml-1">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </a>
        </div>
      ) : (
        <video
          src={file.url}
          controls
          className="w-full h-full object-cover rounded-[14px]"
        />
      )}

      {/* Pencil Edit Icon */}
      <img
        src="/images/img_group_47608.svg"
        alt="Edit"
        className="absolute top-2 right-2 w-[40px] h-[40px] cursor-pointer hover:opacity-80 transition-opacity z-10"
        onClick={onEdit}
      />
      
    </div>
  );
};

const PortfolioSection = () => {
  const [selectedTab, setSelectedTab] = useState("Portfolio");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  // Unique hero state
  const [portfolioHeroFile, setPortfolioHeroFile] = useState(null);

  const handleTabClick = (tabName) => setSelectedTab(tabName);
  const handleEditClick = () => setIsEditModalOpen(true);
  const handleCloseModal = () => setIsEditModalOpen(false);

  const handleModalComplete = ({ url, type, file }) => {
    if (url) { setPortfolioHeroFile({ type: type || "image/*", url, file: file || null }); setIsDirty(true); }
  };

  // Load existing
  const { data: portfolio } = usePortfolioContent();
  useEffect(() => {
    if (!portfolio) return;
    setPortfolioHeroFile(portfolio.hero?.url ? { type: portfolio.hero.type || 'image/*', url: portfolio.hero.url, file: null } : null);
  }, [portfolio]);

  const { mutate: savePortfolio, isPending: isLoading } = useUpdatePortfolioContent();
  const [saveMessage, setSaveMessage] = useState("");

  return (
    <div className="flex flex-col min-h-screen w-full bg-global-1 h-full">
      {/* Header */}
      <Header />

      <div className="flex flex-row flex-1 min-h-0 h-full">
        {/* Sidebar */}
        <Sidebar selectedTab={selectedTab} onTabClick={handleTabClick} />

        {/* Main Content */}
        <div className="flex flex-col flex-1 p-6 bg-global-1 overflow-auto items-center">
          <div className="w-full max-w-[1348px] relative mt-5">
            {/* Hero Section */}
            <div className="mb-[82px]">
              <h2 className="text-[20px] font-bellefair font-normal leading-[23px] text-global-3 mb-[16px]">
                Portfolio Hero Section
              </h2>
              <div className="flex flex-col lg:flex-row items-start gap-4 ">
                <FileUploadBox
                  file={portfolioHeroFile}
                  setFile={setPortfolioHeroFile}
                  label="Portfolio Hero"
                  onEdit={handleEditClick}
                />
              </div>
            </div>

            {/* Save Button */}
            <div className="flex flex-col items-center mb-5 ">
              {saveMessage ? (
                <div className="mb-3 text-green-700 text-2xl font-medium">{saveMessage}</div>
              ) : null}
              <Button
                variant="primary"
                className="active mt-6 w-[200px] py-2 !bg-[#099a0e] text-[#099a0e] font-serif text-xl rounded-md shadow-md border border-[#099a0e] hover:shadow-lg transition-all"
                onClick={() => {
                  savePortfolio(
                    { hero: portfolioHeroFile ? (portfolioHeroFile.file instanceof File ? portfolioHeroFile.file : portfolioHeroFile.url) : null },
                    {
                      onSuccess: (data) => { console.log('Portfolio updated:', data); toast.success('Portfolio updated successfully'); setSaveMessage('Portfolio section successfully updated.'); setTimeout(() => setSaveMessage(''), 2000); },
                      onError: (err) => { console.error('Portfolio update failed:', err); toast.error(err?.message || 'Failed to update Portfolio'); setSaveMessage(''); }
                    }
                  );
                  setIsDirty(false);
                }}
                disabled={!isDirty || isLoading}
              >
                <div className="flex items-center justify-center gap-2">
                  <img
                    src="/images/img_charmtick.svg"
                    alt="Save"
                    className="w-[24px] h-[24px]"
                  />
                  <span className="text-white">{isLoading ? 'Saving...' : 'Save'}</span>
                </div>
              </Button>
           
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <EditModal
        isOpen={isEditModalOpen}
        onClose={handleCloseModal}
        onComplete={handleModalComplete}
      />
    </div>
  );
};

export default PortfolioSection;
