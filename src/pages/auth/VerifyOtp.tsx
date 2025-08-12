import React, { useState, useRef, createRef, useEffect } from "react";
import { FiScissors } from "react-icons/fi";
import { useNavigate, useSearchParams } from "react-router";
import { useAuthStore } from "../../store/useAuthStore";
import { toast } from "sonner";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Spinner from "../../components/ui/Spinner";

export default function VerifyOtp() {
  const [otp, setOtp] = useState<string[]>(["", "", "", ""]);
  const inputRefs = useRef<Array<React.RefObject<HTMLInputElement | null>>>(
    Array.from({ length: 4 }, () => createRef<HTMLInputElement | null>())
  );

  const {
    verifyAccountOtp,
    sendAccountVerificationOtp,
    isLoading,
    emailForVerification,
  } = useAuthStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const emailFromUrl = searchParams.get("email") || emailForVerification;

  useEffect(() => {
    if (inputRefs.current[0].current) {
      inputRefs.current[0].current.focus();
    }
  }, []);

  const handleChange = (
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

  const handleKeyDown = (
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

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text/plain").slice(0, 4);
    if (/^\d{4}$/.test(pasteData)) {
      const newOtp = pasteData.split("");
      setOtp(newOtp);

      inputRefs.current[3].current?.focus();
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join("");
    if (otpString.length === 4 && emailFromUrl) {
      try {
        await verifyAccountOtp(emailFromUrl, otpString);
        navigate("/login");
      } catch (err) {
        console.error("OTP verification failed:", err);
      }
    } else {
      toast.error("Please enter a complete 4-digit code.");
    }
  };

  const handleResendOtp = async () => {
    if (emailFromUrl) {
      try {
        await sendAccountVerificationOtp(emailFromUrl);
      } catch (err) {
        console.error("Resend OTP failed:", err);
      }
    } else {
      toast.error("Email not found for resending OTP.");
    }
  };

  if (!emailFromUrl) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8 bg-white rounded-xl shadow-lg p-8 text-center">
          <p className="text-lg text-red-600">
            Error: Email for verification not found. Please go back to signup.
          </p>
          <a
            href="/signup"
            className="text-purple-600 hover:text-purple-700 font-medium"
          >
            Go to Sign Up
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
            Verify Your Email
          </h1>
          <p className="text-gray-600">
            A 4-digit code has been sent to{" "}
            <span className="font-semibold">{emailFromUrl}</span>. Please enter
            it below to activate your account.
          </p>
        </div>

        <form onSubmit={handleVerify} className="space-y-6">
          <div className="flex justify-center gap-2">
            {otp.map((digit, index) => (
              <Input
                key={index}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={handlePaste}
                ref={inputRefs.current[index]}
                className="w-14 h-14 text-center text-2xl font-bold border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-950"
                disabled={isLoading}
              />
            ))}
          </div>
          <Button
            type="submit"
            className="w-full h-10 px-4 py-2 flex items-center justify-center rounded-md text-white font-medium bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading || otp.join("").length !== 4}
          >
            {isLoading ? <Spinner /> : "Verify Code"}
          </Button>
          <Button
            type="button"
            onClick={handleResendOtp}
            className="w-full h-10 px-4 py-2 mt-2 bg-transparent text-purple-600 border border-purple-600 rounded-md hover:bg-purple-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            Resend Code
          </Button>
        </form>
      </div>
    </div>
  );
}
