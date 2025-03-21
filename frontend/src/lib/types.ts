export interface Project {
  Id: string;
  Name: string;
}

export interface SalesforceResponse<T> {
  totalSize: number;
  done: boolean;
  records: T[];
} 