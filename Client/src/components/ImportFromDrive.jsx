import { useState } from "react";

import { useEffect, useRef } from "react";
import { useGlobalProgress } from "../Contexts/ProgressContext";
import { useNavigate } from "react-router-dom";
import { useModal } from "../Contexts/ModalContext";
import { driveConnect } from "../Apis/file_Dir_Api";
import { useAuth } from "../Contexts/AuthContext";
import { formatFileSize } from "../Utils/helpers";

export default function ImportFromDrive({ setActionDone, progressMap }) {
  const navigate = useNavigate();
  const pickerRef = useRef(null);
  const [showPicker, setShowPicker] = useState(false);
  const tokenRef = useRef(null);
  const handledRef = useRef(false);

  const { start, step, finish, reset, active } = useGlobalProgress();
  const { showModal } = useModal();
  const { user } = useAuth();

  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const appId = import.meta.env.VITE_GOOGLE_APP_ID;
  const scope = "https://www.googleapis.com/auth/drive.readonly";

  async function handleOpen() {
    if (!clientId) return;
    await import("@googleworkspace/drive-picker-element");
    setShowPicker(true);
  }

  useEffect(() => {
    if (!showPicker || !pickerRef.current) return;
    const el = pickerRef.current;

    const onAuth = (e) => {
      tokenRef.current =
        e?.detail?.access_token || e?.detail?.token || e?.detail || null;
    };

    const onPicked = async (e) => {
      if (handledRef.current) return;
      handledRef.current = true;

      const selection = e?.detail ?? null;
      const docs = selection?.docs || [];

      setShowPicker(false);

      if (docs.length === 0) {
        handledRef.current = false;
        return;
      }

      try {
        start(docs.length || 0);

        for (const file of docs) {
          const response = await driveConnect({
            token: tokenRef.current,
            filesMetaData: docs,
            fileForUploading: file,
          });

          if (!response.success) {
            reset();
            showModal("Error", response.message, "error");
            handledRef.current = false;
            return;
          }

          step(1);
        }

        finish();
        navigate("/");
        setActionDone(true);
      } catch (err) {
        console.error("Drive import failed:", err);
        reset();
        showModal("Error", "Drive import failed. Please try again.", "error");
      }

      handledRef.current = false;
    };

    const onCanceled = () => {
      setShowPicker(false);
    };

    el.addEventListener("picker:picked", onPicked);
    el.addEventListener("picker-picked", onPicked);
    el.addEventListener("picker:canceled", onCanceled);
    el.addEventListener("picker-canceled", onCanceled);
    el.addEventListener("picker:authenticated", onAuth);
    el.addEventListener("picker-authenticated", onAuth);
    el.addEventListener("picker-oauth-response", onAuth);

    Promise.resolve().then(() => {
      if (el) el.visible = true;
    });

    return () => {
      el.removeEventListener("picker:picked", onPicked);
      el.removeEventListener("picker-picked", onPicked);
      el.removeEventListener("picker:canceled", onCanceled);
      el.removeEventListener("picker-canceled", onCanceled);
      el.removeEventListener("picker:authenticated", onAuth);
      el.removeEventListener("picker-authenticated", onAuth);
      el.removeEventListener("picker-oauth-response", onAuth);
    };
  }, [showPicker, start, step, finish]);

  return (
    <div>
      <button
        onClick={handleOpen}
        disabled={Object.keys(progressMap).length > 0 || active}
        aria-disabled={Object.keys(progressMap).length > 0 || active}
        title={`${active ? "Importing Files" : "Import Google Files"}`}
        className={`group relative inline-flex items-center justify-center w-full sm:w-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 text-sm font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-sm min-h-[48px] sm:min-w-[140px] lg:min-w-[160px]
    ${
      active || Object.keys(progressMap).length > 0
        ? "bg-gray-200 text-gray-400 border-gray-200 cursor-not-allowed shadow-none"
        : "bg-white text-gray-700 border-2 border-gray-300 hover:border-purple-400 hover:text-purple-700 hover:bg-purple-50 hover:shadow-md focus:ring-purple-500"
    }
  `}
      >
        <svg
          className="w-4 h-4 mr-2 transition-transform group-hover:scale-110 flex-shrink-0"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
        </svg>
        <span className="truncate">Import from Drive</span>
      </button>

      {showPicker ? (
        <drive-picker
          ref={pickerRef}
          client-id={clientId}
          app-id={appId}
          scope={scope}
          multiselect="true"
        ></drive-picker>
      ) : null}
    </div>
  );
}
