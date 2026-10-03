type UserRole = "admin" | "member" | "viewer";
export type Member = {
  user_id: number;
  role: UserRole;
  full_name: string;
  username: string;
  avatar_url: string;
  joined_at: string;
};
