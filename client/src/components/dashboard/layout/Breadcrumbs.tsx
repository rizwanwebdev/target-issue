import { Link, useLocation } from "react-router-dom";

const LABELS: Record<string, string> = {
  dashboard: "Dashboard",
  organizations: "Organizations",
  projects: "Projects",
  teams: "Teams",
  members: "Members",
  issues: "Issues",
  insights: "Insights",
  account: "Account",
};

const Breadcrumbs = () => {
  const location = useLocation();

  const segments = location.pathname.split("/").filter(Boolean);

  let currentPath = "";
  return (
    <nav aria-label="Breadcrumb" className="px-6 py-3">
      <ol className="flex items-center flex-wrap gap-2 text-sm">
        {/* <li>
          <Link to="/dashboard" className="text-gray-500 hover:text-primary">
            Dashboard
          </Link>
        </li>
        // if need to not show dashboard
        segments.filter((segment) => segment !== "dashboard")
        .map((segment, index, filteredSegments)
        */}

        {segments.map((segment, index, filteredSegments) => {
          currentPath += `/${segment}`;

          const isLast = index === filteredSegments.length - 1;

          const label =
            LABELS[segment] ||
            segment.charAt(0).toUpperCase() + segment.slice(1);

          return (
            <li key={currentPath} className="flex items-center gap-2">
              <span className="text-gray-400">/</span>

              {isLast ? (
                <span className="font-medium text-text">{label}</span>
              ) : (
                <Link
                  to={currentPath}
                  className="text-gray-500 hover:text-primary"
                >
                  {label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
