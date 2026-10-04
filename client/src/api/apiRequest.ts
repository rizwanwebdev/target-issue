import apiFetch from "@/api/auth/client.ts";

type Body = Record<string, unknown>;

type ApiRequest = {
  endpoint: string;
  method: "GET" | "POST" | "DELETE" | "PUT";
  body?: Body;
};

async function apiRequest({ endpoint, method, body }: ApiRequest) {
  try {
    let url = `/api/v1${endpoint}`;

    // GET → query parameters
    if ((method === "GET" || method === "DELETE") && body) {
      const params = new URLSearchParams();

      Object.entries(body).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });

      const queryString = params.toString();

      if (queryString) {
        url += `?${queryString}`;
      }
    }

    const options: RequestInit = {
      method,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    };

    if (method !== "GET" && method !== "DELETE" && body) {
      options.body = JSON.stringify(body);
    }
    const res = await apiFetch(url, options);
    if (!res.ok && res.status === 502) {
      return {
        error: true,
        message: res.statusText + " Disconnected",
      };
    }
    return await res.json();
  } catch (error) {
    return {
      error: true,
      message: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}

export default apiRequest;
