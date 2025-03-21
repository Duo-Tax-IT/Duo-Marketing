"use client";

import { SessionCheck } from "@/components/auth/session-check";
import { signOut, useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  return (
    <SessionCheck>
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <div className="text-center">
          <h1 className="text-4xl font-bold">Duo Marketing</h1>
          
          <div className="mt-8 text-center">
            <p className="mb-4">Welcome, {session?.user?.name || "User"}!</p>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
            >
              Sign out
            </button>
          </div>
        </div>
      </main>
    </SessionCheck>
  );
}
