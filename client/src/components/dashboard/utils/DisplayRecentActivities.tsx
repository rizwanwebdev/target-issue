import GetRecentActivities from "@/api/activity/getRecentActivities.api";
import { useEffect, useState } from "react";
type Props = {
  organizationId: number;
  projectId?: number;
};
import type { Activity } from "@/types/Activity";
import GetRecentProjectActivitiesApi from "@/api/activity/getRecentProjectActivities.api";
import RecentActivitiesComponent from "@/components/dashboard/utils/RecentActivitiesComponent";
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
  return <RecentActivitiesComponent activities={activities} />;
};

export default DisplayRecentActivities;
