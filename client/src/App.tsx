import { Routes, Route } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { RegisterPage } from "./pages/RegisterPage";
import { LoginPage } from "./pages/LoginPage";
import { OtpVerificationPage } from "./pages/OtpVerificationPage";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage";
import { ToastProvider } from "./context/ToastProvider";

function App() {
  return (
    <ToastProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/verify-otp" element={<OtpVerificationPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Routes>
    </ToastProvider>
  );
}

export default App;
