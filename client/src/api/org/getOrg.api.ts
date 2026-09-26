import apiFetch from "@/api/auth/client.ts";

export type OrganizationRole = "admin" | "member" | "viewer";

import type { Organization } from "@/types/Organization";

export interface GetOrgResponse {
  success?: boolean;
  error?: boolean;
  message: string;
  organization?: Organization;
  status?: number;
}

async function getOrg(slug: string): Promise<GetOrgResponse> {
  try {
    const res = await apiFetch("/api/v1/org/get-org", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        slug,
      }),
    });

    const data = await res.json();

    return {
      ...data,
      status: res.status,
    };
  } catch (error) {
    return {
      error: true,
      message: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}

export default getOrg;
