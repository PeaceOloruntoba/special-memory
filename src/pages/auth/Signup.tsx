"use client";

import React, { useState } from "react";
import {
  FiScissors,
  FiEye,
  FiEyeOff,
  FiCheck,
  FiStar,
  FiZap,
  FiArrowLeft,
} from "react-icons/fi";
import Label from "../../components/ui/Label";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Checkbox from "../../components/ui/Checkbox";
import Select from "../../components/ui/Select";
import Option from "../../components/ui/Option";
import Badge from "../../components/ui/Badge";
import { FaCrown } from "react-icons/fa";

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<
    "free" | "premium" | "enterprise"
  >("free");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    businessName: "",
    businessType: "",
    agreeToTerms: false,
    subscribeToNewsletter: true,
  });
  const [step, setStep] = useState(1);

  const plans = [
    {
      id: "free",
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for getting started",
      icon: FiStar,
      color: "text-gray-600",
      bgColor: "bg-gray-50",
      borderColor: "border-gray-200",
      features: [
        "3 clients",
        "5 projects",
        "5 AI generations/month",
        "Basic templates",
      ],
    },
    {
      id: "premium",
      name: "Premium",
      price: "$49",
      period: "per month",
      description: "Everything you need for your business",
      icon: FiZap,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      features: [
        "Unlimited clients",
        "Unlimited projects",
        "Unlimited AI generations",
        "Professional tools",
      ],
      popular: true,
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: "$149",
      period: "per month",
      description: "Advanced features for teams",
      icon: FaCrown,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
      features: [
        "Everything in Premium",
        "Team collaboration",
        "Custom branding",
        "API access",
      ],
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Sign up data:", { ...formData, selectedPlan });
  };

  const handleNextStep = () => {
    setStep(2);
  };

  const handlePrevStep = () => {
    setStep(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="flex flex-col justify-center space-y-8 lg:pr-8">
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                <FiScissors className="h-7 w-7 text-white" />
              </div>
              <span className="text-3xl font-bold text-gray-900">Kunibi</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Transform Your Fashion Design Business
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Join thousands of fashion designers who use Kunibi to manage
              clients, create patterns, and grow their business.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <FiCheck className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  AI-Powered Pattern Generation
                </h3>
                <p className="text-gray-600">
                  Create custom patterns instantly with our advanced AI
                  technology
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <FiCheck className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  Complete Client Management
                </h3>
                <p className="text-gray-600">
                  Track measurements, projects, and communications in one place
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <FiCheck className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  Professional Business Tools
                </h3>
                <p className="text-gray-600">
                  Invoicing, scheduling, analytics, and more to grow your
                  business
                </p>
              </div>
            </div>
          </div>

          <div className="text-center lg:text-left">
            <p className="text-sm text-gray-500">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-purple-600 hover:text-purple-700 font-medium"
              >
                Sign in here
              </a>
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {step === 1 && (
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Choose Your Plan
                </h2>
                <p className="text-gray-600 text-sm">
                  Start with any plan and upgrade anytime
                </p>
              </div>
              <div className="space-y-4">
                {plans.map((plan) => {
                  const Icon = plan.icon;
                  const isSelected = selectedPlan === plan.id;
                  return (
                    <div
                      key={plan.id}
                      className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        isSelected
                          ? `${plan.borderColor} ${plan.bgColor}`
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() =>
                        setSelectedPlan(
                          plan.id as "free" | "premium" | "enterprise"
                        )
                      }
                    >
                      {plan.popular && (
                        <div className="absolute -top-2 left-4">
                          <Badge className="bg-purple-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
                            Most Popular
                          </Badge>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Icon className={`h-6 w-6 ${plan.color}`} />
                          <div>
                            <div className="font-semibold">{plan.name}</div>
                            <div className="text-sm text-gray-600">
                              {plan.description}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-lg">
                            {plan.price}
                            <span className="text-sm font-normal text-gray-600">
                              /{plan.period}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {plan.features.map((feature, index) => (
                          <Badge
                            key={index}
                            className="border border-gray-300 text-gray-700 text-xs px-2 py-1 rounded-full"
                          >
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
              <Button
                type="button"
                onClick={handleNextStep}
                className="mt-6 w-full h-10 px-4 py-2 flex items-center justify-center rounded-md text-white font-medium bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-colors"
              >
                Continue to Sign Up
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="mb-6">
                <Button
                  type="button"
                  onClick={handlePrevStep}
                  className="mb-4 inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <FiArrowLeft className="h-4 w-4 mr-2" /> Back to Plans
                </Button>
                <h2 className="text-xl font-semibold text-gray-900">
                  Create Your Account
                </h2>
                <p className="text-gray-600 text-sm">
                  You have selected the{" "}
                  <span className="font-semibold">
                    {selectedPlan.toUpperCase()}
                  </span>{" "}
                  plan.
                </p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="firstName"
                      className="text-sm font-medium leading-none"
                    >
                      First Name
                    </Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
                      placeholder="Jane"
                      required
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-950"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="lastName"
                      className="text-sm font-medium leading-none"
                    >
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData({ ...formData, lastName: e.target.value })
                      }
                      placeholder="Designer"
                      required
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-950"
                    />
                  </div>
                </div>

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
                      placeholder="Create a strong password"
                      required
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-950"
                    />
                    <Button
                      type="button"
                      className="absolute right-0 top-0 h-full px-3 py-2 bg-transparent hover:bg-gray-100 rounded-r-md text-gray-500"
                      onClick={() => setShowPassword(!showPassword)}
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
                    htmlFor="businessName"
                    className="text-sm font-medium leading-none"
                  >
                    Business Name (Optional)
                  </Label>
                  <Input
                    id="businessName"
                    value={formData.businessName}
                    onChange={(e) =>
                      setFormData({ ...formData, businessName: e.target.value })
                    }
                    placeholder="Jane's Fashion Studio"
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-950"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="businessType"
                    className="text-sm font-medium leading-none"
                  >
                    Business Type
                  </Label>
                  <Select
                    id="businessType"
                    value={formData.businessType}
                    onChange={(e) =>
                      setFormData({ ...formData, businessType: e.target.value })
                    }
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-950 appearance-none pr-8"
                  >
                    <Option value="">Select your business type</Option>
                    <Option value="independent-designer">
                      Independent Designer
                    </Option>
                    <Option value="fashion-studio">Fashion Studio</Option>
                    <Option value="alterations">Alterations Service</Option>
                    <Option value="costume-design">Costume Design</Option>
                    <Option value="bridal-boutique">Bridal Boutique</Option>
                    <Option value="fashion-school">Fashion School</Option>
                    <Option value="other">Other</Option>
                  </Select>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="terms"
                      checked={formData.agreeToTerms}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          agreeToTerms: e.target.checked,
                        })
                      }
                      className="h-4 w-4 shrink-0 rounded-sm border border-gray-300 accent-purple-600"
                    />
                    <Label htmlFor="terms" className="text-sm text-gray-700">
                      I agree to the{" "}
                      <a
                        href="/terms"
                        className="text-purple-600 hover:text-purple-700"
                      >
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a
                        href="/privacy"
                        className="text-purple-600 hover:text-purple-700"
                      >
                        Privacy Policy
                      </a>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="newsletter"
                      checked={formData.subscribeToNewsletter}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          subscribeToNewsletter: e.target.checked,
                        })
                      }
                      className="h-4 w-4 shrink-0 rounded-sm border border-gray-300 accent-purple-600"
                    />
                    <Label
                      htmlFor="newsletter"
                      className="text-sm text-gray-700"
                    >
                      Send me tips, updates, and special offers
                    </Label>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-10 px-4 py-2 flex items-center justify-center rounded-md text-white font-medium bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!formData.agreeToTerms}
                >
                  Create Account & Start{" "}
                  {selectedPlan === "free" ? "Free" : "Trial"}
                </Button>

                {selectedPlan !== "free" && (
                  <p className="text-xs text-center text-gray-600">
                    Start your 14-day free trial. No credit card required.
                    Cancel anytime.
                  </p>
                )}
              </form>
            </div>
          )}

          <div className="text-center">
            <p className="text-xs text-gray-500">
              By signing up, you agree to our Terms of Service and Privacy
              Policy.
              <br />
              We'll never spam you or share your information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
