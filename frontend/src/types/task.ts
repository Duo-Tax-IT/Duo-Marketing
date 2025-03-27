export interface TaskDetail {
  Id: string;
  Name: string;
  Type__c: string;
  Delegate__r?: { Name: string } | null;
  Assigned_By__r?: { Name: string } | null;
  Deadline__c: string;
  attributes?: any;
  [key: string]: any; // Allow any other fields
} 