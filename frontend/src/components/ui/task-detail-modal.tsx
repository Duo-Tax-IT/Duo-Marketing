import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TaskDetail } from "@/types/task";
import { format } from "date-fns";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect, ChangeEvent } from "react";

interface TaskDetailModalProps {
  task: TaskDetail | null;
  isOpen: boolean;
  onClose: () => void;
}

export function TaskDetailModal({ task, isOpen, onClose }: TaskDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState<TaskDetail | null>(null);

  // Reset edit state when modal opens/closes
  useEffect(() => {
    if (isOpen && task) {
      setEditedTask(task);
    } else {
      setIsEditing(false);
      setEditedTask(null);
    }
  }, [isOpen, task]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    // TODO: Implement save functionality when backend is ready
    console.log('Saving task:', editedTask);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedTask(task); // Reset to original values
  };

  const handleFieldChange = (field: keyof TaskDetail, value: string) => {
    if (editedTask) {
      setEditedTask({ ...editedTask, [field]: value });
    }
  };

  const handleSelectChange = (field: keyof TaskDetail) => (value: string) => {
    handleFieldChange(field, value);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: keyof TaskDetail) => {
    handleFieldChange(field, e.target.value);
  };

  if (!task) return null;

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'N/A';
    return format(new Date(dateString), 'PPP');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            {task.Name}
            {!isEditing && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleEdit}
                className="h-8 w-8 ml-2"
              >
                <Pencil className="h-4 w-4" />
              </Button>
            )}
          </DialogTitle>
          {isEditing && (
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                Save Changes
              </Button>
            </div>
          )}
        </DialogHeader>

        <div className="grid grid-cols-2 gap-6 py-4">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="font-semibold">Basic Information</h3>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Type</label>
              {isEditing ? (
                <Select
                  value={editedTask?.Type__c || ''}
                  onValueChange={handleSelectChange('Type__c')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Copywriting">Copywriting</SelectItem>
                    <SelectItem value="Social Post">Social Post</SelectItem>
                    <SelectItem value="Video">Video</SelectItem>
                    <SelectItem value="SEO">SEO</SelectItem>
                    <SelectItem value="Email">Email</SelectItem>
                    <SelectItem value="Event">Event</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <p className="text-sm">{task.Type__c}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              {isEditing ? (
                <Input
                  value={editedTask?.Name || ''}
                  onChange={(e) => handleInputChange(e, 'Name')}
                />
              ) : (
                <p className="text-sm">{task.Name}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              {isEditing ? (
                <Textarea
                  value={editedTask?.Description__c || ''}
                  onChange={(e) => handleInputChange(e, 'Description__c')}
                  className="min-h-[100px]"
                />
              ) : (
                <p className="text-sm whitespace-pre-wrap">{task.Description__c}</p>
              )}
            </div>
          </div>

          {/* Assignment Details */}
          <div className="space-y-4">
            <h3 className="font-semibold">Assignment Details</h3>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Assigned By</label>
              <p className="text-sm">{task.Assigned_By__r?.Name || 'N/A'}</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Delegate</label>
              <p className="text-sm">{task.Delegate__r?.Name || 'N/A'}</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Priority</label>
              {isEditing ? (
                <Select
                  value={editedTask?.Priority__c || ''}
                  onValueChange={handleSelectChange('Priority__c')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Normal">Normal</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <p className="text-sm">{task.Priority__c}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Deadline</label>
              {isEditing ? (
                <Input
                  type="date"
                  value={editedTask?.Deadline__c?.split('T')[0] || ''}
                  onChange={(e) => handleInputChange(e, 'Deadline__c')}
                />
              ) : (
                <p className="text-sm">{new Date(task.Deadline__c).toLocaleDateString()}</p>
              )}
            </div>
          </div>

          {/* Notes Section - Full Width */}
          <div className="col-span-2 space-y-4">
            <h3 className="font-semibold">Notes</h3>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Log Note</label>
              {isEditing ? (
                <Textarea
                  value={editedTask?.Log_Note_Long__c || ''}
                  onChange={(e) => handleInputChange(e, 'Log_Note_Long__c')}
                  className="min-h-[100px]"
                />
              ) : (
                <p className="text-sm whitespace-pre-wrap">{task.Log_Note_Long__c}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Log</label>
              <p className="text-sm whitespace-pre-wrap">{task.Log__c}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 