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
import Default from "./pages/Default";
import Invoices from "./pages/designer/Invoice";
import Calendar from "./pages/designer/Calendar";
import Analytics from "./pages/designer/Analytics";
import Pricing from "./pages/designer/Pricing";
import Settings from "./pages/designer/Settings";
import SubscribePage from "./pages/designer/Subscribe";
import PatternDesignerPage from "./pages/designer/Patterns";

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
            path="/patterns"
            element={
              <AdminGuard>
                <PatternDesignerPage />
              </AdminGuard>
            }
          />
          <Route
            path="/ai-patterns"
            element={
              <AdminGuard>
                <Default pageTitle="AI Patterns" />
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
                <Invoices />
              </AdminGuard>
            }
          />
          <Route
            path="/calendar"
            element={
              <AdminGuard>
                <Calendar />
              </AdminGuard>
            }
          />
          <Route
            path="/analytics"
            element={
              <AdminGuard>
                <Analytics />
              </AdminGuard>
            }
          />
          <Route
            path="/pricing"
            element={
              <AdminGuard>
                <Pricing />
              </AdminGuard>
            }
          />
          <Route
            path="/pricing/subscribe"
            element={
              <AdminGuard>
                <SubscribePage />
              </AdminGuard>
            }
          />
          <Route
            path="/settings"
            element={
              <AdminGuard>
                <Settings/>
              </AdminGuard>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
