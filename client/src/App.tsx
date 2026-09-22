import { Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import OtpVerificationPage from "./pages/OtpVerificationPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import Dashboard from "./pages/Dashboard";
import SavePasswordPage from "./pages/SavePasswordPage";
import NotFoundPage from "./pages/NotFoundPage";

import { ToastProvider } from "./context/ToastProvider";
import { AuthProvider } from "./context/AuthContext";

import DashOrganization from "./pages/DashOrganization.tsx";
import DashViewOrg from "./pages/DashViewOrg.tsx";
import Invitations from "./pages/Invitations.tsx";
import OrgTeam from "./pages/OrgTeam.tsx";
import OrganizationTeamsPage from "./pages/OrganizationTeamsPage.tsx";
import OrganizationProjectsPage from "./pages/OrganizationProjectsPage.tsx";
import OrgProject from "./pages/OrgProject.tsx";
import OrganizationMemebersPage from "./pages/OrganizationMembersPage.tsx";
import OrgMember from "./pages/OrgMember.tsx";
import NotAuthorized from "./components/utils/NotAuthorized.tsx";
import DashboardLayout from "./components/DashboradLayout.tsx";
import OrganizationLayout from "./components/OrganizationLayout.tsx";

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
