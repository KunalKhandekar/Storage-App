const FilePreview = ({ fileUrl, fileName }) => {
  const extension = fileName.split(".").pop().toLowerCase();

  if (!fileUrl || !fileName) {
    return <div className="text-gray-500">No file selected</div>;
  }

  const renderContent = () => {
    if (["docx", "xlsx", "csv", "ppt"].includes(extension)) {
      return (
        <div className="text-center space-y-4">
          <p className="text-gray-600 font-medium">
            Preview not available. Please download the file to view it.
          </p>
          <a
            href={fileUrl}
            download={fileName}
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-2xl transition duration-200"
          >
            Download {fileName}
          </a>
        </div>
      );
    }

    if (["png", "jpg", "jpeg", "gif", "webp", "bmp"].includes(extension)) {
      return (
        <img
          src={fileUrl}
          alt={fileName}
          className="max-w-full max-h-[80vh] mx-auto rounded"
        />
      );
    }

    if (["pdf"].includes(extension)) {
      return (
        <iframe
          src={fileUrl}
          title="PDF Viewer"
          className="w-full h-[80vh] rounded"
        />
      );
    }

    if (["mp4", "webm"].includes(extension)) {
      return (
        <video controls className="max-w-full max-h-[80vh] mx-auto rounded">
          <source src={fileUrl} type={`video/${extension}`} />
          Your browser does not support the video tag.
        </video>
      );
    }

    if (["mp3"].includes(extension)) {
      return (
        <audio controls className="w-full">
          <source src={fileUrl} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      );
    }

    return (
      <div className="text-red-500">
        File preview not supported for this format.
      </div>
    );
  };

  return (
    <div className="bg-gray-50 p-4 rounded shadow max-w-6xl mx-auto">
      {renderContent()}
    </div>
  );
};

export default FilePreview;
