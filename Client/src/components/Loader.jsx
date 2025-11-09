import React from "react";

function Loader() {
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-50">
      <div className="text-center">
        <div className="loader"></div>
      </div>
    </div>
  );
}

export default Loader;
