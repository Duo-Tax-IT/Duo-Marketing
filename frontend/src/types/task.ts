export interface TaskDetail {
  // Basic Info
  Id: string;
  Name: string;
  Type__c: string;
  Description__c?: string;
  Priority__c?: string;
  
  // Relations
  Delegate__r?: { Name: string } | null;
  Assigned_By__r?: { Name: string } | null;
  Project__c?: string;
  
  // Dates
  Deadline__c: string;
  Completed_Date__c?: string | null;
  
  // Notes
  Log_Note_Long__c?: string;
  Log__c?: string;
  
  // Salesforce metadata
  attributes?: {
    type: string;
    url: string;
  };
  
  // Additional Salesforce fields we might receive but don't currently use
  [key: string]: string | number | boolean | null | undefined | { Name: string } | { type: string; url: string };
} 