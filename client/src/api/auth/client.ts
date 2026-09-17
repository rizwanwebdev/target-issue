let refreshPromise: Promise<boolean> | null = null;

async function refreshAccessToken(): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = fetch("/api/v1/auth/refresh", {
      method: "GET",
      credentials: "include",
    })
      .then(async (response) => {
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
      })
      .catch((error) => {
        console.error("[AUTH REFRESH ERROR]", error);
        return false;
      })
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

  // First attempt
  let response = await request();

  console.log("[API]", input, response.status);

  // Everything except 401 continues normally
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

  // Refresh when:
  // - access token expired
  // - access token doesn't exist
  const shouldRefresh = ["ACCESS_TOKEN_EXPIRED", "NO_ACCESS_TOKEN"].includes(
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
    return response;
  }

  console.log("[AUTH] Retrying original request...");

  return request();
}

export default apiFetch;
