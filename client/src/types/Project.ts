type UserRole = "admin" | "member" | "viewer";
export type Project = {
  id: number;
  slug: string;
  name: string;
  description: string;
  organization_id: number;
  role: UserRole;
  status: string;
  start_date: string;
  target_date: string;
  created_at: string;
};
