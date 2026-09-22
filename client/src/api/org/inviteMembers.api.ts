async function inviteMemebers(slug: string, emails: string[]) {
  try {
    const res = await fetch("/api/v1/org/invite", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        slug: slug,
        emails: emails,
      }),
    });
    return await res.json();
  } catch (error) {
    return {
      error: true,
      message: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}
export default inviteMemebers;
