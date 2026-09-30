import { useAuth } from "@/context/AuthContext.tsx";
import { useEffect, useState } from "react";
import recentActivitiesByMe from "@/api/activity/recentActivitiesByMe.api";
import type { Activity } from "@/types/Activity";
import RecentActivitiesComponent from "@/components/dashboard/utils/RecentActivitiesComponent";
import dashStatsApi from "@/api/stats/dashStats.api";

type Stat = {
  organization_count: string;
  project_count: string;
  team_count: string;
};
const Dashboard = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [showStats, setShowStats] = useState<Stat | null>(null);
  useEffect(() => {
    if (!user) return;
    async function getAll() {
      const [activityResult, statsResult] = await Promise.all([
        recentActivitiesByMe(),
        await dashStatsApi(),
      ]);
      console.log(activityResult, statsResult);

      setShowStats(statsResult.stats);
      setActivities(activityResult.activities);
    }

    getAll();
  }, [user]);

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

            <p className="mt-2 text-3xl font-semibold text-text">
              {showStats?.organization_count || 0}
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-gray-500">Projects</p>

            <p className="mt-2 text-3xl font-semibold text-text">
              {showStats?.project_count || 0}
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-gray-500">Teams</p>

            <p className="mt-2 text-3xl font-semibold text-primary">
              {showStats?.team_count || 0}
            </p>
          </div>
        </section>

        {/* Recent Activity */}
        <RecentActivitiesComponent activities={activities} />
      </div>
    </>
  );
};

export default Dashboard;
