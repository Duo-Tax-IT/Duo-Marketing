"use client";

import { SessionCheck } from "@/components/auth/session-check";
import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";

export default function HomePage() {
  return (
    <SessionCheck>
      <div className="flex h-screen flex-col">
        <Navbar />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 p-8">
            <h1 className="text-2xl font-semibold">Dashboard</h1>
            <p className="mt-4 text-gray-600">Welcome to your dashboard!</p>
          </main>
        </div>
      </div>
    </SessionCheck>
  );
}
