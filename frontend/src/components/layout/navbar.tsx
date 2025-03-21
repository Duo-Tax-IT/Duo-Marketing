"use client";

import { useSession } from "next-auth/react";

export function Navbar() {
  const { data: session } = useSession();
  const userInitials = session?.user?.email?.slice(0, 2).toUpperCase() || "??";

  return (
    <nav className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4">
      <div className="text-xl font-semibold">Duo Marketing</div>
      <div className="flex items-center gap-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm text-white">
          {userInitials}
        </div>
      </div>
    </nav>
  );
}
