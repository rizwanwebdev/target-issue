export type Members = {
  user_id: number;
  email: string;
  role: string;
  full_name: string;
  avatar_url: string;
  joined_at: string;
};
type Requester = {
  role: string;
  isAdmin: boolean;
};

type GetMembersSuccess = {
  error: false;
  success: true;
  message: string;
  members: Members[];
  requester: Requester;
};

type GetMembersError = {
  error: true;
  success: false;
  message: string;
};

export type GetMembersResponse = GetMembersSuccess | GetMembersError;

async function getAllMembersApi(
  slug: string,
  page: number,
  limit: number,
): Promise<GetMembersResponse> {
  try {
    const res = await fetch("/api/v1/org/all-members", {
      credentials: "include",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        slug: slug,
        page: page,
        limit: limit,
      }),
    });

    return await res.json();
  } catch (error) {
    return {
      error: true,
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}

export default getAllMembersApi;
