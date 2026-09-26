import type { Organization } from "./Organization";
import type { Project } from "./Project";

export type ProjectOutletContext = {
  organization: Organization;
  project: Project;
};
