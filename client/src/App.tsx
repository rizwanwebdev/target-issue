import { Routes, Route } from "react-router-dom";

import HomePage from "@/pages/HomePage";
import RegisterPage from "@/pages/RegisterPage";
import LoginPage from "@/pages/LoginPage";
import OtpVerificationPage from "@/pages/OtpVerificationPage";
import ForgotPasswordPage from "@/pages/ForgotPasswordPage";
import Dashboard from "@/pages/dashboard/Dashboard";
import SavePasswordPage from "@/pages/SavePasswordPage";
import NotFoundPage from "@/pages/NotFoundPage";

import { ToastProvider } from "@/context/ToastProvider";
import { AuthProvider } from "@/context/AuthContext";

import DashOrganization from "@/pages/dashboard/DashOrganization.tsx";
import DashViewOrg from "@/pages/dashboard/DashViewOrg.tsx";
import Invitations from "@/pages/Invitations.tsx";
import OrgTeam from "@/pages/dashboard/OrgTeam.tsx";
import OrganizationTeamsPage from "@/pages/dashboard/OrganizationTeamsPage.tsx";
import OrganizationProjectsPage from "@/pages/dashboard/OrganizationProjectsPage.tsx";
import OrgProject from "@/pages/dashboard/OrgProject.tsx";
import OrganizationMemebersPage from "@/pages/dashboard/OrganizationMembersPage.tsx";
import OrgMember from "@/pages/dashboard/OrgMember.tsx";
import NotAuthorized from "@/components/utils/NotAuthorized.tsx";
import DashboardLayout from "@/components/dashboard/layout/DashboradLayout.tsx";
import OrganizationLayout from "@/components/dashboard/layout/OrganizationLayout.tsx";
import InsightsPage from "@/pages/dashboard/InsightsPage";
import AccountAndSettingsPage from "@/pages/dashboard/AccountAndSettingsPage";

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Routes>
          {/* Public routes */}
          <Route element={<NotAuthorized />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/verify-otp" element={<OtpVerificationPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/save-password" element={<SavePasswordPage />} />
          </Route>
          <Route path="/invitations" element={<Invitations />} />

          {/* Protected routes */}
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />

            <Route
              path="/dashboard/organizations"
              element={<DashOrganization />}
            />
            <Route path="/dashboard/insights" element={<InsightsPage />} />
            <Route
              path="/dashboard/account"
              element={<AccountAndSettingsPage />}
            />

            <Route
              path="/dashboard/organizations/:slug"
              element={<OrganizationLayout />}
            >
              <Route index element={<DashViewOrg />} />

              <Route path="teams" element={<OrganizationTeamsPage />} />

              <Route path="projects" element={<OrganizationProjectsPage />} />

              <Route path="members" element={<OrganizationMemebersPage />} />

              <Route path="teams/:team" element={<OrgTeam />} />

              <Route path="projects/:project" element={<OrgProject />} />

              <Route path="members/:member" element={<OrgMember />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
