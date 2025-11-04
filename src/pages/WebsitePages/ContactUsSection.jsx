import React, { useEffect, useState } from "react";
import Header from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import Button from "../../components/ui/Button";
import EditModal from "./components/EditModal";
import ReactQuill from "react-quill";
import {
  useContactContent,
  useUpdateContactContent,
} from "../../hooks/website-contact";
import { toast } from "react-toastify";

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
      {!file ?
        <label className="cursor-pointer text-gray-500 text-sm">
          <input
            type="file"
            accept="image/*,video/*"
            onChange={handleFileChange}
            className="hidden"
          />
          + Upload {label ? label : "File"}
        </label>
      : file.type.startsWith("image") ?
        <img
          src={file.url}
          alt="preview"
          className="w-full h-full object-cover rounded-[14px]"
        />
      : <video
          src={file.url}
          controls
          className="w-full h-full object-cover rounded-[14px]"
        />
      }

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
  const [saveMessage, setSaveMessage] = useState("");
  const [isDirty, setIsDirty] = useState(false);

  // Unique states
  const [contactHeroFile, setContactHeroFile] = useState(null);
  const [contactHeroText, setContactHeroText] = useState("");
  const [priceRanges, setPriceRanges] = useState([]);
  const [newPriceRange, setNewPriceRange] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingValue, setEditingValue] = useState("");

  const handleTabClick = (tabName) => setSelectedTab(tabName);

  const handleEditClick = () => setIsEditModalOpen(true);

  const handleCloseModal = () => setIsEditModalOpen(false);

  const handleModalComplete = ({ url, type, file }) => {
    if (url) {
      setContactHeroFile({ type: type || "image/*", url, file: file || null });
      setIsDirty(true);
    }
  };

  // Helper function to format numbers with commas
  const formatNumberWithCommas = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Helper function to validate and format price range
  const validateAndFormatPriceRange = (input) => {
    // Remove all spaces, commas, and rupee symbols for validation
    const cleaned = input.replace(/[\s,₹]/g, "");

    // Check format: number - number
    const match = cleaned.match(/^(\d+)-(\d+)$/);

    if (!match) {
      return {
        valid: false,
        formatted: null,
        error: "Format should be: 29000 - 38000",
      };
    }

    const lowerPrice = parseInt(match[1]);
    const higherPrice = parseInt(match[2]);

    if (lowerPrice >= higherPrice) {
      return {
        valid: false,
        formatted: null,
        error: "First price must be lower than second price",
      };
    }

    // Format with commas only (no spaces around hyphen to prevent extra space with rupee symbol on frontend)
    const formatted = `${formatNumberWithCommas(lowerPrice)}-${formatNumberWithCommas(higherPrice)}`;
    return { valid: true, formatted, error: null };
  };

  // Price range handlers
  const handleAddPriceRange = () => {
    if (!newPriceRange.trim()) {
      toast.error("Please enter a price range");
      return;
    }
    if (priceRanges.length >= 5) {
      toast.error("Maximum 5 price ranges allowed");
      return;
    }

    const validation = validateAndFormatPriceRange(newPriceRange.trim());

    if (!validation.valid) {
      toast.error(validation.error);
      return;
    }

    // LIFO - add to the beginning
    setPriceRanges([validation.formatted, ...priceRanges]);
    setNewPriceRange("");
    setIsDirty(true);
    toast.success("Price range added successfully");
  };

  const handleEditPriceRange = (index) => {
    setEditingIndex(index);
    // Remove commas for easier editing (no ₹ to remove now)
    const rawValue = priceRanges[index].replace(/,/g, "");
    setEditingValue(rawValue);
  };

  const handleSaveEdit = (index) => {
    if (!editingValue.trim()) {
      toast.error("Price range cannot be empty");
      return;
    }

    const validation = validateAndFormatPriceRange(editingValue.trim());

    if (!validation.valid) {
      toast.error(validation.error);
      return;
    }

    const updatedRanges = [...priceRanges];
    updatedRanges[index] = validation.formatted;
    setPriceRanges(updatedRanges);
    setEditingIndex(null);
    setEditingValue("");
    setIsDirty(true);
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditingValue("");
  };

  const handleDeletePriceRange = (index) => {
    setPriceRanges(priceRanges.filter((_, i) => i !== index));
    setIsDirty(true);
  };

  // Backend save
  const { mutate: saveContact, isPending: isSaving } =
    useUpdateContactContent();
  const handleSaveAll = () => {
    setSaveError("");

    const heroPayload =
      contactHeroFile ?
        contactHeroFile.file instanceof File ? contactHeroFile.file
        : typeof contactHeroFile.url === "string" ? contactHeroFile.url
        : undefined
      : null;
    const outgoing = {
      hero: heroPayload,
      contentText: contactHeroText,
      priceRanges,
    };
    saveContact(outgoing, {
      onSuccess: (_data) => {
        toast.success("Contact Us updated successfully");
        setSaveMessage("Contact Us section successfully updated.");
        setTimeout(() => setSaveMessage(""), 2000);
        setIsDirty(false);
      },
      onError: (err) => {
        setSaveError(err?.message || "Failed to update Contact Us");
        toast.error(err?.message || "Failed to update Contact Us");
        setSaveMessage("");
      },
    });
  };

  // Load content from backend and populate editor and media preview
  const { data: contact } = useContactContent();
  useEffect(() => {
    if (!contact) return;
    setContactHeroFile(
      contact.hero?.url ?
        { type: contact.hero.type || "image/*", url: contact.hero.url }
      : null
    );
    // If backend stored plain text, keep as-is; if HTML, keep it too
    setContactHeroText(
      typeof contact.contentText === "string" ? contact.contentText : ""
    );
    setPriceRanges(
      Array.isArray(contact.priceRanges) ? contact.priceRanges : []
    );
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
                  onChange={(html) => {
                    setContactHeroText(html);
                    setIsDirty(true);
                  }}
                  theme="snow"
                  style={{ height: "320px" }}
                />
              </div>
            </div>

            {/* Price Ranges Section */}
            <div className="mb-[60px] flex flex-col items-center">
              <h2 className="text-[20px] font-bellefair font-normal leading-[23px] text-[#6B5A3C] mb-[16px] w-full text-left">
                Price Ranges
              </h2>

              <div className="flex flex-col lg:flex-row gap-10 mb-6 justify-center w-full">
                {/* Input Section */}
                <div className="flex-1 max-w-[320px]">
                  <input
                    type="text"
                    placeholder="Enter price range"
                    value={newPriceRange}
                    onChange={(e) => setNewPriceRange(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddPriceRange();
                      }
                    }}
                    className="w-full px-4 py-3 border border-[#D4D4D4] rounded-[8px] focus:outline-none focus:ring-2 focus:ring-[#C4A053] text-[#6B5A3C] bg-white placeholder:text-[#AAAAAA]"
                    disabled={priceRanges.length >= 5}
                  />
                  <button
                    onClick={handleAddPriceRange}
                    className={`w-full mt-3 py-3 text-white font-medium rounded-[8px] transition-colors text-[16px] ${
                      priceRanges.length >= 5 || !newPriceRange.trim() ?
                        "bg-gray-300 cursor-not-allowed"
                      : "bg-[#C4A053] hover:bg-[#B59043]"
                    }`}>
                    Add
                  </button>
                </div>

                {/* Display Section */}
                <div className="flex-1 max-w-[420px] flex flex-col gap-3">
                  {priceRanges.map((range, index) => (
                    <div key={index} className="flex items-center gap-3">
                      {editingIndex === index ?
                        <>
                          <input
                            type="text"
                            value={editingValue}
                            onChange={(e) => setEditingValue(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                handleSaveEdit(index);
                              } else if (e.key === "Escape") {
                                handleCancelEdit();
                              }
                            }}
                            className="flex-1 px-4 py-3 border border-[#C4A053] rounded-[8px] focus:outline-none focus:ring-2 focus:ring-[#C4A053] text-[#6B5A3C] bg-white"
                            autoFocus
                          />
                          <button
                            onClick={() => handleSaveEdit(index)}
                            className="w-10 h-10 flex items-center justify-center bg-green-600 text-white rounded-[8px] hover:bg-green-700 transition-colors">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor">
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="w-10 h-10 flex items-center justify-center bg-gray-400 text-white rounded-[8px] hover:bg-gray-500 transition-colors">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor">
                              <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </>
                      : <>
                          <div className="flex-1 px-4 py-3 border border-[#D4D4D4] rounded-[8px] bg-white">
                            <span className="text-[#6B5A3C] font-normal text-[15px]">
                              {range}
                            </span>
                          </div>
                          <button
                            onClick={() => handleEditPriceRange(index)}
                            className="w-10 h-10 flex items-center justify-center bg-[#C93232] text-white rounded-[8px] hover:bg-[#B02828] transition-colors"
                            title="Edit price range">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor">
                              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeletePriceRange(index)}
                            className="w-10 h-10 flex items-center justify-center bg-[#C93232] text-white rounded-[8px] hover:bg-[#B02828] transition-colors"
                            title="Delete price range">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor">
                              <path
                                fillRule="evenodd"
                                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </>
                      }
                    </div>
                  ))}
                  {priceRanges.length === 0 && (
                    <div className="px-4 py-8 text-center text-[#AAAAAA] border border-dashed border-[#D4D4D4] rounded-[8px] bg-[#FAFAFA]">
                      No price ranges added yet
                    </div>
                  )}
                  {priceRanges.length >= 5 && (
                    <div className="px-4 py-2 text-center text-sm text-orange-600 bg-orange-50 border border-orange-200 rounded-[8px]">
                      Maximum limit reached (5 ranges)
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex flex-col items-center mb-5">
              {saveMessage ?
                <div className="mb-3 text-green-700 text-2xl font-medium">
                  {saveMessage}
                </div>
              : null}
              <Button
                variant="primary"
                className="active mt-6 w-[200px] py-2 !bg-[#099a0e] text-[#099a0e] font-serif text-xl rounded-md shadow-md border border-[#099a0e] hover:shadow-lg transition-all"
                onClick={isSaving ? () => {} : handleSaveAll}
                disabled={!isDirty || isSaving}>
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

            {saveError ?
              <div className="flex justify-center mb-5">
                <span className="text-red-600 text-sm">{saveError}</span>
              </div>
            : null}
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
