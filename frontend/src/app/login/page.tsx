"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleMicrosoftLogin = async () => {
    setIsLoading(true);
    await signIn("azure-ad", { callbackUrl: "/" });
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-bold">Duo Marketing</h1>
          <p className="mt-2 text-gray-600">Sign in to your account</p>
        </div>

        <div className="mt-8">
          <button
            onClick={handleMicrosoftLogin}
            disabled={isLoading}
            className="flex w-full items-center justify-center rounded-md bg-[#2F2F2F] px-4 py-2 text-white hover:bg-[#1E1E1E] focus:outline-none focus:ring-2 focus:ring-[#1E1E1E] focus:ring-offset-2 disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? (
              <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mr-2 h-5 w-5"
                viewBox="0 0 23 23"
                fill="none"
              >
                <path
                  d="M11 0H0V11H11V0Z"
                  fill="#F1511B"
                />
                <path
                  d="M23 0H12V11H23V0Z"
                  fill="#80CC28"
                />
                <path
                  d="M11 12H0V23H11V12Z"
                  fill="#00ADEF"
                />
                <path
                  d="M23 12H12V23H23V12Z"
                  fill="#FBBC09"
                />
              </svg>
            )}
            Sign in with Microsoft
          </button>
        </div>
      </div>
    </div>
  );
}
