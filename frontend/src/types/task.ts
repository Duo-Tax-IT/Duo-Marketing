interface SalesforceAttributes {
  type: string;
  url: string;
}

export interface TaskDetail {
  Id: string;
  Name: string;
  Type__c: string;
  Delegate__r?: { Name: string } | null;
  Assigned_By__r?: { Name: string } | null;
  Deadline__c: string;
  attributes: SalesforceAttributes;
  // Additional Salesforce fields can be accessed via string index
  [key: string]: string | number | boolean | null | undefined | SalesforceAttributes | { Name: string } | null;
} 