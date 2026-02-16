"use client";

import { useConvexAuth } from "convex/react";

export function useAuth() {
  const { isAuthenticated, isLoading } = useConvexAuth();

  async function loginWithGoogle() {
    // Convex Auth Google sign-in — requires @convex-dev/auth setup
    // Run: npm install @convex-dev/auth and configure Google provider
    console.warn("Google OAuth not yet configured. Run: npm install @convex-dev/auth");
  }

  async function signOut() {
    console.warn("signOut not yet configured.");
  }

  return { isAuthenticated, isLoading, loginWithGoogle, signOut };
}
