export interface TaskDetail {
  Id: string;
  Name: string;
  Type__c: string;
  Delegate__r?: { Name: string } | null;
  Assigned_By__r?: { Name: string } | null;
  Deadline__c: string;
  attributes?: {
    type: string;
    url: string;
  };
  // Additional Salesforce fields we might receive but don't currently use
  [key: string]: string | number | boolean | null | undefined | { Name: string } | { type: string; url: string };
} 