import {
  ArrowRight,
  Calendar,
  Check,
  Crown,
  Sparkles,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  changePlan,
  plansEligibleforChange,
} from "../../../Apis/subscriptionApi";
import { openRazorpayPopup } from "../../../Utils/openRazorpayPopup";
import { monthlyPlans, yearlyPlans } from "../index";

const ChangePlan = () => {
  const [activePlan, setActivePlan] = useState(null);
  const [plansEligible, setPlansEligible] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingPlanId, setLoadingPlanId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const razorpayScript = document.querySelector("#razorpay-script");
    if (razorpayScript) return;
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.id = "razorpay-script";
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    const handleCheckEligibility = async () => {
      setLoading(true);
      const res = await plansEligibleforChange();
      if (res.success) {
        setActivePlan(res.data.activeSubscription);
        setPlansEligible(res.data.EligiblePlanIds);
      } else {
        toast.error(res.message);
        navigate("/plans");
      }
      setLoading(false);
    };
    handleCheckEligibility();
  }, []);

  const handleChangePlan = async (planId) => {
    setLoadingPlanId(planId);
    const res = await changePlan(planId);
    if (res.success) {
      openRazorpayPopup({ subscriptionId: res.data.newSubscriptionId });
    } else {
      toast.error(res.message);
    }
    setLoadingPlanId(null);
  };

  const canChangePlanTo = useMemo(() => {
    return [...monthlyPlans, ...yearlyPlans].filter((plan) =>
      plansEligible.includes(plan.id)
    );
  }, [plansEligible]);

  const getIconForPlan = (planName) => {
    if (planName === "Pro") return Zap;
    if (planName === "Premium") return Crown;
    return Sparkles;
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const currentPlanIcon = getIconForPlan(activePlan?.planName);
  const CurrentIcon = currentPlanIcon;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Change Your Plan
          </h1>
          <p className="text-gray-600 text-sm">
            Upgrade or downgrade your plan anytime. We don't offer prorated charges for plan changes.
          </p>
        </div>

        {/* Current Plan Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full mb-4">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-xs font-medium text-blue-700">
                CURRENT PLAN
              </span>
            </div>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  {activePlan?.planName} Plan
                </h2>
                <p className="text-gray-600 text-sm mb-4">
                  {activePlan?.planTagLine}
                </p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <CurrentIcon className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 pb-6 border-b border-gray-200">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-500 font-medium mb-2">
                Billing Amount
              </p>
              <p className="text-lg font-semibold text-gray-900">
                ₹{activePlan?.planPrice}
              </p>
              <p className="text-xs text-gray-500 mt-1 capitalize">
                {activePlan?.billingCycle}
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-500 font-medium mb-2">
                Next Billing Date
              </p>
              <p className="text-lg font-semibold text-gray-900">
                {activePlan?.nextBillingDate
                  ? new Date(activePlan.nextBillingDate).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      }
                    )
                  : "N/A"}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                in {activePlan?.daysUntilRenewal} days
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700 mb-3">
              Current Features:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {activePlan?.features?.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Info Banner */}
        <div className="my-6 bg-blue-50 rounded-lg border border-blue-200 p-4">
          <p className="text-sm text-blue-900 flex gap-2">
            <svg
              className="w-5 h-5 flex-shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <span>
              Your new plan starts today! You'll be billed the full amount
              immediately. We don't offer prorated charges for plan changes.
            </span>
          </p>
        </div>

        {/* Available Plans Section */}
        <div>
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-900">
              Available Plans to Switch To
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {canChangePlanTo.length} plan
              {canChangePlanTo.length !== 1 ? "s" : ""} available for change
            </p>
          </div>

          {canChangePlanTo.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {canChangePlanTo.map((plan) => {
                const Icon = plan.icon;
                const isUpgrade =
                  activePlan?.planName === "Pro" && plan.name === "Premium";
                const isDowngrade =
                  activePlan?.planName === "Premium" && plan.name !== "Premium";

                return (
                  <div
                    key={plan.id}
                    className={`bg-white rounded-lg border transition-all ${
                      isUpgrade
                        ? "border-green-500 shadow-lg"
                        : isDowngrade
                        ? "border-orange-300"
                        : "border-blue-400"
                    }`}
                  >
                    <div className="p-6">
                      {/* Plan Icon & Header */}
                      <div className="mb-5">
                        <div className="inline-flex p-2 rounded-lg mb-3 bg-gray-100">
                          <Icon className="w-5 h-5 text-gray-600" />
                        </div>
                        <h4 className="text-lg font-bold text-gray-900 mb-1">
                          {plan.name}
                        </h4>
                        <p className="text-xs font-medium text-blue-600 mb-1">
                          {plan.tagline}
                        </p>
                      </div>

                      {/* Price */}
                      <div className="mb-6 pb-6 border-b border-gray-200">
                        {plan.price === 0 ? (
                          <div className="flex items-baseline">
                            <span className="text-2xl font-bold text-gray-900">
                              Free
                            </span>
                          </div>
                        ) : (
                          <div>
                            <div className="flex items-baseline mb-1">
                              <span className="text-2xl font-bold text-gray-900">
                                ₹{plan.price}
                              </span>
                              <span className="text-gray-600 ml-1 text-sm">
                                /{plan.billingCycle || "month"}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Change Button */}
                      <button
                        onClick={() => handleChangePlan(plan.id)}
                        disabled={loadingPlanId === plan.id}
                        className={`w-full py-2.5 px-6 rounded-lg font-medium transition-all text-sm mb-6 flex items-center justify-center gap-2 ${
                          isUpgrade
                            ? "bg-green-600 text-white hover:bg-green-700"
                            : isDowngrade
                            ? "bg-orange-600 text-white hover:bg-orange-700"
                            : "bg-blue-600 text-white hover:bg-blue-700"
                        } ${
                          loadingPlanId === plan.id &&
                          "opacity-60 cursor-not-allowed"
                        }`}
                      >
                        {loadingPlanId === plan.id ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Processing...</span>
                          </>
                        ) : isUpgrade ? (
                          <>
                            <ArrowRight className="w-4 h-4" />
                            <span>Upgrade Plan</span>
                          </>
                        ) : isDowngrade ? (
                          <>
                            <ArrowRight className="w-4 h-4" />
                            <span>Downgrade Plan</span>
                          </>
                        ) : (
                          <>
                            <ArrowRight className="w-4 h-4" />
                            <span>Change Plan</span>
                          </>
                        )}
                      </button>

                      {/* Features */}
                      <div className="space-y-2">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                          Includes
                        </p>
                        {plan.features.slice(0, 4).map((feature, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <Check className="w-3.5 h-3.5 text-green-500 flex-shrink-0 mt-0.5" />
                            <span className="text-xs text-gray-700 leading-relaxed">
                              {feature}
                            </span>
                          </div>
                        ))}
                        {plan.features.length > 4 && (
                          <p className="text-xs text-gray-500 italic mt-2">
                            +{plan.features.length - 4} more features
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
              <div className="inline-flex p-3 rounded-full bg-gray-100 mb-4">
                <Calendar className="w-6 h-6 text-gray-400" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                No Plans Available for Change
              </h4>
              <p className="text-gray-600 text-sm">
                You may be eligible to change your plan after your next billing
                cycle. Please check back later.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChangePlan;
