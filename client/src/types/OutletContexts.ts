import type { Organization } from "./Organization";
import type { Project } from "./Project";
import type { Team } from "./Team";

export type OrganizationOutletContext = {
  organization: Organization;
};

export type ProjectOutletContext = {
  organization: Organization;
  project: Project;
};

export type TeamOutletContext = {
  organization: Organization;
  project: Project;
  team: Team;
};
