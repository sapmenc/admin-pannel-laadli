import React, { useEffect, useState } from "react";
import Header from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import Button from "../../components/ui/Button";
import EditModal from "./components/EditModal";
import ReactQuill from "react-quill";
import { useContactContent, useUpdateContactContent } from "../../hooks/website-contact";
import { toast } from 'react-toastify';

const FileUploadBox = ({ file, setFile, label, onEdit }) => {
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
        className="absolute top-2 right-2 w-[40px] h-[40px] cursor-pointer hover:opacity-80 transition-opacity"
        onClick={onEdit}
      />
    </div>
  );
};

const ContactUsSection = () => {
  const [selectedTab, setSelectedTab] = useState("ContactUs");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [saveError, setSaveError] = useState("");

  // Unique states
  const [contactHeroFile, setContactHeroFile] = useState(null);
  const [contactHeroText, setContactHeroText] = useState("");

  const handleTabClick = (tabName) => setSelectedTab(tabName);

  const handleEditClick = () => setIsEditModalOpen(true);

  const handleCloseModal = () => setIsEditModalOpen(false);

  const handleModalComplete = ({ url, type, file }) => {
    if (url) setContactHeroFile({ type: type || "image/*", url, file: file || null });
  };

  // Backend save
  const { mutate: saveContact, isLoading: isSaving } = useUpdateContactContent();
  const handleSaveAll = () => {
    setSaveError("");
    const heroPayload = contactHeroFile ? (contactHeroFile.file instanceof File ? contactHeroFile.file : (typeof contactHeroFile.url === 'string' ? contactHeroFile.url : undefined)) : null;
    const outgoing = { hero: heroPayload, contentText: contactHeroText };
    console.log('ContactUs save payload:', outgoing);
    saveContact(
      outgoing,
      {
        onSuccess: (_data) => {
          console.log('ContactUs updated response:', _data);
          toast.success('Contact Us updated successfully');
        },
        onError: (err) => {
          console.error('Contact Us update failed:', err);
          setSaveError(err?.message || 'Failed to update Contact Us');
          toast.error(err?.message || 'Failed to update Contact Us');
        },
      }
    );
  };

  // Load content from backend and populate editor and media preview
  const { data: contact } = useContactContent();
  useEffect(() => {
    if (!contact) return;
    setContactHeroFile(contact.hero?.url ? { type: contact.hero.type || 'image/*', url: contact.hero.url } : null);
    // If backend stored plain text, keep as-is; if HTML, keep it too
    setContactHeroText(typeof contact.contentText === 'string' ? contact.contentText : '');
  }, [contact]);

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
            <div className="mb-[40px]">
              <h2 className="text-[20px] font-bellefair font-normal leading-[23px] text-global-3 mb-[16px]">
                Contact Us Hero Section
              </h2>
              <div className="flex flex-col lg:flex-row items-start gap-4">
                <FileUploadBox
                  file={contactHeroFile}
                  setFile={setContactHeroFile}
                  label="Contact Hero"
                  onEdit={handleEditClick}
                />
              </div>
            </div>

            {/* Editor Section */}
            <div className="mb-[60px]">
              <h2 className="text-[20px] font-bellefair font-normal leading-[23px] text-global-3 mb-[16px]">
                Contact Us Content
              </h2>
              <div className="card">
                <ReactQuill
                  value={contactHeroText || "<p></p>"}
                  onChange={(html) => setContactHeroText(html)}
                  theme="snow"
                  style={{ height: "320px" }}
                />
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-center mb-5">
              <Button
                variant="primary"
                className="active mt-6 w-[200px] py-2 !bg-[#099a0e] text-[#099a0e] font-serif text-xl rounded-md shadow-md border border-[#099a0e] hover:shadow-lg transition-all"
                onClick={isSaving ? () => {} : handleSaveAll}
              >
                <div className="flex items-center justify-center gap-2">
                  <img
                    src="/images/img_charmtick.svg"
                    alt="Save"
                    className="w-[24px] h-[24px]"
                  />
                  <span className="text-white">
                    {isSaving ? "Saving..." : "Save"}
                  </span>
                </div>
              </Button>
            </div>

            {saveError ? (
              <div className="flex justify-center mb-5">
                <span className="text-red-600 text-sm">{saveError}</span>
              </div>
            ) : null}
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

export default ContactUsSection;
