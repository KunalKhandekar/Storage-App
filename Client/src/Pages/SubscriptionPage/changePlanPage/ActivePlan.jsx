import { Check, Crown, Sparkles, Zap } from "lucide-react";

const ActivePlan = ({ activePlan }) => {
  const getIconForPlan = (planName) => {
    if (planName === "Pro") return Zap;
    if (planName === "Premium") return Crown;
    return Sparkles;
  };

  const CurrentIcon = getIconForPlan(activePlan.planName);
  return (
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
  );
};

export default ActivePlan;
