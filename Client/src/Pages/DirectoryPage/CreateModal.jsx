import { useEffect, useRef, useState } from "react"
import { X, FolderPlus, Loader2, AlertTriangle, Check, Folder } from "lucide-react"
import { createDirectory } from "../../Apis/file_Dir_Api"

export default function CreateFolderModal({ onClose, onCreate, dirId = "" }) {
  const [directoryName, setDirectoryName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const inputRef = useRef(null)

  useEffect(() => {
    const input = inputRef.current
    if (!input) return

    const focusTimeout = setTimeout(() => {
      input.focus()
    }, 150)

    return () => clearTimeout(focusTimeout)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter" && !isSubmitting) {
        e.preventDefault()
        handleCreateDirectory()
      } else if (e.key === "Escape") {
        handleClose()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [directoryName, isSubmitting])

  const handleClose = () => {
    setDirectoryName("")
    setError("")
    onClose()
  }

  const handleCreateDirectory = async () => {
    if (!directoryName.trim() || isSubmitting) return

    setError("")
    setIsSubmitting(true)

    try {
      const res = await createDirectory(dirId, directoryName.trim())
      if (res.success) {
        onCreate()
        handleClose()
      } else {
        setError(res.message)
      }
    } catch (error) {
      console.error("Error creating directory:", error)
      setError("Failed to create directory. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const isValidName = directoryName.trim().length > 0
  const isEmpty = !directoryName.trim()
  const hasInvalidChars =
    directoryName.includes("/") ||
    directoryName.includes("\\") ||
    directoryName.includes("<") ||
    directoryName.includes(">") ||
    directoryName.includes(":") ||
    directoryName.includes('"') ||
    directoryName.includes("|") ||
    directoryName.includes("?") ||
    directoryName.includes("*")

  const getValidationState = () => {
    if (isEmpty) return "empty"
    if (hasInvalidChars) return "invalid"
    if (error) return "error"
    return "valid"
  }

  const validationState = getValidationState()

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      onClick={handleClose}
    >
      <div
        className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 w-full max-w-md transform transition-all duration-300 animate-in fade-in zoom-in-95 slide-in-from-bottom-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative px-8 pt-8 pb-6">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-100">
              <FolderPlus className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Create New Folder</h2>
              <p className="text-sm text-gray-500 mt-0.5">Enter a name for your new folder</p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200 group"
          >
            <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
          </button>
        </div>

        {/* Body */}
        <div className="px-8 pb-6">
          <div className="space-y-4">
            <div className="space-y-3">
              <label htmlFor="folder-name-input" className="block text-sm font-semibold text-gray-700">
                Folder name
              </label>
              <div className="relative group">
                <input
                  id="folder-name-input"
                  type="text"
                  ref={inputRef}
                  value={directoryName}
                  onChange={(e) => {
                    setDirectoryName(e.target.value)
                    setError("") // Clear error when user types
                  }}
                  className={`w-full px-4 py-4 pr-12 border-2 rounded-2xl transition-all duration-200 outline-none text-gray-900 placeholder-gray-400 font-medium ${
                    validationState === "empty"
                      ? "border-gray-200 bg-gray-50/50 focus:border-emerald-400 focus:bg-emerald-50/50"
                      : validationState === "invalid" || validationState === "error"
                        ? "border-red-200 bg-red-50/50 focus:border-red-400 focus:bg-red-50"
                        : validationState === "valid"
                          ? "border-emerald-200 bg-emerald-50/50 focus:border-emerald-400 focus:bg-emerald-50"
                          : "border-gray-200 bg-gray-50/50 focus:border-emerald-400 focus:bg-emerald-50/50"
                  } ${isSubmitting ? "opacity-60 cursor-not-allowed" : ""}`}
                  placeholder="Enter folder name"
                  disabled={isSubmitting}
                  maxLength={255}
                />

                {/* Status Icon */}
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  {isSubmitting ? (
                    <Loader2 className="w-5 h-5 text-emerald-500 animate-spin" />
                  ) : validationState === "invalid" || validationState === "error" ? (
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                  ) : validationState === "valid" ? (
                    <Check className="w-5 h-5 text-emerald-500" />
                  ) : null}
                </div>
              </div>

              {/* Validation Messages */}
              {hasInvalidChars && !isEmpty && (
                <div className="flex items-center space-x-2 text-red-600 bg-red-50 px-3 py-2 rounded-xl border border-red-100 animate-in slide-in-from-top-1 duration-200">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <p className="text-sm font-medium">
                    Invalid characters: / \ : * ? " {"<"} {">"} |
                  </p>
                </div>
              )}

              {error && (
                <div className="flex items-center space-x-2 text-red-600 bg-red-50 px-3 py-2 rounded-xl border border-red-100 animate-in slide-in-from-top-1 duration-200">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <p className="text-sm font-medium">{error}</p>
                </div>
              )}

              {isValidName && !hasInvalidChars && !error && (
                <div className="flex items-center space-x-2 text-emerald-600 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-100 animate-in slide-in-from-top-1 duration-200">
                  <Check className="w-4 h-4 flex-shrink-0" />
                  <p className="text-sm font-medium">Ready to create folder</p>
                </div>
              )}

              {/* Character Counter */}
              <div className="flex justify-between items-center text-xs text-gray-500">
                <span>Use letters, numbers, spaces, and common symbols</span>
                <span className={directoryName.length > 200 ? "text-amber-600" : ""}>{directoryName.length}/255</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-6 bg-gradient-to-r from-gray-50/80 to-gray-100/80 backdrop-blur-sm rounded-b-3xl border-t border-gray-100">
          <div className="flex justify-end space-x-3">
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="px-6 py-3 text-sm font-semibold text-gray-700 hover:text-gray-900 hover:bg-white/80 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-200 hover:border-gray-300 hover:shadow-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateDirectory}
              disabled={!isValidName || hasInvalidChars || isSubmitting}
              className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white text-sm font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-emerald-600 disabled:hover:to-emerald-700 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <Folder className="w-4 h-4" />
                  <span>Create Folder</span>
                </>
              )}
            </button>
          </div>

          {/* Keyboard Shortcuts */}
          <div className="mt-4 flex items-center justify-center space-x-4 text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <kbd className="px-2 py-1 bg-white/60 border border-gray-200 rounded-lg font-mono font-semibold shadow-sm">
                Enter
              </kbd>
              <span>to create</span>
            </div>
            <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
            <div className="flex items-center space-x-1">
              <kbd className="px-2 py-1 bg-white/60 border border-gray-200 rounded-lg font-mono font-semibold shadow-sm">
                Esc
              </kbd>
              <span>to cancel</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
