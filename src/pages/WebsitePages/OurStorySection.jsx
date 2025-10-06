import React, { useEffect, useState } from "react";
import Header from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import Button from "../../components/ui/Button";
import EditModal from "./components/EditModal";
import { Editor } from "primereact/editor";
import { useOurStoryContent, useUpdateOurStoryContent } from "../../hooks/website-ourstory";
import { toast } from 'react-toastify';

const FileUploadBox = ({ file, setFile, label, onEdit, onLink, tall }) => {
  const [reelThumb, setReelThumb] = useState(null);
  const handleFileChange = (e) => {
    const uploaded = e.target.files[0];
    if (uploaded) {
      const url = URL.createObjectURL(uploaded);
      setFile({ type: uploaded.type, url, file: uploaded });
    }
  };

  const isIgLink = (val) => {
    if (!val || typeof val !== 'string') return false;
    return /instagram\.com\//i.test(val);
  };

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

  const isInstagramLink = (val) => {
    if (!val || typeof val !== 'string') return false;
    return /instagram\.com\//i.test(val);
  };

  const toEmbedUrl = (val) => {
    if (!val) return val;
    // Ensure trailing /embed for Instagram preview
    if (/\/embed\/?$/i.test(val)) return val;
    return val.endsWith('/') ? `${val}embed` : `${val}/embed`;
  };

  return (
    <div
      className={`relative w-full bg-slate-200 rounded-[14px] ${
        tall ? "h-[340px]" : "h-[200px] sm:h-[250px] lg:h-[360px]"
      } flex items-center justify-center overflow-hidden`}
    >
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

      {/* Link Icon (for updating reel URL) */}
      {onLink ? (
        <img
          src="/images/link_icon2.png"
          alt="Link"
          className="absolute top-[46px] right-2 w-[38px] h-[38px] cursor-pointer rounded-full mt-2 hover:opacity-80 transition-opacity z-10"
          onClick={onLink}
        />
      ) : null}
    </div>
  );
};

const OurStorySection = () => {
  // Load and save hooks
  const { data: story } = useOurStoryContent();
  const { mutate: saveOurStory, isLoading: isSaving } = useUpdateOurStoryContent();

  useEffect(() => {
    if (!story) return;
    setStoryHeroFile(story.hero?.url ? { type: story.hero.type || 'image/*', url: story.hero.url, file: null } : null);
    setStorySection1File(story.section1?.media?.url ? { type: story.section1.media.type || 'image/*', url: story.section1.media.url, file: null } : null);
    setStorySection1Text(story.section1?.text || '');
    setStorySection2File(story.section2?.media?.url ? { type: story.section2.media.type || 'image/*', url: story.section2.media.url, file: null } : null);
    setStorySection2Text(story.section2?.text || '');
    setStorySection3File(story.section3?.media?.url ? { type: story.section3.media.type || 'image/*', url: story.section3.media.url, file: null } : null);
    setStorySection3Text(story.section3?.text || '');
    const last = Array.isArray(story.last) ? story.last : [];
    setStoryLastFile1(last[0]?.url ? { type: last[0].type || 'image/*', url: last[0].url, file: null } : null);
    setStoryLastFile2(last[1]?.url ? { type: last[1].type || 'image/*', url: last[1].url, file: null } : null);
    setStoryLastFile3(last[2]?.url ? { type: last[2].type || 'image/*', url: last[2].url, file: null } : null);
  }, [story]);
  const [selectedTab, setSelectedTab] = useState("OurStory");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeTarget, setActiveTarget] = useState(null);

  // Reel link modal state
  const [isReelModalOpen, setIsReelModalOpen] = useState(false);
  const [activeReelTarget, setActiveReelTarget] = useState(null);
  const [reelUrlInput, setReelUrlInput] = useState("");

  // Hero state
  const [storyHeroFile, setStoryHeroFile] = useState(null);

  // Section 1
  const [storySection1File, setStorySection1File] = useState(null);
  const [storySection1Text, setStorySection1Text] = useState("");

  // Section 2
  const [storySection2File, setStorySection2File] = useState(null);
  const [storySection2Text, setStorySection2Text] = useState("");

  // Section 3
  const [storySection3File, setStorySection3File] = useState(null);
  const [storySection3Text, setStorySection3Text] = useState("");

  // Last Section (3 uploads)
  const [storyLastFile1, setStoryLastFile1] = useState(null);
  const [storyLastFile2, setStoryLastFile2] = useState(null);
  const [storyLastFile3, setStoryLastFile3] = useState(null);

  const handleTabClick = (tabName) => setSelectedTab(tabName);

  const handleEditClick = (targetKey) => {
    setActiveTarget(targetKey);
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => setIsEditModalOpen(false);

  const handleModalComplete = ({ url, type, file }) => {
    if (!activeTarget || !url) return;
    const value = { type: type || "image/*", url, file: file || null };
    if (activeTarget === "hero") setStoryHeroFile(value);
    else if (activeTarget === "sec1") setStorySection1File(value);
    else if (activeTarget === "sec2") setStorySection2File(value);
    else if (activeTarget === "sec3") setStorySection3File(value);
    else if (activeTarget === "last1") setStoryLastFile1(value);
    else if (activeTarget === "last2") setStoryLastFile2(value);
    else if (activeTarget === "last3") setStoryLastFile3(value);
    setActiveTarget(null);
  };

  const openReelModal = (targetKey) => {
    setActiveReelTarget(targetKey);
    setReelUrlInput("");
    setIsReelModalOpen(true);
  };

  const closeReelModal = () => {
    setIsReelModalOpen(false);
    setActiveReelTarget(null);
    setReelUrlInput("");
  };

  const saveReelUrl = () => {
    const url = reelUrlInput.trim();
    if (!url) return;
    const value = { type: "video/*", url };
    if (activeReelTarget === "last1") setStoryLastFile1(value);
    if (activeReelTarget === "last2") setStoryLastFile2(value);
    if (activeReelTarget === "last3") setStoryLastFile3(value);
    closeReelModal();
  };

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
              <h2 className="text-[20px] font-bellefair text-global-3 mb-[16px]">
                Our Story Hero Section
              </h2>
              <FileUploadBox
                file={storyHeroFile}
                setFile={setStoryHeroFile}
                label="Story Hero"
                onEdit={() => handleEditClick("hero")}
                tall
              />
            </div>

            {/* Section 1 */}
            <div className="mb-[82px]">
              <h2 className="text-[20px] font-bellefair text-global-3 mb-[16px]">
                Section 1
              </h2>
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="w-full lg:w-1/2">
                  <FileUploadBox
                    file={storySection1File}
                    setFile={setStorySection1File}
                    label="Section 1 File"
                    onEdit={() => handleEditClick("sec1")}
                  />
                </div>
                <div className="w-full lg:w-1/2 card">
                  <Editor
                    value={storySection1Text}
                    onTextChange={(e) => setStorySection1Text(e.htmlValue)}
                    placeholder="Write Section 1 content..."
                    style={{ height: "290px" }}
                  />
                </div>
              </div>
            </div>

            {/* Section 2 */}
            <div className="mb-[82px]">
              <h2 className="text-[20px] font-bellefair text-global-3 mb-[16px]">
                Section 2
              </h2>
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="w-full lg:w-1/2 card">
                  <Editor
                    value={storySection2Text}
                    onTextChange={(e) => setStorySection2Text(e.htmlValue)}
                    placeholder="Write Section 2 content..."
                    style={{ height: "290px" }}
                  />
                </div>
                <div className="w-full lg:w-1/2">
                  <FileUploadBox
                    file={storySection2File}
                    setFile={setStorySection2File}
                    label="Section 2 File"
                    onEdit={() => handleEditClick("sec2")}
                  />
                </div>
              </div>
            </div>

            {/* Section 3 */}
            <div className="mb-[82px]">
              <h2 className="text-[20px] font-bellefair text-global-3 mb-[16px]">
                Section 3
              </h2>
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="w-full lg:w-1/2">
                  <FileUploadBox
                    file={storySection3File}
                    setFile={setStorySection3File}
                    label="Section 3 File"
                    onEdit={() => handleEditClick("sec3")}
                  />
                </div>
                <div className="w-full lg:w-1/2 card">
                  <Editor
                    value={storySection3Text}
                    onTextChange={(e) => setStorySection3Text(e.htmlValue)}
                    placeholder="Write Section 3 content..."
                    style={{ height: "290px" }}
                  />
                </div>
              </div>
            </div>

            {/* Last Section (Getting Candid with The Laadli Founders + Instagram Reel link) */}
            <div className="mb-[82px]">
              <h2 className="text-[20px] font-bellefair text-global-3 mb-[16px]">
                Getting Candid with The Lush Founder Section
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <FileUploadBox
                  file={storyLastFile1}
                  setFile={setStoryLastFile1}
                  label="Last 1"
                  onEdit={() => handleEditClick("last1")}
                  onLink={() => openReelModal("last1")}
                  tall
                />
                <FileUploadBox
                  file={storyLastFile2}
                  setFile={setStoryLastFile2}
                  label="Last 2"
                  onEdit={() => handleEditClick("last2")}
                  onLink={() => openReelModal("last2")}
                  tall
                />
                <FileUploadBox
                  file={storyLastFile3}
                  setFile={setStoryLastFile3}
                  label="Last 3"
                  onEdit={() => handleEditClick("last3")}
                  onLink={() => openReelModal("last3")}
                  tall
                />
              </div>
            </div>

      {/* Save Button */}
            <div className="flex justify-center mb-5 ">
              <Button
                variant="primary"
                className="active mt-6 w-[200px] py-2 !bg-[#099a0e] text-[#099a0e] font-serif text-xl rounded-md shadow-md border border-[#099a0e] hover:shadow-lg transition-all"
          onClick={() => {
            saveOurStory({
              hero: storyHeroFile ? (storyHeroFile.file instanceof File ? storyHeroFile.file : storyHeroFile.url) : null,
              section1Media: storySection1File ? (storySection1File.file instanceof File ? storySection1File.file : storySection1File.url) : null,
              section1Text: storySection1Text,
              section2Media: storySection2File ? (storySection2File.file instanceof File ? storySection2File.file : storySection2File.url) : null,
              section2Text: storySection2Text,
              section3Media: storySection3File ? (storySection3File.file instanceof File ? storySection3File.file : storySection3File.url) : null,
              section3Text: storySection3Text,
              last: [
                storyLastFile1 ? (storyLastFile1.file instanceof File ? storyLastFile1.file : storyLastFile1.url) : null,
                storyLastFile2 ? (storyLastFile2.file instanceof File ? storyLastFile2.file : storyLastFile2.url) : null,
                storyLastFile3 ? (storyLastFile3.file instanceof File ? storyLastFile3.file : storyLastFile3.url) : null,
              ],
            }, {
              onSuccess: (data) => { console.log('Our Story updated:', data); toast.success('Our Story updated successfully'); },
              onError: (err) => { console.error('Our Story update failed:', err); toast.error(err?.message || 'Failed to update Our Story'); }
            })
          }}
              >
                <div className="flex items-center justify-center gap-2">
                  <img
                    src="/images/img_charmtick.svg"
                    alt="Save"
                    className="w-[24px] h-[24px]"
                  />
            <span className="text-white">{isSaving ? 'Saving...' : 'Save'}</span>
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

      {/* Reel URL Modal */}
      {isReelModalOpen ? (
        <div className="flex justify-center items-center min-h-screen bg-black bg-opacity-50 fixed inset-0 z-50">
          <div className="bg-white rounded-[14px] w-full max-w-[600px] mx-4 sm:mx-6 lg:mx-auto">
            <div className="flex flex-col items-center p-6">
              <div className="flex justify-between items-center w-full mb-6">
                <h2 className="text-[20px] sm:text-[24px] font-bellefair font-normal leading-[28px] text-left text-global-3">
                  Update Reel URL
                </h2>
                <button
                  onClick={closeReelModal}
                  className="w-[34px] h-[34px] flex items-center justify-center hover:opacity-70 transition-opacity"
                >
                  <img src="/images/img_basil_cross_solid.svg" alt="Close" className="w-[34px] h-[34px]" />
                </button>
              </div>
              <div className="w-full mb-5">
                <input
                  type="text"
                  value={reelUrlInput}
                  onChange={(e) => setReelUrlInput(e.target.value)}
                  placeholder="Paste Instagram reel URL"
                  className="w-full px-[10px] py-[10px] pr-[34px] text-[14px] font-bellefair font-normal leading-[17px] text-left text-global-4 bg-white border border-[#bababa] rounded-[10px] focus:outline-none focus:ring-2 focus:ring-global-2 focus:border-transparent"
                />
              </div>
              <div className="w-full">
                <Button
                  onClick={saveReelUrl}
                  className="!bg-[#099a0e] w-full bg-button-1 text-button-1 px-[34px] py-[8px] text-[18px] font-bellefair font-normal leading-[21px] text-center rounded-[10px] hover:opacity-90 transition-opacity"
                >
                  Save
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default OurStorySection;
