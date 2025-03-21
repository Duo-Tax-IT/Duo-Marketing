"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { PropsWithChildren, useEffect } from "react";

export function SessionCheck({ children }: PropsWithChildren) {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-900 border-t-transparent"></div>
      </div>
    );
  }

  if (status === "authenticated") {
    return <>{children}</>;
  }

  return null;
}
