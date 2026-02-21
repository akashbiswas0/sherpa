"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Google OAuth callback — handled by Convex Auth after setup
// Once @convex-dev/auth is configured, this page is used as the redirect URI
export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    // Convex auth handles the token exchange automatically.
    // Redirect back to home after a short moment.
    router.replace("/");
  }, [router]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "60vh",
      }}
    >
      <p className="text-gray-500">Signing you in…</p>
    </div>
  );
}
