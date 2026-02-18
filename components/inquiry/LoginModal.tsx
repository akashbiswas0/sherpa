"use client";

import { Modal } from "@/components/primitives/Modal";
import { Button } from "@/components/primitives/Button";
import { useAuth } from "@/hooks/useAuth";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export function LoginModal({ isOpen, onClose, onLoginSuccess }: LoginModalProps) {
  const { loginWithGoogle } = useAuth();

  async function handleGoogleLogin() {
    await loginWithGoogle();
    onLoginSuccess();
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Sign in to connect">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
          paddingTop: 8,
        }}
      >
        <p className="text-sm text-gray-600 text-center">
          Sign in to send your inquiry. Takes 5 seconds.
        </p>
        <Button label="Continue with Google" onClick={handleGoogleLogin} fullWidth />
      </div>
    </Modal>
  );
}
