let refreshPromise: Promise<boolean> | null = null;

async function refreshAccessToken(): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      try {
        const response = await fetch("/api/v1/auth/refresh", {
          method: "GET",
          credentials: "include",
        });

        const data = await response
          .clone()
          .json()
          .catch(() => null);

        console.log("[AUTH REFRESH]", {
          status: response.status,
          ok: response.ok,
          data,
        });

        return response.ok;
      } catch (error) {
        console.error("[AUTH REFRESH ERROR]", error);
        return false;
      } finally {
        refreshPromise = null;
      }
    })();
  }

  return refreshPromise;
}

async function apiFetch(input: RequestInfo | URL, options: RequestInit = {}) {
  const request = () =>
    fetch(input, {
      ...options,
      credentials: "include",
    });

  // First request
  const response = await request();

  console.log("[API]", input, response.status);

  // Not unauthorized
  if (response.status !== 401) {
    return response;
  }

  const data = await response
    .clone()
    .json()
    .catch(() => null);

  console.log("[AUTH 401]", {
    endpoint: input,
    status: response.status,
    data,
  });

  const shouldRefresh = ["TOKEN_EXPIRED", "NO_ACCESS_TOKEN"].includes(
    data?.code,
  );

  if (!shouldRefresh) {
    console.log("[AUTH] 401 is not refreshable");
    return response;
  }

  console.log("[AUTH] Access token missing/expired → refreshing...");

  const refreshed = await refreshAccessToken();

  console.log("[AUTH] Refresh result:", refreshed);

  if (!refreshed) {
    console.log("[AUTH] Refresh failed");
    return response;
  }

  console.log("[AUTH] Refresh succeeded → retrying original request");

  // Retry with the newly issued access-token cookie
  return request();
}

export default apiFetch;
