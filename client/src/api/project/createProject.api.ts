async function createProject(
  slug: string,
  name: string,
  description: string,
  startDate: string,
  targetDate: string,
) {
  try {
    if (!slug || !name || !description || !startDate || !targetDate) {
      return {
        error: true,
        message:
          "All fileds are required i.e slug, name, description, startDate, targetDate",
      };
    }
    const result = await fetch("/api/v1/project/create-project", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        slug: slug,
        name: name,
        description: description,
        startDate: startDate,
        targetDate: targetDate,
      }),
    });
    return await result.json();
  } catch (error: any) {
    return {
      error: true,
      message: error.message,
    };
  }
}
export default createProject;
