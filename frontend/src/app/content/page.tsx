'use client';

import { SessionCheck } from "@/components/auth/session-check";
import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import { useSession } from "next-auth/react";
import { useQuery } from '@tanstack/react-query';

interface ContentItem {
  Id: string;
  Name: string;
}

async function fetchContent(token: string): Promise<ContentItem[]> {
  if (!token) return [];
  
  const res = await fetch('/api/content', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || `Failed to fetch content: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  return data.records as ContentItem[];
}

export default function ContentPage() {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      return;
    }
  });

  const { data: content, error, isLoading } = useQuery<ContentItem[], Error>({
    queryKey: ['content', session?.accessToken],
    queryFn: () => fetchContent(session?.accessToken || ''),
    enabled: !!session?.accessToken,
    staleTime: Infinity, // Never consider the data stale
    gcTime: 1000 * 60 * 30, // Keep cache for 30 minutes
  });

  // Early return for loading state
  if (!session) {
    return (
      <SessionCheck>
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <div className="flex flex-1 flex-grow">
            <Sidebar />
            <main className="flex-1 p-8 min-h-[calc(100vh-4rem)] bg-gray-50">
              <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">Website Content</h1>
                <div>Loading...</div>
              </div>
            </main>
          </div>
        </div>
      </SessionCheck>
    );
  }

  return (
    <SessionCheck>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="flex flex-1 flex-grow">
          <Sidebar />
          <main className="flex-1 p-8 min-h-[calc(100vh-4rem)] bg-gray-50">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-3xl font-bold mb-8">Website Content</h1>
              {isLoading ? (
                <div>Loading content...</div>
              ) : error ? (
                <div className="text-red-500">Error: {error instanceof Error ? error.message : 'Failed to load content'}</div>
              ) : !content?.length ? (
                <div>No pending content found.</div>
              ) : (
                <div className="space-y-4">
                  {content.map((item: ContentItem) => (
                    <Card key={item.Id} className="w-full mb-4 hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-lg text-gray-900">
                            {item.Name}
                          </h3>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-5 w-5" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </SessionCheck>
  );
} 