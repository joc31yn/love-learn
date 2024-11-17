"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    handleCredentialResponse: (response: any) => void;
  }
}

export default function ClientLogin() {
  useEffect(() => {
    window.handleCredentialResponse = (response) => {
      console.log(response);
    };
  }, []);

  return (
    <>
      {/* Google One Tap Sign-In */}
      <div id="g_id_onload"
           data-client_id={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
           data-context="signin"
           data-ux_mode="popup"
           data-callback="handleCredentialResponse"
           data-auto_prompt="false">
      </div>
      <div className="g_id_signin"
           data-type="standard"
           data-shape="rectangular"
           data-theme="outline"
           data-text="signin_with"
           data-size="large"
           data-logo_alignment="left">
      </div>
    </>
  );
}
