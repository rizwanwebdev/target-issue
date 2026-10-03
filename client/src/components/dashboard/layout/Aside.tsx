import { Link, NavLink, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/useToast";
import useAuth from "@/hooks/useAuth";

type Props = {
  slug: string | undefined;
  projectSlug: string | undefined;
};

type AsideLink = {
  linkName: string;
  to: string;
};

const AsideNavLink = ({ linkName, to }: AsideLink) => {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        isActive ? "btn btn-accent" : "btn btn-primary"
      }
    >
      {linkName}
    </NavLink>
  );
};

export const Aside = ({ slug, projectSlug }: Props) => {
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

  const commonLinks = [
    {
      linkName: "Insights",
      to: "/dashboard/insights",
    },
    {
      linkName: "Account",
      to: "/dashboard/account",
    },
  ];

  const dashboardLinks = [
    {
      linkName: "Dashboard",
      to: "/dashboard",
    },
    {
      linkName: "Organizations",
      to: "/dashboard/organizations",
    },
  ];

  const projectLinks = [
    {
      linkName: "Overview",
      to: `/dashboard/organizations/${slug}/projects/${projectSlug}`,
    },
    {
      linkName: "Teams",
      to: `/dashboard/organizations/${slug}/projects/${projectSlug}/teams`,
    },
    {
      linkName: "Members",
      to: `/dashboard/organizations/${slug}/projects/${projectSlug}/members`,
    },
    {
      linkName: "Issues",
      to: `/dashboard/organizations/${slug}/projects/${projectSlug}/issues`,
    },
    {
      linkName: "Projects",
      to: `/dashboard/organizations/${slug}/projects`,
    },
    {
      linkName: "Organization",
      to: `/dashboard/organizations/${slug}`,
    },
  ];
  const organizationLinks = [
    {
      linkName: "Organization",
      to: `/dashboard/organizations/${slug}`,
    },
    {
      linkName: "Projects",
      to: `/dashboard/organizations/${slug}/projects`,
    },
    {
      linkName: "Teams",
      to: `/dashboard/organizations/${slug}/teams`,
    },
    {
      linkName: "Members",
      to: `/dashboard/organizations/${slug}/members`,
    },
    {
      linkName: "Issues",
      to: `/dashboard/organizations/${slug}/issues`,
    },
    {
      linkName: "Organizations",
      to: `/dashboard/organizations`,
    },
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
        <div className="flex-1 flex gap-4 flex-col justify-between px-6 w-full *:flex *:flex-col *:gap-3">
          {!slug && (
            <div>
              {dashboardLinks.map((link) => (
                <AsideNavLink key={link.linkName} {...link} />
              ))}
            </div>
          )}
          {!projectSlug && slug && (
            <div>
              {organizationLinks.map((link) => (
                <AsideNavLink key={link.linkName} {...link} />
              ))}
            </div>
          )}
          {slug && projectSlug && (
            <div>
              {projectLinks.map((link) => (
                <AsideNavLink key={link.linkName} {...link} />
              ))}
            </div>
          )}
          <div>
            {commonLinks.map((link) => (
              <AsideNavLink key={link.linkName} {...link} />
            ))}
          </div>
        </div>
        <div className="w-full flex px-6">
          <button onClick={handleLogout} className="btn btn-dark w-full">
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};
