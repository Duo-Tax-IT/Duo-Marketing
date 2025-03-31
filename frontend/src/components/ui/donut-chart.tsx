import { Card, CardContent } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TaskDetailModal } from "@/components/ui/task-detail-modal";
import { TaskDetail } from "@/types/task";

// Fixed position for the center of the donut chart
const CHART_CENTER_X = 140;

// Tailwind-like color palette
const COLORS = [
  '#4F46E5', // indigo
  '#60A5FA', // blue
  '#8B5CF6', // purple
  '#EC4899', // pink
  '#10B981', // emerald
  '#34D399', // green
  '#F59E0B', // amber
  '#EF4444'  // red
];

interface ChartData {
  name: string;
  value: number;
}

interface DonutChartProps {
  title: string;
  data: ChartData[];
  totalCount: number;
  endpoint?: string; // Optional API endpoint to use for fetching task details
  deadlineColumnLabel?: string; // Optional label for the deadline column
}

interface LegendProps {
  payload?: {
    value: string;
    color: string;
    payload: {
      value: number;
    };
  }[];
}

const CustomLegend = ({ payload = [] }: LegendProps) => {
  // Calculate max height based on number of items
  const needsScroll = payload.length > 11;
  
  return (
    <div className={`${needsScroll ? 'max-h-[220px] overflow-y-auto pr-2 custom-scrollbar' : ''}`}>
      <ul className="list-none m-0 p-0">
        {payload.map((entry, index) => (
          <li key={`item-${index}`} className="text-sm flex items-center mb-1">
            <span 
              className="inline-block w-3 h-3 mr-2 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-black">
              {entry.value} ({entry.payload.value})
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export function DonutChart({ 
  title, 
  data, 
  totalCount, 
  endpoint = '/api/tasks/due-soon',
  deadlineColumnLabel = 'Deadline'
}: DonutChartProps) {
  const [showDetailView, setShowDetailView] = useState(false);
  const [taskDetails, setTaskDetails] = useState<TaskDetail[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskDetail | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    if (showDetailView) {
      fetchTaskDetails();
    }
  }, [endpoint, showDetailView]);

  // Create a mapping of task types to colors
  const getTypeColor = (type: string) => {
    // Find the index of this type in our data array
    const typeIndex = data.findIndex(item => item.name === type);
    // If found, use that color, otherwise fallback to the first color
    return typeIndex >= 0 ? COLORS[typeIndex % COLORS.length] : COLORS[0];
  };

  const getTypeStyles = (type: string) => {
    const baseColor = getTypeColor(type);
    return {
      badge: `bg-${baseColor}/10`,
      text: baseColor,
      ring: `${baseColor}/20`
    };
  };

  const toggleView = () => {
    setShowDetailView(!showDetailView);
    if (!showDetailView) {
      fetchTaskDetails();
    }
  };

  const fetchTaskDetails = async () => {
    if (!session?.accessToken) return;
    
    setIsLoading(true);
    try {
      // Preserve the entire endpoint URL including any query parameters
      console.log(`Fetching task details from: ${endpoint}`);
      const response = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${session.accessToken}`
        }
      });
      
      if (!response.ok) {
        console.error('API response not OK:', {
          status: response.status,
          statusText: response.statusText,
          endpoint
        });
        try {
          const errorData = await response.text();
          console.error('Error response body:', errorData);
        } catch {
          console.error('Failed to read error response');
        }
        throw new Error(`Failed to fetch task details: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log(`Task details response from ${endpoint}:`, data);
      if (data.records && data.records.length > 0) {
        console.log('First task example:', data.records[0]);
        console.log('Task type:', data.records[0].Type__c);
        console.log('Task deadline:', data.records[0].Deadline__c);
      } else {
        console.log('No task records found in response');
      }
      
      setTaskDetails(data.records || []);
    } catch (error) {
      console.error(`Error fetching task details from ${endpoint}:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className="relative [perspective:1000px] h-[324px]">
      <TaskDetailModal 
        task={selectedTask}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTask(null);
        }}
      />
      
      <div
        className={`w-full h-full transition-all duration-500 [transform-style:preserve-3d] ${
          showDetailView ? '[transform:rotateY(180deg)]' : ''
        }`}
      >
        {/* Front side */}
        <Card className="absolute w-full h-full [backface-visibility:hidden]">
          <div className="absolute top-4 right-4 z-10">
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                toggleView();
              }}
              className="group relative h-8 w-8 p-0 hover:bg-gray-100 cursor-pointer"
            >
              <RotateCcw className="h-4 w-4" />
              <div className="pointer-events-none absolute left-1/2 transform -translate-x-1/2 top-full mt-1 z-50">
                <span className="px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Switch to table
                </span>
              </div>
            </Button>
          </div>
          
          <div className="px-6 pt-4">
            <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
          </div>
          <CardContent className="pt-0">
            <div className="h-[280px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx={CHART_CENTER_X}
                    cy="50%"
                    innerRadius={85}
                    outerRadius={110}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {data.map((_, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]} 
                      />
                    ))}
                  </Pie>
                  <Legend 
                    content={<CustomLegend />}
                    layout="vertical"
                    align="right"
                    verticalAlign="top"
                    wrapperStyle={{
                      right: 0,
                      top: 10,
                      width: 'auto',
                      padding: 0
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              
              {/* Position count exactly at the pie's center point */}
              <div className="absolute pointer-events-none" style={{ left: CHART_CENTER_X, top: '50%', transform: 'translate(-50%, -50%)' }}>
                {totalCount > 0 ? (
                  <span className="text-4xl font-bold">{totalCount}</span>
                ) : (
                  <div className="text-center">
                    <span className="text-lg text-gray-500 whitespace-nowrap">There are no tasks</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Back side */}
        <Card className="absolute w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] overflow-hidden">
          <div className="absolute top-4 right-4 z-50">
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                toggleView();
              }}
              className="group relative h-8 w-8 p-0 hover:bg-gray-100 cursor-pointer"
            >
              <RotateCcw className="h-4 w-4" />
              <div className="pointer-events-none absolute right-0 top-full mt-1 z-50">
                <span className="px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Switch to pie graph
                </span>
              </div>
            </Button>
          </div>
          
          <div className="flex flex-col h-full overflow-hidden">
            <div className="px-4 pt-4">
              <h3 className="text-xl font-semibold">{title}</h3>
            </div>
            
            <div className="flex-1 px-4 pb-4 overflow-hidden">
              {isLoading ? (
                <div className="flex justify-center items-center h-48">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : taskDetails.length === 0 ? (
                <div className="text-center py-10 text-gray-500">No tasks found</div>
              ) : (
                <div className="overflow-auto h-full rounded-lg">
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-white">
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase tracking-wider">Type</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase tracking-wider">Name</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase tracking-wider">Assigned By</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase tracking-wider">Delegate</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase tracking-wider">{deadlineColumnLabel}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {taskDetails.map((task) => {
                        const typeStyles = getTypeStyles(task.Type__c);
                        
                        return (
                          <tr 
                            key={task.Id} 
                            onClick={() => {
                              setSelectedTask(task);
                              setIsModalOpen(true);
                            }}
                            className="hover:bg-gray-100 cursor-pointer transition-colors"
                          >
                            <td className="py-3 px-4">
                              <span 
                                className="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset"
                                style={{
                                  backgroundColor: `${typeStyles.badge}`,
                                  color: typeStyles.text,
                                  borderColor: typeStyles.ring
                                }}
                              >
                                {task.Type__c || 'N/A'}
                              </span>
                            </td>
                            <td className="py-3 px-4 font-medium text-gray-900">{task.Name}</td>
                            <td className="py-3 px-4 text-gray-600">{task.Assigned_By__r?.Name || 'N/A'}</td>
                            <td className="py-3 px-4 text-gray-600">{task.Delegate__r?.Name || 'N/A'}</td>
                            <td className="py-3 px-4">
                              <span className="text-gray-900 font-medium">
                                {formatDate(task.Deadline__c)}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
} 