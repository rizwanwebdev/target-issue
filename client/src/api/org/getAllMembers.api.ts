import apiFetch from "@/api/auth/client.ts";

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
  organizationId: number,
  page: number,
  limit: number,
  projectId: number | undefined,
): Promise<GetMembersResponse> {
  try {
    console.log(organizationId);
    const res = await apiFetch("/api/v1/org/all-members", {
      credentials: "include",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        organizationId: organizationId,
        page: page,
        limit: limit,
        projectId: projectId,
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
