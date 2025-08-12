import React, { useState } from "react";
import { useNavigate } from "react-router";
import { FiScissors, FiEye, FiEyeOff, FiArrowRight } from "react-icons/fi";
import { FaFacebook, FaGoogle } from "react-icons/fa";
import Button from "../../components/ui/Button";
import { useAuthStore } from "../../store/useAuthStore";
import Label from "../../components/ui/Label";
import Input from "../../components/ui/Input";
import Checkbox from "../../components/ui/Checkbox";
import Spinner from "../../components/ui/Spinner";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const { login, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(formData.email, formData.password);
      navigate("/dashboard");
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
              <FiScissors className="h-7 w-7 text-white" />
            </div>
            <span className="text-3xl font-bold text-gray-900">Kunibi</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome back
          </h1>
          <p className="text-gray-600">Sign in to your fashion design studio</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Sign In</h2>
            <p className="text-gray-600 text-sm">
              Enter your credentials to access your account
            </p>
          </div>
          <div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium leading-none"
                >
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="jane@example.com"
                  required
                  className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-950"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium leading-none"
                >
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    placeholder="Enter your password"
                    required
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-950"
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    className="absolute right-0 top-0 h-full px-3 py-2 bg-transparent hover:bg-gray-100 rounded-r-md text-gray-500"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <FiEyeOff className="h-4 w-4" />
                    ) : (
                      <FiEye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={formData.rememberMe}
                    onChange={(e) =>
                      setFormData({ ...formData, rememberMe: e.target.checked })
                    }
                    className="h-4 w-4 shrink-0 rounded-sm border border-gray-300 accent-purple-600"
                    disabled={isLoading}
                  />
                  <Label htmlFor="remember" className="text-sm text-gray-700">
                    Remember me
                  </Label>
                </div>
                <a
                  href="/forgot-password"
                  className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                >
                  Forgot password?
                </a>
              </div>

              <Button
                type="submit"
                className="w-full h-10 px-4 py-2 flex items-center justify-center rounded-md text-white font-medium bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Spinner />
                ) : (
                  <>
                    Sign In <FiArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <a
              href="/signup"
              className="text-purple-600 hover:text-purple-700 font-medium"
            >
              Sign up for free
            </a>
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div>
            <div className="space-y-3">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  className="w-full h-10 px-4 py-2 flex items-center justify-center rounded-md text-gray-700 border border-gray-300 bg-transparent hover:bg-gray-100 transition-colors"
                  disabled={isLoading}
                >
                  <FaGoogle className="h-4 w-4 mr-2" />
                  Google
                </Button>
                <Button
                  className="w-full h-10 px-4 py-2 flex items-center justify-center rounded-md text-gray-700 border border-gray-300 bg-transparent hover:bg-gray-100 transition-colors"
                  disabled={isLoading}
                >
                  <FaFacebook className="h-4 w-4 mr-2" />
                  Facebook
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
