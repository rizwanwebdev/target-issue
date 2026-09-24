import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext.tsx";

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <>
      <title>Dashboard | TargetIssue</title>

      <div className="flex flex-col gap-8">
        {/* Header */}
        <section>
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold text-text">
              Good morning, {user?.fullName}
            </h1>

            <p className="text-sm text-gray-500">
              Here's what's happening across your organizations.
            </p>
          </div>
        </section>

        {/* Stats */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-gray-500">Organizations</p>

            <p className="mt-2 text-3xl font-semibold text-text">4</p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-gray-500">Open Issues</p>

            <p className="mt-2 text-3xl font-semibold text-text">24</p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-gray-500">My Issues</p>

            <p className="mt-2 text-3xl font-semibold text-primary">8</p>
          </div>
        </section>

        {/* Recent Activity */}
        <section className="flex flex-col gap-4">
          <div>
            <h2 className="text-xl font-semibold text-text">Recent Activity</h2>

            <div className="mt-2 h-px bg-gray-200" />
          </div>

          <div className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 p-4 transition hover:bg-gray-50">
              <div>
                <p className="text-sm font-medium text-text">Target Issue</p>

                <p className="mt-1 text-sm text-gray-500">
                  Issue #42 assigned to you
                </p>
              </div>

              <time className="text-xs text-gray-400">10 minutes ago</time>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 p-4 transition hover:bg-gray-50">
              <div>
                <p className="text-sm font-medium text-text">Another Org</p>

                <p className="mt-1 text-sm text-gray-500">New member joined</p>
              </div>

              <time className="text-xs text-gray-400">1 hour ago</time>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 p-4 transition hover:bg-gray-50">
              <div>
                <p className="text-sm font-medium text-text">Target Issue</p>

                <p className="mt-1 text-sm text-gray-500">
                  Issue #39 completed
                </p>
              </div>

              <time className="text-xs text-gray-400">3 hours ago</time>
            </div>
          </div>
        </section>

        {/* Organizations */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-text">
                Your Organizations
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Overview of your organization's issues.
              </p>
            </div>

            <Link
              to="/dashboard/organizations"
              className="text-sm font-medium text-primary transition hover:text-hover"
            >
              View all
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <Link
              to="/dashboard/organizations/test-org-4"
              className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:border-primary/30 hover:shadow-md"
            >
              <div className="flex items-center justify-between gap-4">
                <p className="font-medium text-text">TargetIssue</p>

                <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
                  12 open issues
                </span>
              </div>
            </Link>

            <Link
              to="/dashboard/organizations/test-org-3"
              className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:border-primary/30 hover:shadow-md"
            >
              <div className="flex items-center justify-between gap-4">
                <p className="font-medium text-text">Acme Engineering</p>

                <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
                  8 open issues
                </span>
              </div>
            </Link>

            <Link
              to="/dashboard/organizations/personal-projects"
              className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:border-primary/30 hover:shadow-md"
            >
              <div className="flex items-center justify-between gap-4">
                <p className="font-medium text-text">Personal Projects</p>

                <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
                  6 open issues
                </span>
              </div>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
};

export default Dashboard;
