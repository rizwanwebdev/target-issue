let refreshPromise: Promise<boolean> | null = null;

async function refreshAccessToken(): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = fetch("/api/v1/auth/refresh", {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.ok)
      .catch(() => false)
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

async function apiFetch(
  input: RequestInfo | URL,
  options: RequestInit = {},
): Promise<Response> {
  const request = () =>
    fetch(input, {
      ...options,
      credentials: "include",
    });

  let response = await request();

  // Request succeeded or failed for a reason other than authentication.
  if (response.status !== 401) {
    return response;
  }

  // Access token may have expired.
  const refreshed = await refreshAccessToken();

  if (!refreshed) {
    return response;
  }

  // New access-token cookie was created.
  // Retry the original request.
  response = await request();

  return response;
}

export default apiFetch;
