import { Link, NavLink, useNavigate } from "react-router-dom";
import { useToast } from "@/context/ToastProvider.tsx";
import { useAuth } from "@/context/AuthContext.tsx";

type Props = {
  slug: string | undefined;
};
export const Aside = ({ slug }: Props) => {
  const { logout } = useAuth();
  const { addToast } = useToast();

  const navigate = useNavigate();

  const handleLogout = async () => {
    const result = await logout();

    if (result.error) {
      addToast(result.message, "error");
      return;
    }

    addToast(result.message, "success");
    navigate("/", { replace: true });
  };

  const asideLinks = [
    { linkName: "Organizations", to: "/dashboard/organizations" },
    { linkName: "Insights", to: "/dashboard/insights" },
    { linkName: "Account", to: "/dashboard/account" },
  ];
  const asideOrgLinks = [
    {
      linkName: "Organization",
      to: `/dashboard/organizations/${slug}`,
    },
    { linkName: "Projects", to: `/dashboard/organizations/${slug}/projects` },
    { linkName: "Teams", to: `/dashboard/organizations/${slug}/teams` },
    { linkName: "Members", to: `/dashboard/organizations/${slug}/members` },
    { linkName: "Issues", to: `/dashboard/organizations/${slug}/issues` },
  ];
  return (
    <>
      <aside className="sticky top-0 h-screen shrink-0 flex py-6 flex-col gap-6 items-center border border-gray-300 max-lg:hidden w-fit">
        <div className="px-6">
          <Link
            to="/dashboard"
            className="flex justify-center  items-center flex-col"
          >
            <img
              src="/target-issue.png"
              className="object-cover object-center w-15"
              alt="Target Issue"
            />
            <span>Target Issue</span>
          </Link>
        </div>
        <div className="w-full h-px bg-gray-200 rounded-full"></div>
        <div className="flex-1 flex gap-4 flex-col px-6 w-full">
          {!slug &&
            asideLinks.map((l) => (
              <Link
                key={l.linkName}
                to={l.to}
                className="px-5 py-2 active:bg-black bg-indigo-500 rounded-full text-white font-medium"
              >
                {l.linkName}
              </Link>
            ))}
          {slug &&
            asideOrgLinks.map((l) => (
              <NavLink
                key={l.linkName}
                to={l.to}
                end={l.linkName === "Organization"}
                className={({ isActive }) =>
                  `px-5 py-2 w-full rounded-full transition-all duration-200 font-medium ${
                    isActive
                      ? "bg-green-700 text-white hover:bg-green-800"
                      : "bg-indigo-500 text-white hover:bg-indigo-700"
                  }`
                }
              >
                {l.linkName}
              </NavLink>
            ))}
        </div>
        <div className="w-full flex px-6">
          <button
            onClick={handleLogout}
            className="px-5 py-2.5 bg-indigo-500 transition-all duration-200 hover:bg-indigo-700 w-full text-center rounded-full text-white font-medium"
          >
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};
