import { useEffect, useMemo, useRef, useState } from "react"
import { CheckCircle2, Loader2 } from 'lucide-react'
import { useGlobalProgress } from "../Contexts/ProgressContext"
import { useModal } from "../Contexts/ModalContext"

export function GlobalUploadProgress() {
  const { active, total, completed, percent } = useGlobalProgress()
  const { showModal } = useModal()

  const isFinished = useMemo(() => {
    return total > 0 && completed >= total && !active
  }, [total, completed, active])

  const [holdVisible, setHoldVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const holdTimerRef = useRef(null)

  useEffect(() => {
    if (isFinished) {
      setHoldVisible(true)
      if (holdTimerRef.current) clearTimeout(holdTimerRef.current)
      holdTimerRef.current = setTimeout(() => {
        setHoldVisible(false)
        setDismissed(false)
        
        showModal(
          "Success",
          "Files have been uploaded successfully. You can find them in the 'Google Drive' folder at the root directory.",
          "success",
        )
      }, 2000)
    }
    return () => {
      if (holdTimerRef.current) {
        clearTimeout(holdTimerRef.current)
        holdTimerRef.current = null
      }
    }
  }, [isFinished])

  const shouldShow = (active || holdVisible) && !dismissed
  if (!shouldShow) return null

  const ariaLabel = isFinished ? "Upload completed successfully" : "File upload in progress"
  const percentSafe = Number.isFinite(percent) ? Math.max(0, Math.min(100, percent)) : 0
  const countText = total > 0 ? `${Math.min(completed, total)} of ${total} files` : "Preparing upload..."

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={ariaLabel}
      className="fixed bottom-6 right-6 z-50 transition-all duration-200 ease-out"
    >
      <div className="min-w-[300px] max-w-[380px] rounded-lg border border-gray-200 bg-white shadow-lg">
        <div className="p-4">
          {/* Header with icon and title */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-shrink-0">
              {isFinished ? (
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-gray-900">
                {isFinished ? "Upload Complete" : "Uploading Files"}
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                {isFinished ? "All files uploaded successfully" : "Please don't close this window"}
              </p>
            </div>
            
            <div className="text-right">
              <div className="text-lg font-semibold text-gray-900 tabular-nums">
                {percentSafe}%
              </div>
            </div>
          </div>

          {/* File count */}
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-gray-600">{countText}</span>
            <span className={`text-sm font-medium ${
              isFinished ? 'text-green-600' : 'text-blue-600'
            }`}>
              {isFinished ? 'Complete' : 'In Progress'}
            </span>
          </div>

          {/* Progress bar */}
          <div
            className="h-2 w-full bg-gray-100 rounded-full overflow-hidden"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={percentSafe}
            aria-valuetext={isFinished ? "Upload complete" : `${percentSafe}% complete`}
          >
            <div
              className={`h-full rounded-full transition-all duration-300 ease-out ${
                isFinished 
                  ? "bg-green-500" 
                  : "bg-blue-500"
              }`}
              style={{ width: `${percentSafe}%` }}
            />
          </div>

          {/* Status footer */}
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
            <div className={`w-1.5 h-1.5 rounded-full ${
              isFinished 
                ? 'bg-green-500' 
                : 'bg-blue-500 animate-pulse'
            }`} />
            <span className="text-xs text-gray-500">
              {isFinished 
                ? "Files are now available in your drive" 
                : "Upload in progress, please wait..."
              }
            </span>
          </div>

          <span className="sr-only">{ariaLabel}</span>
        </div>
      </div>
    </div>
  )
}