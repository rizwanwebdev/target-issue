type Field = {
  name: string;
  slug: string;
  description: string;
};
async function createOrg(fields: Field) {
  try {
    const res = await fetch("/api/v1/org/create-org", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(fields),
    });
    return await res.json();
  } catch (error) {
    return {
      error: true,
      message: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}
export default createOrg;
