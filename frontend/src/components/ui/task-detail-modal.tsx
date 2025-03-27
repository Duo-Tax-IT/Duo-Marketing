import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TaskDetail } from "@/types/task";
import { format } from "date-fns";

interface TaskDetailModalProps {
  task: TaskDetail | null;
  isOpen: boolean;
  onClose: () => void;
}

export function TaskDetailModal({ task, isOpen, onClose }: TaskDetailModalProps) {
  if (!task) return null;

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'N/A';
    return format(new Date(dateString), 'PPP');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">{task.Name}</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          {/* Basic Info Section */}
          <div>
            <h3 className="font-medium text-sm text-gray-500 mb-2">Basic Information</h3>
            <div className="grid gap-3">
              <div>
                <span className="text-sm font-medium text-gray-500">Type</span>
                <p className="mt-1">{task.Type__c || 'N/A'}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Priority</span>
                <p className="mt-1">{task.Priority__c || 'N/A'}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Description</span>
                <p className="mt-1 whitespace-pre-wrap">{task.Description__c || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Assignment Section */}
          <div>
            <h3 className="font-medium text-sm text-gray-500 mb-2">Assignment Details</h3>
            <div className="grid gap-3">
              <div>
                <span className="text-sm font-medium text-gray-500">Assigned By</span>
                <p className="mt-1">{task.Assigned_By__r?.Name || 'N/A'}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Delegate</span>
                <p className="mt-1">{task.Delegate__r?.Name || 'N/A'}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Project</span>
                <p className="mt-1">{task.Project__c || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Dates Section */}
          <div>
            <h3 className="font-medium text-sm text-gray-500 mb-2">Dates</h3>
            <div className="grid gap-3">
              <div>
                <span className="text-sm font-medium text-gray-500">Deadline</span>
                <p className="mt-1">{formatDate(task.Deadline__c)}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Completed Date</span>
                <p className="mt-1">{formatDate(task.Completed_Date__c)}</p>
              </div>
            </div>
          </div>

          {/* Notes Section */}
          <div>
            <h3 className="font-medium text-sm text-gray-500 mb-2">Notes</h3>
            <div className="grid gap-3">
              <div>
                <span className="text-sm font-medium text-gray-500">Log Note</span>
                <p className="mt-1 whitespace-pre-wrap">{task.Log_Note_Long__c || 'N/A'}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Log</span>
                <p className="mt-1 whitespace-pre-wrap">{task.Log__c || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 