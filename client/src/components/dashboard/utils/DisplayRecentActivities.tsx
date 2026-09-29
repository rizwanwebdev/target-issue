import GetRecentActivities from "@/api/activity/getRecentActivities.api";
import { useEffect, useState } from "react";
type Props = {
  organizationId: number;
  projectId?: number;
};
import type { Activity } from "@/types/Activity";
import GetRecentProjectActivitiesApi from "@/api/activity/getRecentProjectActivities.api";
const DisplayRecentActivities = ({ organizationId, projectId }: Props) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  useEffect(() => {
    async function getAll() {
      let result;
      if (projectId) {
        result = await GetRecentProjectActivitiesApi(organizationId, projectId);
      } else {
        result = await GetRecentActivities(organizationId);
      }
      if (result.error) {
        return;
      }

      setActivities(result.activities);
    }

    getAll();
  }, []);
  return (
    <>
      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-text">Recent Activity</h2>
          </div>
          {activities.length === 0 ? (
            <div className="mt-5">
              <p className="text-sm text-gray-500">
                No recent activity to display.
              </p>
            </div>
          ) : (
            <div className="mt-5 space-y-4">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="border-b border-gray-100 pb-3"
                >
                  <p className="text-sm text-text">{activity.message}</p>

                  <p className="mt-1 text-xs text-gray-400">
                    {activity.actor_name} ·
                    {new Date(activity.created_at).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default DisplayRecentActivities;
