import React, { useState, useRef, createRef, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { FiScissors, FiEye, FiEyeOff } from "react-icons/fi";
import { toast } from "sonner";
import { useAuthStore } from "../../store/useAuthStore";
import Label from "../../components/ui/Label";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Spinner from "../../components/ui/Spinner";

export default function ResetPassword() {
  const [otp, setOtp] = useState<string[]>(["", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const inputRefs = useRef<Array<React.RefObject<HTMLInputElement | null>>>(
    Array.from({ length: 4 }, () => createRef<HTMLInputElement | null>())
  );

  const { resetPasswordWithOtp, isLoading, emailForPasswordReset } =
    useAuthStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const emailFromUrl = searchParams.get("email") || emailForPasswordReset;

  useEffect(() => {
    if (inputRefs.current[0].current) {
      inputRefs.current[0].current.focus();
    }
  }, []);

  const handleOtpChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value;
    if (/[0-9]/.test(value) && value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 3) {
        inputRefs.current[index + 1].current?.focus();
      }
    }
  };

  const handleOtpKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const newOtp = [...otp];
      newOtp[index - 1] = "";
      setOtp(newOtp);
      inputRefs.current[index - 1].current?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text/plain").slice(0, 4);
    if (/^\d{4}$/.test(pasteData)) {
      const newOtp = pasteData.split("");
      setOtp(newOtp);
      inputRefs.current[3].current?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join("");

    if (!emailFromUrl) {
      toast.error("Email not found for password reset. Please start over.");
      return;
    }
    if (otpString.length !== 4) {
      toast.error("Please enter the full 4-digit code.");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match.");
      return;
    }

    try {
      await resetPasswordWithOtp(emailFromUrl, otpString, newPassword);
      navigate("/login");
    } catch (err) {
      console.error("Password reset failed:", err);
    }
  };

  if (!emailFromUrl) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8 bg-white rounded-xl shadow-lg p-8 text-center">
          <p className="text-lg text-red-600">
            Error: Email for password reset not found. Please go back to "Forgot
            Password".
          </p>
          <a
            href="/forgot-password"
            className="text-purple-600 hover:text-purple-700 font-medium"
          >
            Go to Forgot Password
          </a>
        </div>
      </div>
    );
  }

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
            Reset Your Password
          </h1>
          <p className="text-gray-600">
            Enter the 4-digit code sent to{" "}
            <span className="font-semibold">{emailFromUrl}</span> and your new
            password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="otp" className="text-sm font-medium leading-none">
              Verification Code (OTP)
            </Label>
            <div className="flex justify-center gap-2">
              {otp.map((digit, index) => (
                <Input
                  key={index}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(e, index)}
                  onKeyDown={(e) => handleOtpKeyDown(e, index)}
                  onPaste={handleOtpPaste}
                  ref={inputRefs.current[index]}
                  className="w-14 h-14 text-center text-2xl font-bold border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-950"
                  disabled={isLoading}
                />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="newPassword"
              className="text-sm font-medium leading-none"
            >
              New Password
            </Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter your new password"
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
            <p className="text-xs text-gray-600">
              Must be at least 8 characters long
            </p>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="confirmPassword"
              className="text-sm font-medium leading-none"
            >
              Confirm New Password
            </Label>
            <Input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your new password"
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
            {isLoading ? <Spinner /> : "Reset Password"}
          </Button>
        </form>
      </div>
    </div>
  );
}
