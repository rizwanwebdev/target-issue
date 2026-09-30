export type Team = {
  team_id: number;
  slug: string;
  name: string;
  description: string;
  color: string;
  role: string | null;
  member_count?: number;
};
