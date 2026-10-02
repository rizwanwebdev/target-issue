import { Link } from "react-router-dom";
import { useToast } from "@/hooks/useToast";
import { useEffect, useState } from "react";
import CreateOrgModal from "@/components/modals/CreateOrgModal";

import type { Organization } from "@/types/Organization";
import ActionMenu from "@/components/utils/ActionMenu";
import apiRequest from "@/api/apiRequest";

const DashOrganization = () => {
  const [fetchAgain, setFetchAgain] = useState(false);
  const { addToast } = useToast();
  const [orgs, setOrgs] = useState<Organization[]>([]);
  useEffect(() => {
    async function getAll() {
      const result = await apiRequest({
        method: "GET",
        endpoint: "/org/all-organizations",
      });
      if (result.error) {
        addToast(result.message, "error");
        return;
      }

      setOrgs(result.organizations);
      return;
    }

    getAll();
  }, [fetchAgain, addToast]);

  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);
  const handleDelete = async (deleteId: number) => {
    try {
      const result = await apiRequest({
        method: "DELETE",
        endpoint: "/org/delete",
        body: {
          organizationId: deleteId,
        },
      });
      if (result.error) {
        addToast(result.message, "error");
        return;
      }
      addToast(result.message, "success");
      setFetchAgain((prev) => !prev);
    } catch (error) {
      addToast(
        error instanceof Error ? error.message : "Failed to load comments",
        "error",
      );
    }
  };
  return (
    <>
      <title>Organizations | Create & Manage</title>
      <section className="mb-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold text-text">
              Your Organizations
            </h1>
            <p className="text-sm text-gray-500">
              Manage the organizations you belong to.
            </p>
          </div>

          <CreateOrgModal setFetchAgain={setFetchAgain} />
        </div>
      </section>
      {orgs.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
          <p className="font-medium text-text">Organizations Not Found</p>

          <p className="mt-1 text-sm text-gray-500">
            There are no Organizations to display.
          </p>
        </div>
      ) : (
        <section>
          <div className="flex w-full min-w-0 flex-col gap-3">
            {orgs.map((org) => (
              <div
                key={org.slug}
                className="group flex w-full items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all duration-200 hover:border-primary/30 hover:shadow-md"
              >
                <div className="flex min-w-0 flex-1 justify-between gap-2 items-center ">
                  {/* Organization info */}
                  <div className="flex min-w-0 items-center gap-4">
                    {/* Logo */}
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-primary/10 text-lg font-semibold text-primary">
                      {org.logo_url ? (
                        <img
                          src={org.logo_url}
                          alt={`${org.name} logo`}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        org.name.charAt(0).toUpperCase()
                      )}
                    </div>

                    {/* Name + description */}
                    <div className="min-w-0 flex-1">
                      <Link
                        to={`/dashboard/organizations/${org.slug}`}
                        className="block truncate text-base font-semibold text-text transition-colors hover:text-hover"
                      >
                        {org.name}
                      </Link>

                      <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                        {org.description || "No description provided."}
                      </p>
                    </div>
                  </div>

                  {/* Role */}
                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                      org.role === "admin"
                        ? "bg-accent/10 text-accent"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {org.role}
                  </span>
                </div>
                <ActionMenu
                  isOpen={activeMenuId === org.id}
                  onToggle={() =>
                    setActiveMenuId((prev) => (prev === org.id ? null : org.id))
                  }
                  onDelete={() => handleDelete(org.id)}
                />
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
};

export default DashOrganization;
