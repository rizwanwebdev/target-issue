import createOrg from "../api/org/createOrg.ts";
import getAllOrganizations from "../api/org/getAllOrganizations.ts";
import { useToast } from "../context/ToastProvider.tsx";
import { useEffect } from "react";
const DashOrganization = () => {
  const { addToast } = useToast();
  addToast("Welcome", "success");
  //   const [orgs, setOrgs] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    try {
      const formData = new FormData(form);
      const credentials = Object.fromEntries(formData.entries());

      const result = await createOrg({
        name: String(credentials.name),
        slug: String(credentials.slug),
        description: String(credentials.description),
      });
      if (result.error) {
        addToast(result.message, "error");
        return;
      }
      addToast(result.message, "success");
    } catch (error) {
      addToast(
        error instanceof Error ? error.message : "Something went wrong",
        "error",
      );
    }
  };

  useEffect(() => {
    async function getAll() {
      const result = await getAllOrganizations();
      if (result.error) {
        addToast(result.message, "error");
      }
      addToast(result.message, "success");
      console.log(result);
    }
    getAll();
  }, []);

  return (
    <>
      <title>Organizations | Create & Manage</title>

      <meta name="description" content="Create and Manage Organizations" />
      <main className="bg-gray-50 px-4 md:px-8">
        <div className="min-h-screen flex flex-col items-center justify-center">
          <div className="max-w-md w-full">
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                minLength={4}
                placeholder="Enter Organization Name"
                required
              />
              <input
                type="text"
                name="slug"
                minLength={6}
                placeholder="Enter Organization Slug like my-org"
                required
              />
              <textarea
                name="description"
                id="description"
                rows={6}
                maxLength={200}
              ></textarea>
              <button type="submit">Create ORG</button>
            </form>
          </div>
        </div>
      </main>
    </>
  );
};

export default DashOrganization;
