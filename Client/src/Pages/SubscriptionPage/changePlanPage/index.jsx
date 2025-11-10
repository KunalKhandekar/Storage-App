import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { plansEligibleforChange } from "../../../Apis/subscriptionApi";
import ActivePlan from "./ActivePlan";
import PlanEligibleForSwtich from "./PlanEligibleForSwtich";
import { Loader } from "lucide-react";

const ChangePlan = () => {
  const [activePlan, setActivePlan] = useState(null);
  const [plansEligible, setPlansEligible] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchEligiblePlans = useCallback(async () => {
    try {
      setLoading(true);
      const res = await plansEligibleforChange();
      if (res.success) {
        setActivePlan(res.data.activeSubscription);
        setPlansEligible(res.data.EligiblePlanIds);
      } else {
        toast.error(res.message || "Failed to load eligible plans");
        navigate("/plans", { replace: true });
      }
    } catch (error) {
      console.error("Error fetching eligible plans:", error);
      toast.error("An error occurred while loading plans");
      navigate("/plans", { replace: true });
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchEligiblePlans();
  }, [fetchEligiblePlans]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Change Your Plan
          </h1>
          <p className="text-gray-600 text-sm">
            Upgrade or downgrade your plan anytime. We don't offer prorated
            charges for plan changes.
          </p>
        </div>

        {/* Current Plan Section */}
        <ActivePlan activePlan={activePlan} />

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
        <PlanEligibleForSwtich
          activePlan={activePlan}
          plansEligible={plansEligible}
        />
      </div>
    </div>
  );
};

export default ChangePlan;
