"use client";

import { SessionCheck } from "@/components/auth/session-check";
import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";
import { StatsCard } from "@/components/ui/stats-card";
import { DonutChart } from "@/components/ui/donut-chart";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";

interface Stats {
  projects: number;
  tasks: number;
  content: number;
}

interface ChartData {
  name: string;
  value: number;
}

interface DueTasksResponse {
  data: Array<{ name: string; value: number }>;
  totalCount: number;
}

async function fetchStats(token: string): Promise<Stats> {
  if (!token) return { projects: 0, tasks: 0, content: 0 };

  const [projectsRes, tasksRes, contentRes] = await Promise.all([
    fetch('/api/projects', {
      headers: { 'Authorization': `Bearer ${token}` }
    }),
    fetch('/api/tasks', {
      headers: { 'Authorization': `Bearer ${token}` }
    }),
    fetch('/api/content', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
  ]);

  const projects = await projectsRes.json();
  const tasks = await tasksRes.json();
  const content = await contentRes.json();

  return {
    projects: projects.records.length,
    tasks: tasks.records.length,
    content: content.records.length
  };
}

async function fetchDueTasks(token: string): Promise<DueTasksResponse> {
  if (!token) return { data: [], totalCount: 0 };

  const response = await fetch('/api/tasks/due-soon', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch due tasks');
  }

  interface TaskRecord {
    Type__c: string;
  }

  const data = await response.json();

  // Group by Type__c and count
  const groupedByType = data.records.reduce((acc: Record<string, number>, task: TaskRecord) => {
    const type = task.Type__c || 'Unspecified';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  // Convert to chart data format
  const chartData = Object.entries(groupedByType).map(([name, value]) => ({
    name,
    value: value as number
  }));

  return {
    data: chartData,
    totalCount: data.records.length
  };
}

export default function DashboardPage() {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      return;
    }
  });

  const { data: stats, isLoading: statsLoading, error: statsError } = useQuery<Stats, Error>({
    queryKey: ['dashboard-stats', session?.accessToken],
    queryFn: () => fetchStats(session?.accessToken || ''),
    enabled: !!session?.accessToken,
    staleTime: Infinity,
    gcTime: 1000 * 60 * 30, // 30 minutes
  });

  const { data: dueTasks, isLoading: dueTasksLoading, error: dueTasksError } = useQuery<DueTasksResponse, Error>({
    queryKey: ['due-tasks', session?.accessToken],
    queryFn: () => fetchDueTasks(session?.accessToken || ''),
    enabled: !!session?.accessToken,
    staleTime: Infinity,
    gcTime: 1000 * 60 * 30, // 30 minutes
  });

  return (
    <SessionCheck>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="flex flex-1 flex-grow">
          <Sidebar />
          <main className="flex-1 p-8 min-h-[calc(100vh-4rem)] bg-gray-50">
            <div className="max-w-7xl mx-auto space-y-8">
              <h1 className="text-3xl font-bold">Dashboard</h1>
              
              {/* Stats Cards */}
              {statsLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-32 bg-gray-200 animate-pulse rounded-lg" />
                  ))}
                </div>
              ) : statsError ? (
                <div className="text-red-500">
                  Error: {statsError instanceof Error ? statsError.message : 'Failed to load dashboard stats'}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <StatsCard title="Projects" count={stats?.projects || 0} />
                  <StatsCard title="Tasks" count={stats?.tasks || 0} />
                  <StatsCard title="Website Content" count={stats?.content || 0} />
                </div>
              )}

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Due Tasks Donut Chart */}
                {dueTasksLoading ? (
                  <div className="h-[400px] bg-gray-200 animate-pulse rounded-lg" />
                ) : dueTasksError ? (
                  <div className="text-red-500">
                    Error: {dueTasksError instanceof Error ? dueTasksError.message : 'Failed to load due tasks'}
                  </div>
                ) : (
                  <DonutChart
                    title="Tasks Due in 7 Days"
                    data={dueTasks?.data || []}
                    totalCount={dueTasks?.totalCount || 0}
                  />
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </SessionCheck>
  );
}
