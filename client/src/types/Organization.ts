type UserRole = "admin" | "member" | "viewer";
export type Organization = {
  id: number;
  slug: string;
  name: string;
  description: string;
  logo_url: string | null;
  role: UserRole;
  created_at: string;
  joined_at: string;
};
