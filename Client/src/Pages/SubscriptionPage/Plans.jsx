import { Check, Crown, Sparkles, Zap } from "lucide-react";
import { useState } from "react";
import { handleCreateSubscription } from "../../Apis/subscriptionApi";
import { useAuth } from "../../Contexts/AuthContext";
import RedirectModal from "../../components/Modals/RedirectModal";

export const monthlyPlans = [
  {
    id: {
      test: "free-monthly-001",
      live: "free-monthly-001",
    },
    name: "Free",
    tagline: "Starter Plan",
    bestFor: "Personal users who want to try the platform",
    billingCycle: "Month",
    price: 0,
    icon: Sparkles,
    features: [
      "500 MB secure storage",
      "File upload limit: 100 MB per file",
      "Access from 1 device",
      "Standard download speed",
      "Basic email support",
    ],
  },
  {
    id: {
      test: "plan_Ra0GqWQ6p0ffYM",
      live: "plan_RWtFksDzZOsg2V",
    },
    name: "Pro",
    billingCycle: "Month",
    tagline: "For Students & Freelancers",
    bestFor: "Students, freelancers, or small teams who need more space",
    price: 299,
    icon: Zap,
    features: [
      "200 GB secure storage",
      "File upload limit: 2 GB per file",
      "Access from up to 3 devices",
      "Priority upload/download speed",
      "Email & chat support",
    ],
    popular: true,
  },
  {
    id: {
      test: "plan_Ra0Hyby0MmmZyU",
      live: "plan_RWtGxMLUNKVu35",
    },
    name: "Premium",
    billingCycle: "Month",
    tagline: "For Professionals & Creators",
    bestFor: "Professionals and creators handling large media files",
    price: 699,
    icon: Crown,
    features: [
      "2 TB secure storage",
      "File upload limit: 10 GB per file",
      "Access from up to 3 devices",
      "Priority upload/download speed",
      "Priority customer support",
    ],
  },
];

export const yearlyPlans = [
  {
    id: {
      test: "free-yearly-001",
      live: "free-yearly-001",
    },
    name: "Free",
    billingCycle: "Year",
    tagline: "Starter Plan",
    bestFor: "Personal users who want to try the platform",
    price: 0,
    icon: Sparkles,
    features: [
      "500 MB secure storage",
      "File upload limit: 100 MB per file",
      "Access from 1 device",
      "Standard download speed",
      "Basic email support",
    ],
  },
  {
    id: {
      test: "plan_Ra0HCHX7tNXrQl",
      live: "plan_RWtGEM0EVl0gJE",
    },
    name: "Pro",
    billingCycle: "Year",
    tagline: "For Students & Freelancers",
    bestFor: "Students, freelancers, or small teams who need more space",
    price: 2999,
    monthlyEquivalent: 249,
    originalMonthly: 299,
    icon: Zap,
    features: [
      "200 GB secure storage",
      "File upload limit: 2 GB per file",
      "Access from up to 3 devices",
      "Priority upload/download speed",
      "Email & chat support",
    ],
    popular: true,
  },
  {
    id: {
      test: "plan_Ra0IGCFRabuW1y",
      live: "plan_RWtGgZRP6VnyUc",
    },
    name: "Premium",
    billingCycle: "Year",
    tagline: "For Professionals & Creators",
    bestFor: "Professionals and creators handling large media files",
    price: 6999,
    monthlyEquivalent: 583,
    originalMonthly: 699,
    icon: Crown,
    features: [
      "2 TB secure storage",
      "File upload limit: 10 GB per file",
      "Access from up to 3 devices",
      "Priority upload/download speed",
      "Priority customer support",
    ],
  },
];

const Plans = ({ hasActivePlan }) => {
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [loadingPlanId, setLoadingPlanId] = useState(null);
  const [showRedirectModal, setShowRedirectModal] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState("");
  const { user } = useAuth();
  const razorpayMode = user?.razorpayMode;

  const handleSubmit = async (planId) => {
    setLoadingPlanId(planId);
    try {
      const res = await handleCreateSubscription(planId);
      const subscriptionId = res.data.subscriptionId;
      const url = `https://payments.kunalkhandekar.me?subscriptionId=${subscriptionId}&userId=${user._id}`;
      setRedirectUrl(url);
      setShowRedirectModal(true);
      setLoadingPlanId(null);
    } catch (error) {
      console.error("Subscription error:", error);
      setLoadingPlanId(null);
    }
  };

  const handleCloseModal = () => {
    setShowRedirectModal(false);
    setRedirectUrl("");
  };

  const currentPlans = billingCycle === "monthly" ? monthlyPlans : yearlyPlans;

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              Choose Your Perfect Plan
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Secure, reliable cloud storage for everyone. Start free, upgrade
              anytime.
            </p>

            {/* Billing Toggle */}
            <div className="mt-8 inline-flex items-center bg-white rounded-lg p-1  border border-gray-200">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                  billingCycle === "monthly"
                    ? "bg-blue-600 text-white "
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle("yearly")}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                  billingCycle === "yearly"
                    ? "bg-blue-600 text-white "
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Yearly
              </button>
            </div>
          </div>

          {/* Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
            {currentPlans.map((plan) => {
              const Icon = plan.icon;
              const isYearly = billingCycle === "yearly";
              const isFreePlan = plan.price === 0;
              const isCurrentPlan = !hasActivePlan && isFreePlan;

              return (
                <div
                  key={plan.id[razorpayMode]}
                  className={`relative bg-white rounded-lg border  overflow-hidden transition-all ${
                    plan.popular
                      ? "border-blue-500 ring-2 ring-blue-500"
                      : isCurrentPlan
                      ? "border-green-500 ring-2 ring-green-500"
                      : "border-gray-200"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute top-0 right-0 bg-blue-600 text-white px-3 py-1 text-xs font-semibold rounded-bl-lg">
                      MOST POPULAR
                    </div>
                  )}

                  {isCurrentPlan && (
                    <div className="absolute top-0 right-0 bg-green-600 text-white px-3 py-1 text-xs font-semibold rounded-bl-lg flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      CURRENT PLAN
                    </div>
                  )}

                  <div className="p-6">
                    {/* Plan Icon & Header */}
                    <div className="mb-5">
                      <div
                        className={`inline-flex p-2 rounded-lg mb-3 ${
                          plan.popular
                            ? "bg-blue-50"
                            : isCurrentPlan
                            ? "bg-green-50"
                            : "bg-gray-100"
                        }`}
                      >
                        <Icon
                          className={`w-5 h-5 ${
                            plan.popular
                              ? "text-blue-600"
                              : isCurrentPlan
                              ? "text-green-600"
                              : "text-gray-600"
                          }`}
                        />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {plan.name}
                      </h3>
                      <p className="text-xs font-medium text-blue-600 mb-1.5">
                        {plan.tagline}
                      </p>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        {plan.bestFor}
                      </p>
                    </div>

                    {/* Price */}
                    <div className="mb-6 pb-6 border-b border-gray-200">
                      {plan.price === 0 ? (
                        <div className="flex items-baseline">
                          <span className="text-3xl font-bold text-gray-900">
                            Free
                          </span>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-baseline mb-1">
                            <span className="text-3xl font-bold text-gray-900">
                              ₹{isYearly ? plan.monthlyEquivalent : plan.price}
                            </span>
                            <span className="text-gray-600 ml-1 text-sm">
                              /month
                            </span>
                          </div>
                          {isYearly && (
                            <div>
                              <p className="text-xs text-gray-600">
                                Billed annually at ₹{plan.price}
                              </p>
                              <p className="text-xs text-green-600 font-medium mt-0.5">
                                Save ₹{plan.originalMonthly * 12 - plan.price} per
                                year
                              </p>
                            </div>
                          )}
                        </>
                      )}
                    </div>

                    {/* CTA Button */}
                    <button
                      onClick={() => handleSubmit(plan.id[razorpayMode])}
                      disabled={
                        loadingPlanId === plan.id[razorpayMode] || isCurrentPlan
                      }
                      className={`w-full py-2.5 px-6 rounded-lg font-medium transition-all text-sm mb-6 ${
                        isCurrentPlan
                          ? "bg-green-600 text-white cursor-default"
                          : plan.popular
                          ? "bg-blue-600 text-white hover:bg-blue-700 "
                          : "bg-gray-900 text-white hover:bg-gray-800 "
                      } ${
                        loadingPlanId === plan.id[razorpayMode] &&
                        "opacity-60 cursor-not-allowed"
                      }`}
                    >
                      {loadingPlanId === plan.id[razorpayMode] ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Processing...</span>
                        </div>
                      ) : isCurrentPlan ? (
                        <div className="flex items-center justify-center gap-2">
                          <Check className="w-4 h-4" />
                          <span>Current Plan</span>
                        </div>
                      ) : plan.price === 0 ? (
                        "Get Started Free"
                      ) : (
                        "Subscribe Now"
                      )}
                    </button>

                    {/* Features */}
                    <div className="space-y-3">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                        What's Included
                      </p>
                      {plan.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start">
                          <div className="flex-shrink-0 mt-0.5">
                            <Check className="w-4 h-4 text-green-500" />
                          </div>
                          <span className="ml-2.5 text-xs text-gray-700 leading-relaxed">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer Note */}
          <div className="text-center mt-8">
            <p className="text-sm text-gray-500">
              All plans include automatic backups and can be cancelled anytime
            </p>
          </div>
        </div>
      </div>

      {/* Redirect Modal */}
      <RedirectModal
        isOpen={showRedirectModal}
        onClose={handleCloseModal}
        redirectUrl={redirectUrl}
      />
    </>
  );
};

export default Plans;