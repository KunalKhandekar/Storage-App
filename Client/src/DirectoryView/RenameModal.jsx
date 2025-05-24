import { useEffect, useRef, useState } from "react";

function RenameModal({ item, onClose, onRename }) {
  const [newName, setNewName] = useState(item.name);
  const inputRef = useRef(null);

  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;

    input.focus();
    const dotIndex = item.name.lastIndexOf(".");
    if (dotIndex !== -1) {
      input.setSelectionRange(0, dotIndex);
    } else {
      input.select(); 
    }
  }, [item.name]);

  const handleRename = async () => {
    await fetch(`http://localhost:4000/${item.type}/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ name: newName }),
    });
    onRename();
  };

  return (
    <div
      className="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl p-6 shadow-lg w-96"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold mb-4">Rename {item.type}</h2>
        <input
          type="text"
            ref={inputRef}
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
        />
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 hover:underline"
          >
            Cancel
          </button>
          <button
            onClick={handleRename}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
          >
            Rename
          </button>
        </div>
      </div>
    </div>
  );
}

export default RenameModal;
