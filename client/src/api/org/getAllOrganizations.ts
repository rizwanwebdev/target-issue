import apiFetch from "@/api/auth/client.ts";

export type Organization = {
  id: number;
  name: string;
  description: string;
  logo_url: string | null;
  role: string;
  slug: string;
  created_at: string;
  joined_at: string;
};

type GetOrganizationsSuccess = {
  error: false;
  success: true;
  message: string;
  organizations: Organization[];
};

type GetOrganizationsError = {
  error: true;
  success: false;
  message: string;
};

export type GetOrganizationsResponse =
  | GetOrganizationsSuccess
  | GetOrganizationsError;

async function getAllOrganizations(): Promise<GetOrganizationsResponse> {
  try {
    const res = await apiFetch("/api/v1/org/all-organizations", {
      credentials: "include",
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

export default getAllOrganizations;
