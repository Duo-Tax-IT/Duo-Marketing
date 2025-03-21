'use client';

import { Button } from "@/components/ui/button";

export default function ProjectsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
      <h2 className="text-2xl font-bold text-destructive">Something went wrong!</h2>
      <p className="text-muted-foreground">{error.message}</p>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
} 