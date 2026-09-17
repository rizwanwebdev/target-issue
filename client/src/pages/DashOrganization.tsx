import { Link } from "react-router-dom";
import createOrg from "../api/org/createOrg.ts";
import getAllOrganizations, {
  type Organization,
} from "../api/org/getAllOrganizations.ts";
import { useToast } from "../context/ToastProvider.tsx";
import { useEffect, useState } from "react";
const DashOrganization = () => {
  const { addToast } = useToast();
  const [orgs, setOrgs] = useState<Organization[]>([]);
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
      form.reset();
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
        return;
      }

      setOrgs(result.organizations);
      return;
    }

    getAll();
  }, [addToast]);

  return (
    <>
      <title>Organizations | Create & Manage</title>
      <meta name="description" content="Create and Manage Organizations" />

      <main className="bg-gray-50 p-4 md:px-8">
        <div className="min-h-screen flex flex-col items-center gap-4">
          <div className="max-w-md w-full">
            <form
              onSubmit={handleSubmit}
              className="flex flex-col *:border *:p-2 gap-3"
            >
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

              <button type="submit" className="cursor-pointer">
                Create ORG
              </button>
            </form>
          </div>
          <div className="flex flex-col items-center w-full gap-4">
            {orgs.map((org) => (
              <div
                key={org.slug}
                className="w-full flex flex-col flex-wrap justify-between border border-gray-400 p-2 rounded-lg"
              >
                <div className="flex flex-row flex-wrap justify-between ">
                  <Link
                    className="text-indigo-600"
                    to={`/dashboard/organizations/${org.slug}`}
                  >
                    {org.name}
                  </Link>
                  <span>{org.logo_url}</span>
                  <span className="text-green-600">{org.role}</span>
                </div>
                <span className="text-wrap">{org.description}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
};

export default DashOrganization;
