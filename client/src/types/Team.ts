type UserRole = "admin" | "member" | "viewer";
export type Team = {
  team_id: number;
  slug: string;
  name: string;
  description: string;
  color: string;
  role: UserRole;
  member_count?: number;
};
