async function getAllOrganizations() {
  try {
    const res = await fetch("/api/v1/org/all-organizations", {
      credentials: "include",
    });
    return await res.json();
  } catch (error) {
    return {
      error: true,
      message: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}
export default getAllOrganizations;
