export type Member = {
  id: number;
  avatar_url: string | null;
  created_at: string;
  email: string;
  email_verified: boolean;
  full_name: string;
  joined_at: string;
  organization_id: number;
  role: string;
  status: string;
};

async function getSingleMember(memberId: number, slug: string) {
  if (!memberId || !slug) {
    return {
      error: true,
      message: "Team id and Slug is required to find a member",
    };
  }
  try {
    const result = await fetch("/api/v1/org/member", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        slug: slug,
        memberId: memberId,
      }),
    });
    return await result.json();
  } catch (error) {
    return {
      error: true,
      message: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}
export default getSingleMember;
