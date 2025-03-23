"use client";

import { SessionCheck } from "@/components/auth/session-check";
import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import { useSession } from "next-auth/react";
import { useQuery } from '@tanstack/react-query';

interface Task {
  Id: string;
  Name: string;
}

async function fetchTasks(token: string): Promise<Task[]> {
  if (!token) return [];
  
  const res = await fetch('/api/tasks', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || `Failed to fetch tasks: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  return data.records as Task[];
}

export default function TasksPage() {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      // Handle unauthenticated state - the SessionCheck component will handle the redirect
      return;
    }
  });

  const { data: tasks, error, isLoading } = useQuery<Task[], Error>({
    queryKey: ['tasks', session?.accessToken],
    queryFn: () => fetchTasks(session?.accessToken || ''),
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
                <h1 className="text-3xl font-bold mb-8">Tasks</h1>
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
              <h1 className="text-3xl font-bold mb-8">Tasks</h1>
              {isLoading ? (
                <div>Loading tasks...</div>
              ) : error ? (
                <div className="text-red-500">Error: {error instanceof Error ? error.message : 'Failed to load tasks'}</div>
              ) : !tasks?.length ? (
                <div>No active tasks found.</div>
              ) : (
                <div className="space-y-4">
                  {tasks.map((task: Task) => (
                    <Card key={task.Id} className="w-full mb-4 hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-lg text-gray-900">
                            {task.Name}
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
