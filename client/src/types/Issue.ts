export type Issue = {
  id: number;
  project_id: number;
  organization_id: number;
  project_name: string;
  issue_number: string;
  title: string;
  description: string;
  due_date: string;
  status: string;
  priority: string;
  severity: string;
  closed_at: string;
  resolved_at: string;
  updated_at: string;
  created_at: string;
  created_by: number;
};
