"use client";

export function useAuth() {
  // Auth not yet configured — stubs keep the app functional
  const isAuthenticated = false;
  const isLoading = false;

  async function loginWithGoogle() {
    console.warn("Google OAuth not yet configured. Run: npm install @convex-dev/auth");
  }

  async function signOut() {
    console.warn("signOut not yet configured.");
  }

  return { isAuthenticated, isLoading, loginWithGoogle, signOut };
}
