"use client";

import { SessionCheck } from "@/components/auth/session-check";
import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";
import { StatsCard } from "@/components/ui/stats-card";
import { DonutChart } from "@/components/ui/donut-chart";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { Eye } from "lucide-react";
import { useState } from "react";

interface Stats {
  projects: number;
  tasks: number;
  content: number;
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

async function fetchDueTasks(token: string, viewMyTasksOnly: boolean = false, userEmail: string = ''): Promise<DueTasksResponse> {
  if (!token) return { data: [], totalCount: 0 };

  const url = new URL('/api/tasks/due-soon', window.location.origin);
  
  if (viewMyTasksOnly && userEmail) {
    url.searchParams.append('viewMyTasksOnly', 'true');
    url.searchParams.append('userEmail', userEmail);
  }

  const response = await fetch(url.toString(), {
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

async function fetchOverdueTasks(token: string, viewMyTasksOnly: boolean = false, userEmail: string = ''): Promise<DueTasksResponse> {
  if (!token) return { data: [], totalCount: 0 };

  const url = new URL('/api/tasks/overdue', window.location.origin);
  
  if (viewMyTasksOnly && userEmail) {
    url.searchParams.append('viewMyTasksOnly', 'true');
    url.searchParams.append('userEmail', userEmail);
  }

  const response = await fetch(url.toString(), {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch overdue tasks');
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

async function fetchOpenTasks(token: string, viewMyTasksOnly: boolean = false, userEmail: string = ''): Promise<DueTasksResponse> {
  if (!token) return { data: [], totalCount: 0 };

  const url = new URL('/api/tasks/open', window.location.origin);
  
  if (viewMyTasksOnly && userEmail) {
    url.searchParams.append('viewMyTasksOnly', 'true');
    url.searchParams.append('userEmail', userEmail);
  }

  const response = await fetch(url.toString(), {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch open tasks');
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

async function fetchDueToday(token: string, viewMyTasksOnly: boolean = false, userEmail: string = ''): Promise<DueTasksResponse> {
  if (!token) return { data: [], totalCount: 0 };

  const url = new URL('/api/tasks/due-today', window.location.origin);
  
  if (viewMyTasksOnly && userEmail) {
    url.searchParams.append('viewMyTasksOnly', 'true');
    url.searchParams.append('userEmail', userEmail);
  }

  const response = await fetch(url.toString(), {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch tasks due today');
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
  const [viewMyTasksOnly, setViewMyTasksOnly] = useState(false);
  
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      return;
    }
  });

  const userEmail = session?.user?.email || '';

  const { data: stats, isLoading: statsLoading, error: statsError } = useQuery<Stats, Error>({
    queryKey: ['dashboard-stats', session?.accessToken],
    queryFn: () => fetchStats(session?.accessToken || ''),
    enabled: !!session?.accessToken,
    staleTime: Infinity,
    gcTime: 1000 * 60 * 30, // 30 minutes
  });

  const { data: dueTasks, isLoading: dueTasksLoading, error: dueTasksError } = useQuery<DueTasksResponse, Error>({
    queryKey: ['due-tasks', session?.accessToken, viewMyTasksOnly, userEmail],
    queryFn: () => fetchDueTasks(session?.accessToken || '', viewMyTasksOnly, userEmail),
    enabled: !!session?.accessToken,
    staleTime: Infinity,
    gcTime: 1000 * 60 * 30, // 30 minutes
  });

  const { data: overdueTasks, isLoading: overdueTasksLoading, error: overdueTasksError } = useQuery<DueTasksResponse, Error>({
    queryKey: ['overdue-tasks', session?.accessToken, viewMyTasksOnly, userEmail],
    queryFn: () => fetchOverdueTasks(session?.accessToken || '', viewMyTasksOnly, userEmail),
    enabled: !!session?.accessToken,
    staleTime: Infinity,
    gcTime: 1000 * 60 * 30, // 30 minutes
  });

  const { data: openTasks, isLoading: openTasksLoading, error: openTasksError } = useQuery<DueTasksResponse, Error>({
    queryKey: ['open-tasks', session?.accessToken, viewMyTasksOnly, userEmail],
    queryFn: () => fetchOpenTasks(session?.accessToken || '', viewMyTasksOnly, userEmail),
    enabled: !!session?.accessToken,
    staleTime: Infinity,
    gcTime: 1000 * 60 * 30, // 30 minutes
  });

  const { data: dueTodayTasks, isLoading: dueTodayLoading, error: dueTodayError } = useQuery<DueTasksResponse, Error>({
    queryKey: ['due-today-tasks', session?.accessToken, viewMyTasksOnly, userEmail],
    queryFn: () => fetchDueToday(session?.accessToken || '', viewMyTasksOnly, userEmail),
    enabled: !!session?.accessToken,
    staleTime: Infinity,
    gcTime: 1000 * 60 * 30, // 30 minutes
  });

  const toggleTaskView = () => {
    setViewMyTasksOnly(!viewMyTasksOnly);
  };

  return (
    <SessionCheck>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="flex flex-1 flex-grow">
          <Sidebar />
          <main className="flex-1 p-8 min-h-[calc(100vh-4rem)] bg-gray-50">
            <div className="max-w-7xl mx-auto space-y-8">
              <div className="flex items-center">
                <h1 className="text-3xl font-bold mr-3">Dashboard</h1>
                <button 
                  onClick={toggleTaskView} 
                  className="group relative flex items-center justify-center focus:outline-none transition-colors cursor-pointer"
                >
                  <Eye 
                    className={`h-6 w-6 transition-colors duration-200 ${
                      viewMyTasksOnly 
                        ? "text-yellow-500 hover:text-yellow-600" 
                        : "text-gray-400 hover:text-gray-600"
                    }`} 
                  />
                  <span className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                    {viewMyTasksOnly ? "View all tasks" : "View your tasks"}
                  </span>
                </button>
              </div>
              
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
                {/* Overdue Tasks Donut Chart - Top Left */}
                {overdueTasksLoading ? (
                  <div className="h-[400px] bg-gray-200 animate-pulse rounded-lg" />
                ) : overdueTasksError ? (
                  <div className="text-red-500">
                    Error: {overdueTasksError instanceof Error ? overdueTasksError.message : 'Failed to load overdue tasks'}
                  </div>
                ) : (
                  <DonutChart
                    title={`Overdue Tasks ${viewMyTasksOnly ? '(Your Tasks)' : ''}`}
                    data={overdueTasks?.data || []}
                    totalCount={overdueTasks?.totalCount || 0}
                    endpoint={`/api/tasks/overdue${viewMyTasksOnly ? `?viewMyTasksOnly=true&userEmail=${encodeURIComponent(userEmail)}` : ''}`}
                    deadlineColumnLabel="Overdue Since"
                  />
                )}

                {/* Tasks Due Today Donut Chart - Top Right */}
                {dueTodayLoading ? (
                  <div className="h-[400px] bg-gray-200 animate-pulse rounded-lg" />
                ) : dueTodayError ? (
                  <div className="text-red-500">
                    Error: {dueTodayError instanceof Error ? dueTodayError.message : 'Failed to load tasks due today'}
        </div>
                ) : (
                  <DonutChart
                    title={`Tasks Due Today ${viewMyTasksOnly ? '(Your Tasks)' : ''}`}
                    data={dueTodayTasks?.data || []}
                    totalCount={dueTodayTasks?.totalCount || 0}
                    endpoint={`/api/tasks/due-today${viewMyTasksOnly ? `?viewMyTasksOnly=true&userEmail=${encodeURIComponent(userEmail)}` : ''}`}
                    deadlineColumnLabel="Due Today"
                  />
                )}

                {/* Due Tasks Donut Chart - Bottom Left */}
                {dueTasksLoading ? (
                  <div className="h-[400px] bg-gray-200 animate-pulse rounded-lg" />
                ) : dueTasksError ? (
                  <div className="text-red-500">
                    Error: {dueTasksError instanceof Error ? dueTasksError.message : 'Failed to load due tasks'}
                  </div>
                ) : (
                  <DonutChart
                    title={`Tasks Due in 7 Days ${viewMyTasksOnly ? '(Your Tasks)' : ''}`}
                    data={dueTasks?.data || []}
                    totalCount={dueTasks?.totalCount || 0}
                    endpoint={`/api/tasks/due-soon${viewMyTasksOnly ? `?viewMyTasksOnly=true&userEmail=${encodeURIComponent(userEmail)}` : ''}`}
                    deadlineColumnLabel="Deadline"
                  />
                )}

                {/* All Open Tasks Donut Chart - Bottom Right */}
                {openTasksLoading ? (
                  <div className="h-[400px] bg-gray-200 animate-pulse rounded-lg" />
                ) : openTasksError ? (
                  <div className="text-red-500">
                    Error: {openTasksError instanceof Error ? openTasksError.message : 'Failed to load open tasks'}
                  </div>
                ) : (
                  <DonutChart
                    title={`All Open Tasks ${viewMyTasksOnly ? '(Your Tasks)' : ''}`}
                    data={openTasks?.data || []}
                    totalCount={openTasks?.totalCount || 0}
                    endpoint={`/api/tasks/open${viewMyTasksOnly ? `?viewMyTasksOnly=true&userEmail=${encodeURIComponent(userEmail)}` : ''}`}
                    deadlineColumnLabel="Deadline"
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
