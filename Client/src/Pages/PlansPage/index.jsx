import {
  Check,
  Zap,
  Crown,
  Sparkles,
  Calendar,
  CreditCard,
  Users,
  HardDrive,
  Upload,
  Share2,
  FileText,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  checkSubscriptionStatus,
  handleCreateSubscription,
} from "../../Apis/subscriptionApi";
import { formatFileSize } from "../../Utils/helpers";

const monthlyPlans = [
  {
    id: "free-monthly-001",
    name: "Free",
    tagline: "Starter Plan",
    bestFor: "Personal users who want to try the platform",
    price: 0,
    icon: Sparkles,
    features: [
      "5 GB secure storage",
      "File upload limit: 100 MB per file",
      "Basic sharing (link only)",
      "Access from 1 device",
      "Standard download speed",
      "Basic email support",
    ],
  },
  {
    id: "plan_Ra0GqWQ6p0ffYM",
    name: "Pro",
    tagline: "For Students & Freelancers",
    bestFor: "Students, freelancers, or small teams who need more space",
    price: 299,
    icon: Zap,
    features: [
      "200 GB secure storage",
      "File upload limit: 2 GB per file",
      "Password-protected sharing links",
      "Access from up to 3 devices",
      "Priority upload/download speed",
      "Email & chat support",
    ],
    popular: true,
  },
  {
    id: "plan_Ra0Hyby0MmmZyU",
    name: "Premium",
    tagline: "For Professionals & Creators",
    bestFor: "Professionals and creators handling large media files",
    price: 699,
    icon: Crown,
    features: [
      "2 TB secure storage",
      "File upload limit: 10 GB per file",
      "Password-protected sharing links",
      "Access from up to 3 devices",
      "Priority upload/download speed",
      "Priority customer support",
    ],
  },
];

const yearlyPlans = [
  {
    id: "free-yearly-001",
    name: "Free",
    tagline: "Starter Plan",
    bestFor: "Personal users who want to try the platform",
    price: 0,
    icon: Sparkles,
    features: [
      "5 GB secure storage",
      "File upload limit: 100 MB per file",
      "Basic sharing (link only)",
      "Access from 1 device",
      "Standard download speed",
      "Basic email support",
    ],
  },
  {
    id: "plan_Ra0HCHX7tNXrQl",
    name: "Pro",
    tagline: "For Students & Freelancers",
    bestFor: "Students, freelancers, or small teams who need more space",
    price: 2999,
    monthlyEquivalent: 249,
    originalMonthly: 299,
    icon: Zap,
    features: [
      "200 GB secure storage",
      "File upload limit: 2 GB per file",
      "Password-protected sharing links",
      "Access from up to 3 devices",
      "Priority upload/download speed",
      "Email & chat support",
    ],
    popular: true,
  },
  {
    id: "plan_Ra0IGCFRabuW1y",
    name: "Premium",
    tagline: "For Professionals & Creators",
    bestFor: "Professionals and creators handling large media files",
    price: 6999,
    monthlyEquivalent: 583,
    originalMonthly: 699,
    icon: Crown,
    features: [
      "2 TB secure storage",
      "File upload limit: 10 GB per file",
      "Password-protected sharing links",
      "Access from up to 3 devices",
      "Priority upload/download speed",
      "Priority customer support",
    ],
  },
];

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState("yearly");
  const [loadingPlanId, setLoadingPlanId] = useState(null);
  const [hasActivePlan, setHasActivePlan] = useState(false);
  const [subscriptionDetails, setSubscriptionDetails] = useState(null);
  const [userUsage, setUserUsage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleSubscriptionStatus = async () => {
      setLoading(true);
      const res = await checkSubscriptionStatus();
      if (res.success) {
        setHasActivePlan(true);
        setSubscriptionDetails(res.data.subscription);
        setUserUsage(res.data.usage);
      } else {
        console.log(res.message);
      }
      setLoading(false);
    };
    handleSubscriptionStatus();
  }, []);

  const currentPlans = billingCycle === "monthly" ? monthlyPlans : yearlyPlans;

  useEffect(() => {
    const razorpayScript = document.querySelector("#razorpay-script");
    if (razorpayScript) return;
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.id = "razorpay-script";
    document.body.appendChild(script);
  }, []);

  const handleSubmit = async (planId, price) => {
    if (price === 0) {
      console.log("Free plan selected");
      return;
    }

    setLoadingPlanId(planId);
    try {
      const res = await handleCreateSubscription(planId);
      const subscriptionId = res.data.subscriptionId;
      openRazorpayPopup({ subscriptionId });
      setLoadingPlanId(null);
    } catch (error) {
      console.error("Subscription error:", error);
      setLoadingPlanId(null);
    }
  };

  if (loading)
    return (
      <div className="w-full h-screen flex justify-center items-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );

  if (hasActivePlan) {
    const Icon = subscriptionDetails.planName === "Pro" ? Zap : Crown;

    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Your Subscription
            </h1>
            <p className="text-gray-600 text-sm">
              Manage your plan and view usage details
            </p>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Current Plan Card */}
            <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="inline-flex items-center gap-2 bg-green-50 px-3 py-1 rounded-full mb-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs font-medium text-green-700">
                      {subscriptionDetails.status.toUpperCase()}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">
                    {subscriptionDetails?.planName || "Premium"} Plan
                  </h2>
                  <p className="text-gray-600 text-sm">
                    {subscriptionDetails?.planTagLine || "Professional Plan"}
                  </p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <Icon className="w-6 h-6 text-blue-600" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <p className="text-xs text-gray-500 font-medium">
                      Next Billing
                    </p>
                  </div>
                  <p className="text-lg font-semibold text-gray-900">
                    {new Date(
                      subscriptionDetails.nextBillingDate
                    ).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    in {subscriptionDetails.daysUntilRenewal} days
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                  <div className="flex items-center gap-2 mb-2">
                    <CreditCard className="w-4 h-4 text-gray-500" />
                    <p className="text-xs text-gray-500 font-medium">
                      Billing Amount
                    </p>
                  </div>
                  <p className="text-lg font-semibold text-gray-900">
                    ₹{subscriptionDetails.planPrice || "0"}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {/* Capitalizing */}
                    {subscriptionDetails.billingCycle[0].toUpperCase() +
                      subscriptionDetails.billingCycle.slice(1)}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                  Change Plan
                </button>
                <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
                  View Billing History
                </button>
                <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
                  Cancel Subscription
                </button>
              </div>
            </div>

            {/* Storage Usage Card */}
            <div className="bg-white rounded-lg border border-gray-200  p-6">
              <div className="flex items-center gap-2 mb-4">
                <HardDrive className="w-5 h-5 text-gray-700" />
                <h3 className="text-base font-semibold text-gray-900">
                  Storage Usage
                </h3>
              </div>
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-2xl font-bold text-gray-900">
                    {formatFileSize(userUsage.storageUsed)}
                  </span>
                  <span className="text-sm text-gray-500">
                    of {formatFileSize(userUsage.storageTotal)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${userUsage.storagePercentage}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {userUsage.storagePercentage}% used
                </p>
              </div>

              <div className="space-y-3 pt-4 border-t border-gray-200">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-lg p-3 border border-blue-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="bg-blue-600 rounded-full p-1">
                        <Zap className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        Priority Speed
                      </span>
                    </div>
                    <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full font-medium">
                      Active
                    </span>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500 font-medium">
                      Max File Size
                    </span>
                    <span className="text-sm font-semibold text-gray-900">
                      {userUsage.maxFileUploadSize}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">Per file upload limit</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg border border-gray-200  p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="bg-blue-50 p-2 rounded-lg">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-1">
                {userUsage.totalFiles}
              </p>
              <p className="text-sm text-gray-600">Total Files</p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200  p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="bg-green-50 p-2 rounded-lg">
                  <Share2 className="w-5 h-5 text-green-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-1">
                {userUsage.sharedFiles}
              </p>
              <p className="text-sm text-gray-600">Shared Files</p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200  p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="bg-purple-50 p-2 rounded-lg">
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-1">
                {userUsage.devicesConnected} / {userUsage.maxDevices}
              </p>
              <p className="text-sm text-gray-600">Devices Connected</p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200  p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="bg-orange-50 p-2 rounded-lg">
                  <Upload className="w-5 h-5 text-orange-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-1">
                {userUsage.filesUploadedThisMonth}
              </p>
              <p className="text-sm text-gray-600">Files Uploaded This Month</p>
            </div>
          </div>

          {/* Plan Features */}
          <div className="bg-white rounded-lg border border-gray-200  p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-5">
              Your Plan Includes
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {subscriptionDetails.features.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    <div className="bg-green-50 rounded-full p-1">
                      <Check className="w-3.5 h-3.5 text-green-600" />
                    </div>
                  </div>
                  <span className="text-sm text-gray-700">{feature}</span>
                </div>
              ))}
            </div>

            {subscriptionDetails.planName !== "Premium" && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-3">
                  Want more storage and features?
                </p>
                <button className="px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                  Upgrade to Premium
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
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
                key={plan.id}
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
                    onClick={() => handleSubmit(plan.id, plan.price)}
                    disabled={loadingPlanId === plan.id || isCurrentPlan}
                    className={`w-full py-2.5 px-6 rounded-lg font-medium transition-all text-sm mb-6 ${
                      isCurrentPlan
                        ? "bg-green-600 text-white cursor-default"
                        : plan.popular
                        ? "bg-blue-600 text-white hover:bg-blue-700 "
                        : "bg-gray-900 text-white hover:bg-gray-800 "
                    } ${
                      loadingPlanId === plan.id &&
                      "opacity-60 cursor-not-allowed"
                    }`}
                  >
                    {loadingPlanId === plan.id ? (
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
  );
}

function openRazorpayPopup({ subscriptionId }) {
  console.log(subscriptionId);
  const rzp = new Razorpay({
    key: "rzp_test_Ra0B5WI7uIwO1z",
    description: "testing the plans",
    name: "Storage App",
    subscription_id: subscriptionId,
    image: "https://dzdw2zccyu2wu.cloudfront.net/overview/readme-typing.svg",
    handler: async function (response) {
      console.log(response);
    },
  });

  rzp.on("payment.failed", function (response) {
    console.log(response);
  });

  rzp.open();
}
