import { Check, Zap, Crown, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { handleCreateSubscription } from "../../Apis/paymentApi";

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState("yearly");
  const [loadingPlanId, setLoadingPlanId] = useState(null);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <span className="bg-blue-100 text-blue-700 text-sm font-semibold px-4 py-1.5 rounded-full max-[800px]:text-xs">
              Pricing Plans
            </span>
          </div>
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4 max-[800px]:text-2xl">
            Choose Your Perfect Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto max-[800px]:text-lg">
            Secure, reliable cloud storage for everyone. Start free, upgrade
            anytime.
          </p>

          {/* Billing Toggle */}
          <div className="mt-10 inline-flex items-center bg-white rounded-full p-1.5 shadow">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-8 py-3 rounded-full text-sm font-semibold transition-all duration-200 ${
                billingCycle === "monthly"
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-8 py-3 rounded-full text-sm font-semibold transition-all duration-200 relative ${
                billingCycle === "yearly"
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Yearly
            </button>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          {currentPlans.map((plan) => {
            const Icon = plan.icon;
            const isYearly = billingCycle === "yearly";

            return (
              <div
                key={plan.id}
                className={`relative bg-white rounded-3xl shadow overflow-hidden transition-all duration-300  ${
                  plan.popular ? "ring-2 ring-blue-500" : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1.5 text-xs font-bold rounded-bl-lg">
                    MOST POPULAR
                  </div>
                )}

                <div className="p-6">
                  {/* Plan Icon & Header */}
                  <div className="mb-5">
                    <div
                      className={`inline-flex p-2 rounded-xl mb-3 ${
                        plan.popular
                          ? "bg-gradient-to-br from-blue-100 to-purple-100"
                          : "bg-gray-100"
                      }`}
                    >
                      <Icon
                        className={`w-5 h-5 ${
                          plan.popular ? "text-blue-600" : "text-gray-600"
                        }`}
                      />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1.5">
                      {plan.name}
                    </h3>
                    <p className="text-xs font-semibold text-blue-600 mb-1.5">
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
                        <span className="text-4xl font-bold text-gray-900">
                          Free
                        </span>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-baseline mb-1.5">
                          <span className="text-4xl font-bold text-gray-900">
                            ₹{isYearly ? plan.monthlyEquivalent : plan.price}
                          </span>
                          <span className="text-gray-600 ml-1.5 text-base">
                            /month
                          </span>
                        </div>
                        {isYearly && (
                          <div>
                            <p className="text-xs text-gray-600">
                              Billed annually at ₹{plan.price}
                            </p>
                            <p className="text-xs text-green-600 font-semibold mt-0.5">
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
                    disabled={loadingPlanId === plan.id}
                    className={`w-full py-3 px-6 rounded-xl font-bold transition-all duration-200 mb-6 text-sm ${
                      plan.popular
                        ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl"
                        : "bg-gray-900 text-white hover:bg-gray-800 shadow-md hover:shadow-lg"
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
        <div className="text-center mt-12">
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
