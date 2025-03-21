'use client';

import { SessionCheck } from "@/components/auth/session-check";
import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";
import { ProjectCard } from '@/components/projects/project-card';
import { Project } from '@/lib/types';
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function ProjectsPage() {
  const { data: session, status } = useSession();
  const [projects, setProjects] = useState<Project[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      if (status !== 'authenticated' || !session?.accessToken) {
        console.log('Session not ready:', { status, hasToken: !!session?.accessToken });
        return;
      }

      try {
        console.log('Fetching projects with session:', { 
          status,
          hasToken: !!session?.accessToken,
          tokenPreview: session?.accessToken ? `${session.accessToken.slice(0, 10)}...` : 'none'
        });

        const res = await fetch('/api/projects');
        
        if (!res.ok) {
          const errorData = await res.json();
          console.error('Error response:', { 
            status: res.status, 
            statusText: res.statusText,
            errorData 
          });
          throw new Error(errorData.error || `Failed to fetch projects: ${res.status} ${res.statusText}`);
        }

        const data = await res.json();
        console.log('Projects data:', data);
        setProjects(data.records || []);
      } catch (error) {
        console.error('Error in fetchProjects:', error);
        setError(error instanceof Error ? error.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    if (status === 'authenticated') {
      fetchProjects();
    } else if (status === 'unauthenticated') {
      setError('Please sign in to view projects');
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
              <h1 className="text-3xl font-bold mb-8">Projects</h1>
              {status === 'loading' || loading ? (
                <div>Loading projects...</div>
              ) : error ? (
                <div className="text-red-500">Error: {error}</div>
              ) : projects.length === 0 ? (
                <div>No projects found.</div>
              ) : (
                <div className="space-y-4">
                  {projects.map((project) => (
                    <ProjectCard key={project.Id} project={project} />
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
