async function getSingleMember(memberId: string, organizationId: number) {
  if (!memberId || !organizationId) {
    return {
      error: true,
      message: "Team id and organizationId is required to find a member",
    };
  }
  try {
    const result = await fetch("/api/v1/org/member", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        organizationId: organizationId,
        username: memberId,
      }),
    });
    return await result.json();
  } catch (error) {
    return {
      error: true,
      message: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}
export default getSingleMember;
