"use client";

import { SessionCheck } from "@/components/auth/session-check";
import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

interface Task {
  Id: string;
  Name: string;
}

export default function TasksPage() {
  const { data: session, status } = useSession();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTasks() {
      if (status !== 'authenticated' || !session?.accessToken) {
        console.log('Session not ready:', { status, hasToken: !!session?.accessToken });
        return;
      }

      try {
        console.log('Fetching tasks...');
        const res = await fetch('/api/tasks');
        
        if (!res.ok) {
          const errorData = await res.json();
          console.error('Error response:', { 
            status: res.status, 
            statusText: res.statusText,
            errorData 
          });
          throw new Error(errorData.error || `Failed to fetch tasks: ${res.status} ${res.statusText}`);
        }

        const data = await res.json();
        console.log('Tasks data:', data);
        setTasks(data.records || []);
      } catch (error) {
        console.error('Error in fetchTasks:', error);
        setError(error instanceof Error ? error.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    if (status === 'authenticated') {
      fetchTasks();
    } else if (status === 'unauthenticated') {
      setError('Please sign in to view tasks');
      setLoading(false);
    }
  }, [status, session]);

  return (
    <SessionCheck>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="flex flex-1 flex-grow">
          <Sidebar />
          <main className="flex-1 p-8 min-h-[calc(100vh-4rem)] bg-gray-50">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-3xl font-bold mb-8">Tasks</h1>
              {status === 'loading' || loading ? (
                <div>Loading tasks...</div>
              ) : error ? (
                <div className="text-red-500">Error: {error}</div>
              ) : tasks.length === 0 ? (
                <div>No active tasks found.</div>
              ) : (
                <div className="space-y-4">
                  {tasks.map((task) => (
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
