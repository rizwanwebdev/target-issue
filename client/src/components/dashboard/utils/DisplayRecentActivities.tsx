import { useEffect, useState } from "react";
type Props = {
  organizationId: number;
  projectId?: number;
};
import type { Activity } from "@/types/Activity";
import RecentActivitiesComponent from "@/components/dashboard/utils/RecentActivitiesComponent";
import apiRequest from "@/api/apiRequest";
import { useToast } from "@/context/ToastProvider";
const DisplayRecentActivities = ({ organizationId, projectId }: Props) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const { addToast } = useToast();

  useEffect(() => {
    async function getAll() {
      const endpoint = projectId
        ? "/activity/project"
        : "/activity/organization";

      const apiBody = projectId
        ? { organizationId: organizationId, projectId: projectId }
        : { organizationId: organizationId };
      if (!organizationId) return;
      const result = await apiRequest({
        method: "POST",
        endpoint: endpoint,
        body: apiBody,
      });
      if (result.error) {
        addToast(result.message, "error");
        return;
      }
      setActivities(result.activities);
    }

    getAll();
  }, [addToast, projectId, organizationId]);
  return <RecentActivitiesComponent activities={activities} />;
};

export default DisplayRecentActivities;
