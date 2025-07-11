import { FolderPlus, Upload } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { uploadInBatches } from "../../Apis/uploadApi";
import ImportDrive from "../../components/ImportDrive";

const MAX_CONCURRENT_UPLOADS = 5;

const UploadSection = ({ setShowCreateModal, setActionDone }) => {
  const [progressMap, setProgressMap] = useState({});
  const [dragOver, setDragOver] = useState(false);
  const { dirId } = useParams();

  const handleFileUpload = async (selectedFiles) => {
    const fileList = Array.from(selectedFiles);
    const initialProgress = {};
    fileList.forEach((file) => {
      initialProgress[file.name] = 0;
    });
    setProgressMap(initialProgress);

    try {
      await uploadInBatches(
        fileList,
        MAX_CONCURRENT_UPLOADS,
        dirId,
        setProgressMap
      );
      setActionDone(true);
      // TOAST
      console.log("All files uploaded successfully");
    } catch (err) {
      console.error("Some uploads failed");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFiles = e.dataTransfer.files;
    handleFileUpload(droppedFiles);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  return (
    <>
      {/* Upload Progress */}
      {Object.keys(progressMap).length > 0 && (
        <div className="mb-6 sm:mb-8 space-y-3">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">
            Upload Progress
          </h3>
          {Object.entries(progressMap).map(([fileName, progress]) => (
            <div
              key={fileName}
              className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs sm:text-sm font-medium text-gray-800 truncate flex-1 mr-2">
                  {fileName}
                </span>
                <span className="text-xs sm:text-sm font-semibold text-blue-600 flex-shrink-0">
                  {progress}%
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2 sm:h-2.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 sm:h-2.5 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Hero Section */}
      <div
        className={`mb-4 border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragOver ? "border-blue-400 bg-blue-50" : "border-gray-300 bg-white"
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Upload Files or Create Directory
        </h2>
        <p className="text-gray-600 mb-4">
          Drag and drop files here, or click to select files
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center w-full sm:max-w-2xl mx-auto">
          {/* Upload Files Button */}
          <label className="group relative inline-flex items-center justify-center w-full sm:w-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl hover:from-blue-700 hover:to-blue-800 cursor-pointer transition-all duration-200 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 min-h-[48px] sm:min-w-[140px] lg:min-w-[160px] touch-manipulation">
            <Upload className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 transition-transform group-hover:scale-110 flex-shrink-0" />
            <span className="truncate">Upload Files</span>
            <input
              type="file"
              multiple
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={(e) => handleFileUpload(e.target.files)}
            />
            <div className="absolute inset-0 rounded-xl bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-200" />
          </label>

          {/* Create Directory Button */}
          <button
            onClick={() => setShowCreateModal(true)}
            className="group relative inline-flex items-center justify-center w-full sm:w-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 text-sm font-semibold text-white bg-gradient-to-r from-green-600 to-green-700 rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 min-h-[48px] sm:min-w-[140px] lg:min-w-[160px] touch-manipulation"
          >
            <FolderPlus className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 transition-transform group-hover:scale-110 flex-shrink-0" />
            <span className="truncate">Create Directory</span>
            <div className="absolute inset-0 rounded-xl bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-200" />
          </button>

          {/* Import Drive Button */}
          <ImportDrive setActionDone={setActionDone} />
        </div>
      </div>
    </>
  );
};

export default UploadSection;
