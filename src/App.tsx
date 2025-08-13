import { BrowserRouter, Routes, Route } from "react-router";
import { Toaster } from "sonner";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import { AdminGuard } from "./guards/admin.guard";
import Signup from "./pages/auth/Signup";
import AdminLayout from "./layout/AdminLayout";
import Dashboard from "./pages/designer/Dashboard";
import { useEffect } from "react";
import { useAuthStore } from "./store/useAuthStore";
import ForgotPassword from "./pages/auth/ForgotPassword";
import VerifyOtp from "./pages/auth/VerifyOtp";
import ResetPassword from "./pages/auth/ResetPassword";
import Clients from "./pages/designer/Clients";
import Measurements from "./pages/designer/Measurements";
import Projects from "./pages/designer/Projects";

export default function App() {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <BrowserRouter>
      <Toaster richColors />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route element={<AdminLayout />}>
          <Route
            path="/dashboard"
            element={
              <AdminGuard>
                <Dashboard />
              </AdminGuard>
            }
          />
          <Route
            path="/clients"
            element={
              <AdminGuard>
                <Clients />
              </AdminGuard>
            }
          />
          <Route
            path="/measurements"
            element={
              <AdminGuard>
                <Measurements />
              </AdminGuard>
            }
          />
          <Route
            path="/pattern-design"
            element={
              <AdminGuard>
                <Measurements />
              </AdminGuard>
            }
          />
          <Route
            path="/ai-patterns"
            element={
              <AdminGuard>
                <Measurements />
              </AdminGuard>
            }
          />
          <Route
            path="/projects"
            element={
              <AdminGuard>
                <Projects />
              </AdminGuard>
            }
          />
          <Route
            path="/invoices"
            element={
              <AdminGuard>
                <Measurements />
              </AdminGuard>
            }
          />
          <Route
            path="/calendar"
            element={
              <AdminGuard>
                <Measurements />
              </AdminGuard>
            }
          />
          <Route
            path="/analytics"
            element={
              <AdminGuard>
                <Measurements />
              </AdminGuard>
            }
          />
          <Route
            path="/pricing"
            element={
              <AdminGuard>
                <Measurements />
              </AdminGuard>
            }
          />
          <Route
            path="/settings"
            element={
              <AdminGuard>
                <Measurements />
              </AdminGuard>
            }
          />
          <Route
            path="/admin"
            element={
              <AdminGuard>
                <Dashboard />
              </AdminGuard>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
