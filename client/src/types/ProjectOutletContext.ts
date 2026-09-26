import type { Organization } from "@/api/org/getAllOrganizations";
import type { Project } from "@/api/project/getProjects.api";

export type ProjectOutletContext = {
  organization: Organization;
  project: Project;
};
