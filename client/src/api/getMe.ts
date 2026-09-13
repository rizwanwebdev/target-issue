import apiFetch from "./client.ts";

apiFetch;

interface User {
  id: number;
  full_name: string;
  email: string;
}

interface GetMeSuccess {
  error: false;
  user: User;
}

interface GetMeError {
  error: true;
  message: string;
  status?: number;
}

type GetMeResult = GetMeSuccess | GetMeError;

async function getMe(): Promise<GetMeResult> {
  try {
    const response = await apiFetch("/api/v1/auth/get-me");

    const data = await response.json();

    if (!response.ok) {
      return {
        error: true,
        status: response.status,
        message: data.message || "Authentication failed",
      };
    }

    return {
      error: false,
      user: data.user,
    };
  } catch (error) {
    return {
      error: true,
      message: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}

export default getMe;
