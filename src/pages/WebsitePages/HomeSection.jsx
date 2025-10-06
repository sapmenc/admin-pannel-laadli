import React, { useEffect, useMemo, useState } from "react";
import Header from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import Button from "../../components/ui/Button";
import EditModal from "./components/EditModal";
import { Editor } from "primereact/editor";
import { useHomeContent, useUpdateHomeContent } from "../../hooks/website-home";
import { toast } from 'react-toastify';

const FileUploadBox = ({ file, setFile, label, onEdit, onRemove }) => {
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

      {/* Cross Remove Icon */}
      {file ? (
        <button
          type="button"
          className="absolute top-[46px] right-2 bg-white text-[#4b2b2b] rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shadow hover:bg-gray-100 z-10"
          onClick={(e) => {
            e.stopPropagation();
            onRemove?.();
          }}
          aria-label="Remove"
        >
          ✕
        </button>
      ) : null}
    </div>
  );
};

const HomeSection = () => {
  const [selectedTab, setSelectedTab] = useState("Home");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeTarget, setActiveTarget] = useState(null);
  const [contentVersion, setContentVersion] = useState(0);

  // Separate editor states
  const [storyText, setStoryText] = useState("");
  const [luxeText, setLuxeText] = useState("");
  const [premiumText, setPremiumText] = useState("");
  const [bookFormText1, setBookFormText1] = useState("");
  const [bookFormText2, setBookFormText2] = useState("");
  const [bookFormText3, setBookFormText3] = useState("");
  const [bookFormText4, setBookFormText4] = useState("");

  // File states
  const [heroFile, setHeroFile] = useState(null);
  const [luxeFile, setLuxeFile] = useState(null);
  const [premiumFile, setPremiumFile] = useState(null);
  const [veilFiles, setVeilFiles] = useState([null, null, null, null]);
  const [bookFiles, setBookFiles] = useState([null, null, null, null]);

  const handleTabClick = (tabName) => setSelectedTab(tabName);

  const handleEditClick = (targetKey) => {
    setActiveTarget(targetKey);
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => setIsEditModalOpen(false);

  const handleModalComplete = ({ url, type, file }) => {
    if (!activeTarget || !url) return;
    const value = { type: type || "image/*", url, file: file || null };
    if (activeTarget === "hero") setHeroFile(value);
    else if (activeTarget === "luxe") setLuxeFile(value);
    else if (activeTarget === "premium") setPremiumFile(value);
    else if (activeTarget.startsWith("veil_")) {
      const index = parseInt(activeTarget.split("_")[1], 10);
      const copy = [...veilFiles];
      copy[index] = value;
      setVeilFiles(copy);
    } else if (activeTarget.startsWith("book_")) {
      const index = parseInt(activeTarget.split("_")[1], 10);
      const copy = [...bookFiles];
      copy[index] = value;
      setBookFiles(copy);
    }
    setActiveTarget(null);
  };

  // Load current content
  const { data: homeData } = useHomeContent();
  useEffect(() => {
    if (!homeData) return;
    console.log('Loaded home content:', homeData);
    const normalize = (v) => {
      if (!v) return "";
      const str = String(v);
      if (/[<>]/.test(str)) return str; // looks like HTML already
      return `<p>${str}</p>`;
    };
    setStoryText(normalize(homeData.storyText));
    setLuxeText(normalize(homeData.luxeText));
    setPremiumText(normalize(homeData.premiumText));

    setHeroFile(homeData.hero?.url ? { type: homeData.hero?.type || "image/*", url: homeData.hero.url, file: null } : null);
    setLuxeFile(homeData.luxe?.url ? { type: homeData.luxe?.type || "image/*", url: homeData.luxe.url, file: null } : null);
    setPremiumFile(homeData.premium?.url ? { type: homeData.premium?.type || "image/*", url: homeData.premium.url, file: null } : null);

    const veils = Array.isArray(homeData.veils) ? homeData.veils.map(v => (v?.url ? { type: v.type || "image/*", url: v.url, file: null } : null)) : [null, null, null, null];
    while (veils.length < 4) veils.push(null);
    setVeilFiles(veils.slice(0, 4));

    const books = Array.isArray(homeData.book) ? homeData.book : [];
    setBookFiles(books.map(b => (b?.media?.url ? { type: b.media.type || "image/*", url: b.media.url, file: null } : null)).concat([null, null, null, null]).slice(0, 4));
    setBookFormText1(normalize(books[0]?.text));
    setBookFormText2(normalize(books[1]?.text));
    setBookFormText3(normalize(books[2]?.text));
    setBookFormText4(normalize(books[3]?.text));
    setContentVersion(v => v + 1);
  }, [homeData]);

  const { mutate: saveHome, isLoading: isSaving } = useUpdateHomeContent();

  const buildPayload = () => {
    const payload = {
      storyText,
      luxeText,
      premiumText,
      hero: heroFile ? (heroFile.file instanceof File ? heroFile.file : (typeof heroFile.url === 'string' ? heroFile.url : undefined)) : null,
      luxe: luxeFile ? (luxeFile.file instanceof File ? luxeFile.file : (typeof luxeFile.url === 'string' ? luxeFile.url : undefined)) : null,
      premium: premiumFile ? (premiumFile.file instanceof File ? premiumFile.file : (typeof premiumFile.url === 'string' ? premiumFile.url : undefined)) : null,
      veils: veilFiles.map(v => (v ? (v.file instanceof File ? v.file : (typeof v.url === 'string' ? v.url : undefined)) : null)),
      book: [
        { media: bookFiles[0] ? (bookFiles[0].file instanceof File ? bookFiles[0].file : (typeof bookFiles[0].url === 'string' ? bookFiles[0].url : undefined)) : null, text: bookFormText1 },
        { media: bookFiles[1] ? (bookFiles[1].file instanceof File ? bookFiles[1].file : (typeof bookFiles[1].url === 'string' ? bookFiles[1].url : undefined)) : null, text: bookFormText2 },
        { media: bookFiles[2] ? (bookFiles[2].file instanceof File ? bookFiles[2].file : (typeof bookFiles[2].url === 'string' ? bookFiles[2].url : undefined)) : null, text: bookFormText3 },
        { media: bookFiles[3] ? (bookFiles[3].file instanceof File ? bookFiles[3].file : (typeof bookFiles[3].url === 'string' ? bookFiles[3].url : undefined)) : null, text: bookFormText4 },
      ],
    };
    return payload;
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
              <h2 className="text-[20px] font-bellefair font-normal leading-[23px] text-global-3 mb-[16px]">
                Hero Section
              </h2>
              <div className="flex flex-col lg:flex-row items-start gap-4 ">
                <FileUploadBox
                  file={heroFile}
                  setFile={setHeroFile}
                  label="Hero"
                  onEdit={() => handleEditClick("hero")}
                  onRemove={() => setHeroFile(null)}
                />
              </div>
            </div>

            {/* Our Story Section */}
            <div className="mb-[82px]">
              <h2 className="text-[20px] font-bellefair font-normal leading-[23px] text-global-3 mb-[16px]">
                Our Story Section
              </h2>
              <div className="card">
                <Editor
                  key={`story-${contentVersion}`}
                  value={storyText}
                  onTextChange={(e) => setStoryText(e.htmlValue)}
                  placeholder="Write your Our Story content..."
                  style={{ height: "320px" }}
                />
              </div>
            </div>

            {/* Categories Section */}
            <div className="mb-[82px]">
              <h2 className="text-[20px] font-bellefair font-normal leading-[23px] text-global-3 mb-[16px]">
                Categories Section
              </h2>

              {/* LUXE Category */}
              <div className="mb-[86px]">
                <div className="flex flex-col lg:flex-row items-start gap-4 mb-[12px]">
                  <div className="flex flex-col lg:flex-1 gap-4">
                    <FileUploadBox
                      file={luxeFile}
                      setFile={setLuxeFile}
                      label="Luxe"
                      onEdit={() => handleEditClick("luxe")}
                      onRemove={() => setLuxeFile(null)}
                    />
                    <div className="text-center">
                      <span className="text-[20px] font-bellefair font-normal leading-[23px] text-global-3">
                        LUXE
                      </span>
                    </div>
                  </div>
                  <div className="card">
                    <Editor
                      key={`luxe-${contentVersion}`}
                      value={luxeText}
                      onTextChange={(e) => setLuxeText(e.htmlValue)}
                      placeholder="Describe the Luxe category..."
                      style={{ height: "290px" }}
                    />
                  </div>
                </div>
              </div>

              {/* Premium Category */}
              <div className="mb-[82px]">
                <div className="flex flex-col lg:flex-row items-start gap-4 mb-[16px]">
                  <div className="flex flex-col lg:flex-1 gap-4">
                    <FileUploadBox
                      file={premiumFile}
                      setFile={setPremiumFile}
                      label="Premium"
                      onEdit={() => handleEditClick("premium")}
                      onRemove={() => setPremiumFile(null)}
                    />
                    <div className="text-center">
                      <span className="text-[20px] font-bellefair font-normal leading-[23px] text-global-3">
                        PREMIUM
                      </span>
                    </div>
                  </div>
                  <div className="card">
                    <Editor
                      key={`premium-${contentVersion}`}
                      value={premiumText}
                      onTextChange={(e) => setPremiumText(e.htmlValue)}
                      placeholder="Describe the Premium category..."
                      style={{ height: "290px" }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Glimpse of our veils Section */}
            <div className="mb-[82px]">
              <h2 className="text-[20px] font-bellefair font-normal leading-[23px] text-global-3 mb-[16px]">
                Glimpse of our veils Section
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-[74px] lg:gap-[74px]">
                {veilFiles.map((file, i) => (
                  <FileUploadBox
                    key={i}
                    file={file}
                    setFile={(f) => {
                      const copy = [...veilFiles];
                      copy[i] = f;
                      setVeilFiles(copy);
                    }}
                    label={`Veil ${i + 1}`}
                    onEdit={() => handleEditClick(`veil_${i}`)}
                    onRemove={() => {
                      const copy = [...veilFiles];
                      copy[i] = null;
                      setVeilFiles(copy);
                    }}
                  />
                ))}
              </div>
            </div>

            {/* BOOK YOUR DRAPE Section */}
            <div className="mb-[82px]">
              <h2 className="text-[20px] font-bellefair font-normal leading-[23px] text-global-3 mb-[16px]">
                BOOK YOUR DRAPE Section
              </h2>

              {[
                {
                  label: "Fill the contact form",
                  state: bookFormText1,
                  setState: setBookFormText1,
                },
                {
                  label: "Reach out on WhatsAppum",
                  state: bookFormText2,
                  setState: setBookFormText2,
                },
                {
                  label: "Fill the contact form",
                  state: bookFormText3,
                  setState: setBookFormText3,
                },
                {
                  label: "Reach out on WhatsAppum",
                  state: bookFormText4,
                  setState: setBookFormText4,
                },
              ].map((section, i) => (
                <div key={i} className={`mb-[${i === 3 ? "128px" : "86px"}]`}>
                  <div className="flex flex-col lg:flex-row items-start gap-4 mb-[16px]">
                    <div className="flex flex-col lg:flex-1 gap-4">
                      <FileUploadBox
                        file={bookFiles[i]}
                        setFile={(f) => {
                          const copy = [...bookFiles];
                          copy[i] = f;
                          setBookFiles(copy);
                        }}
                        label={section.label}
                        onEdit={() => handleEditClick(`book_${i}`)}
                        onRemove={() => {
                          const copy = [...bookFiles];
                          copy[i] = null;
                          setBookFiles(copy);
                        }}
                      />
                      <div className="text-center">
                        <span className="text-[20px] font-bellefair font-normal leading-[23px] text-global-3">
                          {section.label}
                        </span>
                      </div>
                    </div>

                    <div className="card">
                      <Editor
                        key={`book-${i}-${contentVersion}`}
                        value={section.state}
                        onTextChange={(e) => section.setState(e.htmlValue)}
                        placeholder="Enter call-to-action or instructions..."
                        style={{ height: "290px" }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Save Button */}
            <div className="flex justify-center mb-5 ">
              <Button
                variant="primary"
                className="active mt-6 w-[200px] py-2 !bg-[#099a0e] text-[#099a0e] font-serif text-xl rounded-md shadow-md border border-[#099a0e] hover:shadow-lg transition-all"
                onClick={() =>
                  saveHome(buildPayload(), {
                    onSuccess: (data) => {
                      console.log('HomeSection save: working is perfect');
                      console.log('Updated home content:', data);
                      toast.success('Home section updated successfully');
                    },
                    onError: (error) => {
                      console.error('HomeSection save failed:', error);
                      toast.error(error?.message || 'Failed to update Home section');
                    },
                  })
                }
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
    </div>
  );
};

export default HomeSection;
