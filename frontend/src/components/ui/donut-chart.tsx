import { Card, CardContent } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

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

interface TaskDetail {
  Id: string;
  Name: string;
  Type__c: string;
  Delegate__r?: { Name: string } | null;
  Assigned_By__r?: { Name: string } | null;
  Deadline__c: string;
  attributes?: any;
  [key: string]: any; // Allow any other fields
}

const CustomLegend = ({ payload = [] }: LegendProps) => {
  return (
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
  );
};

export function DonutChart({ title, data, totalCount }: DonutChartProps) {
  const [showDetailView, setShowDetailView] = useState(false);
  const [taskDetails, setTaskDetails] = useState<TaskDetail[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();

  const toggleView = () => {
    if (!showDetailView && taskDetails.length === 0) {
      fetchTaskDetails();
    }
    setShowDetailView(!showDetailView);
  };

  const fetchTaskDetails = async () => {
    if (!session?.accessToken) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/tasks/due-soon', {
        headers: {
          'Authorization': `Bearer ${session.accessToken}`
        }
      });
      
      if (!response.ok) {
        console.error('API response not OK:', {
          status: response.status,
          statusText: response.statusText
        });
        try {
          const errorData = await response.text();
          console.error('Error response body:', errorData);
        } catch (err) {
          console.error('Failed to read error response');
        }
        throw new Error(`Failed to fetch task details: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Task details response:', data);
      if (data.records && data.records.length > 0) {
        console.log('First task example:', data.records[0]);
        console.log('Delegate info exists:', !!data.records[0].Delegate__r);
        console.log('Assigned By info exists:', !!data.records[0].Assigned_By__r);
      } else {
        console.log('No task records found in response');
      }
      
      setTaskDetails(data.records || []);
    } catch (error) {
      console.error('Error fetching task details:', error);
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
              className="h-8 w-8 rounded-full hover:bg-gray-100"
            >
              <RotateCcw className="h-4 w-4" />
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
                    cx="50%"
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
                  <Tooltip 
                    formatter={(value: number) => [`${value} items`, 'Count']}
                  />
                  <Legend 
                    content={<CustomLegend />}
                    layout="vertical"
                    align="right"
                    verticalAlign="middle"
                    wrapperStyle={{
                      right: 0,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: 'auto',
                      padding: 0
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              
              <div className="absolute left-[38%] top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <span className="text-4xl font-bold">{totalCount}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Back side */}
        <Card className="absolute w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <div className="absolute top-4 right-4 z-10">
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                toggleView();
              }}
              className="h-8 w-8 rounded-full hover:bg-gray-100"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="p-4 h-full overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">{title}</h3>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center items-center h-48">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : taskDetails.length === 0 ? (
              <div className="text-center py-10 text-gray-500">No tasks due soon</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="text-left p-2">Type</th>
                      <th className="text-left p-2">Name</th>
                      <th className="text-left p-2">Assigned By</th>
                      <th className="text-left p-2">Delegate</th>
                      <th className="text-left p-2">Deadline</th>
                    </tr>
                  </thead>
                  <tbody>
                    {taskDetails.map((task) => {
                      // Debug - log the task object structure
                      console.log('Task object:', JSON.stringify(task, null, 2));
                      
                      return (
                        <tr key={task.Id} className="border-b hover:bg-gray-50">
                          <td className="p-2">{task.Type__c || 'N/A'}</td>
                          <td className="p-2">{task.Name}</td>
                          <td className="p-2">{task.Assigned_By__r?.Name || 'N/A'}</td>
                          <td className="p-2">{task.Delegate__r?.Name || 'N/A'}</td>
                          <td className="p-2">{formatDate(task.Deadline__c)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
} 