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

async function apiFetch(input: RequestInfo | URL, options: RequestInit = {}) {
  const request = () =>
    fetch(input, {
      ...options,
      credentials: "include",
    });

  let response = await request();

  if (response.status !== 401) {
    return response;
  }

  // Read the backend error
  const data = await response
    .clone()
    .json()
    .catch(() => null);

  if (data?.code !== "ACCESS_TOKEN_EXPIRED") {
    return response;
  }

  const refreshed = await refreshAccessToken();

  if (!refreshed) {
    return response;
  }

  return request();
}

export default apiFetch;
