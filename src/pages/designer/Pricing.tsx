// src/pages/designer/Pricing.tsx
import { BiCheck, BiX, BiStar, BiCrown, BiBoltCircle } from "react-icons/bi";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import React, { useEffect, useState } from "react";
import usePricingStore from "../../store/usePricingStore";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { BiLoaderAlt } from "react-icons/bi";
import Input from "../../components/ui/Input"; // Assuming you have an Input component

interface Feature {
  name: string;
  included: boolean;
}

interface Plan {
  name: string;
  price: string;
  period: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
  borderColor: string;
  features: Feature[];
  limitations: string[];
  cta: string;
  popular: boolean;
}

interface FAQ {
  question: string;
  answer: string;
}

const plans: Plan[] = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for getting started with fashion design",
    icon: BiStar,
    color: "text-gray-600",
    bgColor: "bg-gray-50",
    borderColor: "border-gray-200",
    features: [
      { name: "Up to 3 clients", included: true },
      { name: "Up to 5 projects", included: true },
      { name: "Basic measurements recording", included: true },
      { name: "Simple pattern designer", included: true },
      { name: "5 AI pattern generations per month", included: true },
      { name: "Basic project tracking", included: true },
      { name: "Email support", included: true },
      { name: "Data export (CSV)", included: true },
      { name: "Unlimited clients", included: false },
      { name: "Unlimited projects", included: false },
      { name: "Advanced measurements templates", included: false },
      { name: "Professional pattern designer", included: false },
      { name: "Unlimited AI generations", included: false },
      { name: "Calendar scheduling", included: false },
      { name: "Invoice generation", included: false },
      { name: "Analytics dashboard", included: false },
      { name: "Client portal", included: false },
      { name: "Priority support", included: false },
      { name: "Team collaboration", included: false },
      { name: "Custom branding", included: false },
    ],
    limitations: [
      "Watermark on generated patterns",
      "Basic templates only",
      "Limited file storage (100MB)",
      "No calendar integration",
      "No financial tracking",
    ],
    cta: "Get Started Free",
    popular: false,
  },
  {
    name: "Premium",
    price: "$49",
    period: "per month",
    description: "Everything you need to run a professional fashion business",
    icon: BiBoltCircle,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    features: [
      { name: "Up to 3 clients", included: true },
      { name: "Up to 5 projects", included: true },
      { name: "Basic measurements recording", included: true },
      { name: "Simple pattern designer", included: true },
      { name: "5 AI pattern generations per month", included: true },
      { name: "Basic project tracking", included: true },
      { name: "Email support", included: true },
      { name: "Data export (CSV)", included: true },
      { name: "Unlimited clients", included: true },
      { name: "Unlimited projects", included: true },
      { name: "Advanced measurements templates", included: true },
      { name: "Professional pattern designer", included: true },
      { name: "Unlimited AI generations", included: true },
      { name: "Calendar scheduling", included: true },
      { name: "Invoice generation", included: true },
      { name: "Analytics dashboard", included: true },
      { name: "Client portal", included: true },
      { name: "Priority support", included: true },
      { name: "Team collaboration", included: false },
      { name: "Custom branding", included: false },
    ],
    limitations: [],
    cta: "Start Premium Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "$149",
    period: "per month",
    description: "Advanced features for fashion design teams and studios",
    icon: BiCrown,
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200",
    features: [
      { name: "Up to 3 clients", included: true },
      { name: "Up to 5 projects", included: true },
      { name: "Basic measurements recording", included: true },
      { name: "Simple pattern designer", included: true },
      { name: "5 AI pattern generations per month", included: true },
      { name: "Basic project tracking", included: true },
      { name: "Email support", included: true },
      { name: "Data export (CSV)", included: true },
      { name: "Unlimited clients", included: true },
      { name: "Unlimited projects", included: true },
      { name: "Advanced measurements templates", included: true },
      { name: "Professional pattern designer", included: true },
      { name: "Unlimited AI generations", included: true },
      { name: "Calendar scheduling", included: true },
      { name: "Invoice generation", included: true },
      { name: "Analytics dashboard", included: true },
      { name: "Client portal", included: true },
      { name: "Priority support", included: true },
      { name: "Team collaboration", included: true },
      { name: "Custom branding", included: true },
    ],
    limitations: [],
    cta: "Contact Sales",
    popular: false,
  },
];

const faqs: FAQ[] = [
  {
    question: "Can I upgrade or downgrade my plan anytime?",
    answer:
      "Yes, you can change your plan at any time. Upgrades take effect immediately, while downgrades take effect at the end of your current billing cycle.",
  },
  {
    question: "What happens to my data if I downgrade?",
    answer:
      "Your data is never deleted. If you exceed the limits of your new plan, you'll have read-only access to the excess data until you upgrade again.",
  },
  {
    question: "Is there a free trial for Premium?",
    answer:
      "Yes! You get a 14-day free trial of Premium when you sign up. No credit card required.",
  },
  {
    question: "Do you offer discounts for annual billing?",
    answer:
      "Yes, you save 20% when you pay annually. That's 2 months free on Premium and Enterprise plans.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards (Visa, MasterCard, American Express) and PayPal for monthly subscriptions.",
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer:
      "Absolutely. You can cancel your subscription at any time from your account settings. You'll continue to have access until the end of your billing period.",
  },
];

export default function PricingPage() {
  const {
    currentPlan,
    subscriptionStatus,
    startDate,
    dueDate,
    paymentMethod,
    invoices,
    isLoading,
    error,
    successMessage,
    fetchSubscriptionDetails,
    subscribeToPlan,
    cancelSubscription,
    updatePaymentMethod,
  } = usePricingStore();
  const [newPaymentMethodId, setNewPaymentMethodId] = useState("");

  useEffect(() => {
    fetchSubscriptionDetails();
  }, []);

  useEffect(() => {
    if (error) toast.error(error);
    if (successMessage) toast.success(successMessage);
  }, [error, successMessage]);

  const handleCtaClick = (planName: string) => {
    if (planName === "Free") {
      toast.info("You're already on the Free plan.");
      return;
    }
    if (planName === "Enterprise") {
      // In a real app, this would redirect to a contact form or sales page
      toast.info("Contacting sales for Enterprise plan...");
      return;
    }
    if (currentPlan === planName.toLowerCase()) {
      toast.info("You are already subscribed to this plan.");
      return;
    }
    // For demo; in real app, use Stripe Elements to create paymentMethodId
    const paymentMethodId = prompt(
      "Enter Payment Method ID (test: pm_card_visa)"
    );
    if (paymentMethodId) {
      subscribeToPlan(planName.toLowerCase(), paymentMethodId);
    }
  };

  const handleCancelSubscription = async () => {
    await cancelSubscription();
  };

  return (
    <div className="p-6 space-y-8 min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">Choose Your Plan</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Start free and upgrade as your fashion design business grows
        </p>
        {isLoading && (
          <div className="flex items-center justify-center text-purple-600">
            <BiLoaderAlt className="animate-spin mr-2" />
            <span>Checking subscription status...</span>
          </div>
        )}
        {currentPlan && (
          <p className="text-lg font-semibold text-purple-700">
            Current Plan: <span className="capitalize">{currentPlan}</span>{" "}
            (Status: <span className="capitalize">{subscriptionStatus}</span>)
          </p>
        )}
      </div>

      {/* Plan Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {plans.map((plan) => {
          const Icon = plan.icon;
          const isCurrentPlan = currentPlan === plan.name.toLowerCase();
          const isEnterprisePlan = plan.name === "Enterprise";

          return (
            <Card
              key={plan.name}
              className={`relative ${plan.borderColor} ${
                plan.popular ? "ring-2 ring-purple-500" : ""
              } ${isCurrentPlan ? "ring-4 ring-green-500" : ""}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-purple-600 text-white px-4 py-1">
                    Most Popular
                  </Badge>
                </div>
              )}

              <CardHeader
                className={`text-center ${plan.bgColor} rounded-t-lg`}
              >
                <div className="flex justify-center mb-4">
                  <Icon className={`h-12 w-12 ${plan.color}`} />
                </div>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <div className="space-y-2">
                  <div className="text-4xl font-bold">
                    {plan.price}
                    <span className="text-lg font-normal text-gray-600">
                      /{plan.period}
                    </span>
                  </div>
                  <CardDescription className="text-base">
                    {plan.description}
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent className="space-y-6 p-6">
                {isCurrentPlan ? (
                  plan.name !== "Free" ? (
                    <Button
                      onClick={handleCancelSubscription}
                      className={`w-full py-1 rounded-md bg-red-500 hover:bg-red-600 text-white`}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <BiLoaderAlt className="animate-spin" />
                      ) : (
                        "Cancel Subscription"
                      )}
                    </Button>
                  ) : (
                    <Button
                      className={`w-full py-1 rounded-md bg-gray-600 text-white cursor-not-allowed`}
                      disabled
                    >
                      Current Plan
                    </Button>
                  )
                ) : isEnterprisePlan ? (
                  <Button
                    onClick={() => handleCtaClick(plan.name)}
                    className={`w-full py-1 rounded-md bg-yellow-600 hover:bg-yellow-700 text-white`}
                  >
                    Contact Sales
                  </Button>
                ) : (
                  <Button
                    onClick={() => handleCtaClick(plan.name)}
                    className={`w-full py-1 rounded-md bg-purple-600 hover:bg-purple-700 text-white`}
                  >
                    {plan.cta}
                  </Button>
                )}

                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">
                    Features included:
                  </h4>
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-3">
                        {feature.included ? (
                          <BiCheck className="h-4 w-4 text-green-600 flex-shrink-0" />
                        ) : (
                          <BiX className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        )}
                        <span
                          className={`text-sm ${
                            feature.included
                              ? "text-gray-900"
                              : "text-gray-400 line-through"
                          }`}
                        >
                          {feature.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {plan.limitations.length > 0 && (
                  <div className="space-y-3 pt-4 border-t">
                    <h4 className="font-semibold text-gray-900">
                      Limitations:
                    </h4>
                    <ul className="space-y-2">
                      {plan.limitations.map((limitation, index) => (
                        <li key={index} className="flex items-center gap-3">
                          <BiX className="h-4 w-4 text-red-500 flex-shrink-0" />
                          <span className="text-sm text-gray-600">
                            {limitation}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Subscription Details if not free */}
      {currentPlan !== "free" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Subscription Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Status: {subscriptionStatus}</p>
              <p>
                Start Date:{" "}
                {startDate ? new Date(startDate).toLocaleDateString() : "N/A"}
              </p>
              <p>
                Next Billing:{" "}
                {dueDate ? new Date(dueDate).toLocaleDateString() : "N/A"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {paymentMethod ? (
                <p>
                  {paymentMethod.brand} **** {paymentMethod.last4} (Exp:{" "}
                  {paymentMethod.exp})
                </p>
              ) : (
                <p>No payment method on file.</p>
              )}
              <Input
                placeholder="New Payment Method ID (from Stripe Elements)"
                value={newPaymentMethodId}
                onChange={(e) => setNewPaymentMethodId(e.target.value)}
              />
              <Button onClick={() => updatePaymentMethod(newPaymentMethodId)}>
                Update Payment Method
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Billing History</CardTitle>
            </CardHeader>
            <CardContent>
              {invoices.length > 0 ? (
                <ul className="space-y-2">
                  {invoices.map((inv, i) => (
                    <li key={i}>
                      {inv.date} - {inv.amount} ({inv.status})
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No invoices yet.</p>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Feature Comparison Table */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Detailed Feature Comparison
          </h2>
          <p className="text-gray-600">Compare all features across our plans</p>
        </div>

        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left p-4 font-semibold">Features</th>
                    <th className="text-center p-4 font-semibold">Free</th>
                    <th className="text-center p-4 font-semibold">Premium</th>
                    <th className="text-center p-4 font-semibold">
                      Enterprise
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      category: "Client Management",
                      features: [
                        {
                          name: "Number of clients",
                          free: "3",
                          premium: "Unlimited",
                          enterprise: "Unlimited",
                        },
                        {
                          name: "Client profiles",
                          free: "✓",
                          premium: "✓",
                          enterprise: "✓",
                        },
                        {
                          name: "Client portal",
                          free: "✗",
                          premium: "✓",
                          enterprise: "✓",
                        },
                        {
                          name: "Client communication",
                          free: "Basic",
                          premium: "Advanced",
                          enterprise: "Advanced",
                        },
                      ],
                    },
                    {
                      category: "Project Management",
                      features: [
                        {
                          name: "Number of projects",
                          free: "5",
                          premium: "Unlimited",
                          enterprise: "Unlimited",
                        },
                        {
                          name: "Project tracking",
                          free: "Basic",
                          premium: "Advanced",
                          enterprise: "Advanced",
                        },
                        {
                          name: "Timeline management",
                          free: "✗",
                          premium: "✓",
                          enterprise: "✓",
                        },
                        {
                          name: "Team collaboration",
                          free: "✗",
                          premium: "✗",
                          enterprise: "✓",
                        },
                      ],
                    },
                    {
                      category: "Design Tools",
                      features: [
                        {
                          name: "Pattern designer",
                          free: "Basic",
                          premium: "Professional",
                          enterprise: "Professional",
                        },
                        {
                          name: "AI pattern generation",
                          free: "5/month",
                          premium: "Unlimited",
                          enterprise: "Unlimited",
                        },
                        {
                          name: "Pattern library",
                          free: "Basic",
                          premium: "Full",
                          enterprise: "Full + Custom",
                        },
                        {
                          name: "Design templates",
                          free: "5",
                          premium: "50+",
                          enterprise: "100+",
                        },
                      ],
                    },
                    {
                      category: "Business Features",
                      features: [
                        {
                          name: "Invoice generation",
                          free: "✗",
                          premium: "✓",
                          enterprise: "✓",
                        },
                        {
                          name: "Payment tracking",
                          free: "✗",
                          premium: "✓",
                          enterprise: "✓",
                        },
                        {
                          name: "Analytics dashboard",
                          free: "✗",
                          premium: "✓",
                          enterprise: "Advanced",
                        },
                        {
                          name: "Calendar scheduling",
                          free: "✗",
                          premium: "✓",
                          enterprise: "✓",
                        },
                      ],
                    },
                    {
                      category: "Support & Storage",
                      features: [
                        {
                          name: "File storage",
                          free: "100MB",
                          premium: "10GB",
                          enterprise: "100GB",
                        },
                        {
                          name: "Support",
                          free: "Email",
                          premium: "Priority",
                          enterprise: "Dedicated",
                        },
                        {
                          name: "Custom branding",
                          free: "✗",
                          premium: "✗",
                          enterprise: "✓",
                        },
                        {
                          name: "API access",
                          free: "✗",
                          premium: "✗",
                          enterprise: "✓",
                        },
                      ],
                    },
                  ].map((section) => (
                    <React.Fragment key={section.category}>
                      <tr className="bg-gray-25">
                        <td
                          colSpan={4}
                          className="p-4 font-semibold text-gray-900 bg-gray-100"
                        >
                          {section.category}
                        </td>
                      </tr>
                      {section.features.map((feature, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="p-4 text-gray-900">{feature.name}</td>
                          <td className="p-4 text-center">
                            {feature.free === "✓" ? (
                              <BiCheck className="h-5 w-5 text-green-600 mx-auto" />
                            ) : feature.free === "✗" ? (
                              <BiX className="h-5 w-5 text-gray-400 mx-auto" />
                            ) : (
                              <span className="text-sm">{feature.free}</span>
                            )}
                          </td>
                          <td className="p-4 text-center">
                            {feature.premium === "✓" ? (
                              <BiCheck className="h-5 w-5 text-green-600 mx-auto" />
                            ) : feature.premium === "✗" ? (
                              <BiX className="h-5 w-5 text-gray-400 mx-auto" />
                            ) : (
                              <span className="text-sm">{feature.premium}</span>
                            )}
                          </td>
                          <td className="p-4 text-center">
                            {feature.enterprise === "✓" ? (
                              <BiCheck className="h-5 w-5 text-green-600 mx-auto" />
                            ) : feature.enterprise === "✗" ? (
                              <BiX className="h-5 w-5 text-gray-400 mx-auto" />
                            ) : (
                              <span className="text-sm">
                                {feature.enterprise}
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* FAQ Section */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {faqs.map((faq, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-lg">{faq.question}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{faq.answer}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center space-y-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-12 text-white">
        <h2 className="text-3xl font-bold">
          Ready to Transform Your Fashion Business?
        </h2>
        <p className="text-xl opacity-90">
          Join thousands of fashion designers who trust Kunibi
        </p>
        <div className="flex justify-center gap-4">
          <Button className="py-2 px-3 rounded-lg bg-white text-purple-600 hover:bg-gray-100">
            Start Free Trial
          </Button>
          <Button className="border border-gray-300 py-2 px-3 rounded-lg text-white border-white hover:bg-white hover:text-purple-600 bg-transparent">
            Schedule Demo
          </Button>
        </div>
      </div>
    </div>
  );
}
