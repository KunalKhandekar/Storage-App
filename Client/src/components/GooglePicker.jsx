"use client";

import { useEffect, useRef, useState } from "react";
import { driveConnect } from "../Apis/authApi";

export default function DrivePickerDemo() {
  const pickerRef = useRef(null);
  const [showPicker, setShowPicker] = useState(false);
  const tokenRef = useRef(null);
  const handledRef = useRef(false);

  const clientId =
    "53857639641-1se37lrtof61kmpu74g521k95erfpmkc.apps.googleusercontent.com";
  const appId = "AIzaSyCxrkyjEHqEC7alhhuUrlqDxlkQmMaDrRg";
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
      const response = await driveConnect({
        token: tokenRef.current,
        filesMetaData: selection.docs,
      });

      console.log(response.data);
      setShowPicker(false);
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
  }, [showPicker]);

  return (
    <div>
      <button
        type="button"
        className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
        onClick={handleOpen}
        disabled={!clientId}
        aria-disabled={!clientId}
      >
        {clientId ? "Open Drive Picker" : "Set NEXT_PUBLIC_GOOGLE_CLIENT_ID"}
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
