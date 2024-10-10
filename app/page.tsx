"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CircleLogo from "@/app/ui/circle-logo";
import LoginModal from "@/app/ui/auth/LoginModal";
import SignupModal from "@/app/ui/auth/SignupModal";

export default function Page() {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    };
    checkAuthStatus();
    window.addEventListener("storage", checkAuthStatus);
    return () => window.removeEventListener("storage", checkAuthStatus);
  }, []);

  const handleLoginSuccess = (
    userId: string,
    siteId: string,
    token?: string
  ) => {
    localStorage.setItem("userId", userId);
    localStorage.setItem("siteId", siteId);
    token && localStorage.setItem("token", token);
    setIsLoggedIn(true);
    setShowLogin(false);
    router.push("/dashboard");
  };

  const handleSignupSuccess = () => {
    setShowSignup(false);
    setShowLogin(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("siteId");
    setIsLoggedIn(false);
  };

  const handleSwitchToSignup = () => {
    setShowLogin(false);
    setShowSignup(true);
  };

  const handleSwitchToLogin = () => {
    setShowSignup(false);
    setShowLogin(true);
  };

  return (
    <main className="flex min-h-screen flex-col">
      <header className="flex justify-end p-4">
        {isLoggedIn ? (
          <>
            <button
              onClick={() => router.push("/dashboard")}
              className="mr-4 px-4 py-2 text-blue-500 hover:underline"
            >
              Dashboard
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setShowLogin(true)}
              className="mr-4 rounded bg-white px-4 py-2 text-blue-500 hover:bg-blue-100"
            >
              Login
            </button>
            <button
              onClick={() => setShowSignup(true)}
              className="rounded bg-blue-700 px-4 py-2 text-white hover:bg-blue-600"
            >
              Sign Up
            </button>
          </>
        )}
      </header>

      <div className="flex grow flex-col items-center justify-center bg-blue-500 p-6 text-white">
        <div className="mb-8 h-32 w-32">
          <CircleLogo />
        </div>
        <h1 className="mb-4 text-4xl font-bold">Welcome to Circle</h1>
        <p className="text-xl">Your platform for seamless connections</p>
        {isLoggedIn && (
          <button
            onClick={() => router.push("/dashboard")}
            className="mt-8 px-6 py-3 bg-white text-blue-500 rounded-full text-lg font-semibold hover:bg-blue-100 transition-colors"
          >
            Go to Dashboard
          </button>
        )}
      </div>

      <footer className="bg-blue-600 p-4 text-center text-white">
        © 2024 Circle. All rights reserved.
      </footer>

      {showLogin && !isLoggedIn && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onLoginSuccess={handleLoginSuccess}
          onSignupClick={handleSwitchToSignup}
          onForgotPasswordClick={() => {
            /* Implement forgot password functionality */
          }}
        />
      )}
      {showSignup && !isLoggedIn && (
        <SignupModal
          onClose={() => setShowSignup(false)}
          onSignupSuccess={handleSignupSuccess}
          onSwitchToLogin={handleSwitchToLogin}
        />
      )}
    </main>
  );
}
