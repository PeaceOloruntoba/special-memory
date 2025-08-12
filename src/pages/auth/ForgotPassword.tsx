import React, { useState } from "react";
import { useNavigate } from "react-router";
import { FiScissors } from "react-icons/fi";
import { useAuthStore } from "../../store/useAuthStore";
import Label from "../../components/ui/Label";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Spinner from "../../components/ui/Spinner";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const { sendPasswordResetOtp, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await sendPasswordResetOtp(email);
      navigate(`/reset-password?email=${encodeURIComponent(email)}`);
    } catch (err) {
      console.error("Forgot password failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 bg-white rounded-xl shadow-lg p-8">
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
              <FiScissors className="h-7 w-7 text-white" />
            </div>
            <span className="text-3xl font-bold text-gray-900">Kunibi</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Forgot Your Password?
          </h1>
          <p className="text-gray-600">
            Enter your email address and we'll send you a password reset code.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium leading-none">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jane@example.com"
              required
              className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-950"
              disabled={isLoading}
            />
          </div>
          <Button
            type="submit"
            className="w-full h-10 px-4 py-2 flex items-center justify-center rounded-md text-white font-medium bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? <Spinner /> : "Send Reset Code"}
          </Button>
        </form>
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Remember your password?{" "}
            <a
              href="/login"
              className="text-purple-600 hover:text-purple-700 font-medium"
            >
              Sign In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
