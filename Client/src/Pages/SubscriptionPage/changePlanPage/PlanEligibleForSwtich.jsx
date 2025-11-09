import { ArrowRight, Calendar, Check } from "lucide-react";
import { openRazorpayPopup } from "../../../Utils/openRazorpayPopup";
import { changePlan } from "../../../Apis/subscriptionApi";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { monthlyPlans, yearlyPlans } from "../Plans";

const PlanEligibleForSwtich = ({ plansEligible, activePlan }) => {
  const [loadingPlanId, setLoadingPlanId] = useState(null);

  useEffect(() => {
    const razorpayScript = document.querySelector("#razorpay-script");
    if (razorpayScript) return;
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.id = "razorpay-script";
    document.body.appendChild(script);
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

  const PlansEligibleForSwitch = useMemo(() => {
    return [...monthlyPlans, ...yearlyPlans].filter((plan) =>
      plansEligible.includes(plan.id)
    );
  }, [plansEligible]);

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900">
          Available Plans to Switch To
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          {PlansEligibleForSwitch.length} plan
          {PlansEligibleForSwitch.length !== 1 ? "s" : ""} available for change
        </p>
      </div>

      {PlansEligibleForSwitch.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PlansEligibleForSwitch.map((plan) => {
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
  );
};

export default PlanEligibleForSwtich;
