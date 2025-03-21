"use client";

import { SessionCheck } from "@/components/auth/session-check";
import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";

export default function ProjectsPage() {
  return (
    <SessionCheck>
      <div className="flex h-screen flex-col">
        <Navbar />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 p-8">
            <h1 className="text-2xl font-semibold">Projects</h1>
            <p className="mt-4 text-gray-600">Your projects will appear here.</p>
          </main>
        </div>
      </div>
    </SessionCheck>
  );
}
