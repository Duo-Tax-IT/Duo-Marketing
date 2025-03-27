"use client";

import { useSession, signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut } from "lucide-react";

export function Navbar() {
  const { data: session } = useSession();
  const userInitials = session?.user?.email?.slice(0, 2).toUpperCase() || "??";

  return (
    <nav className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4">
      <div className="text-xl font-semibold">Duo Marketing</div>
      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm text-white hover:bg-blue-700 transition-colors">
            {userInitials}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span>{session?.user?.name}</span>
                <span className="text-xs text-gray-500">{session?.user?.email}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => signOut()}
              className="text-red-600 cursor-pointer"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}
