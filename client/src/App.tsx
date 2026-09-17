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

import Authorize from "./components/utils/Authorize";
import DashOrganization from "./pages/DashOrganization.tsx";

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/verify-otp" element={<OtpVerificationPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/save-password" element={<SavePasswordPage />} />

          {/* Protected routes */}
          <Route element={<Authorize />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route
              path="/dashboard/organizations"
              element={<DashOrganization />}
            />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
