import { FolderPlus, Upload } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { uploadInBatches } from "../../Apis/uploadApi";

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
        <div className="mb-6 space-y-2">
          {Object.entries(progressMap).map(([fileName, progress]) => (
            <div
              key={fileName}
              className="bg-white rounded-lg border border-gray-200 p-3"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">
                  {fileName}
                </span>
                <span className="text-sm text-gray-500">{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
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

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <label className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors">
            <Upload className="w-4 h-4 mr-2" />
            Upload Files
            <input
              type="file"
              multiple
              className="hidden"
              onChange={(e) => handleFileUpload(e.target.files)}
            />
          </label>

          <button
            onClick={() => {
              setShowCreateModal(true);
            }}
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <FolderPlus className="w-4 h-4 mr-2" />
            Create Directory
          </button>
        </div>
      </div>
    </>
  );
};

export default UploadSection;
