import { useEffect, useState, useCallback } from "react";
import {
  cancelSubscription,
  checkSubscriptionStatus,
} from "../../Apis/subscriptionApi";
import ActiveSubscription from "./ActiveSubscription";
import Plans from "./Plans";
import RenewalFailed from "./RenewalFailed";
import Loader from "../../components/Loader";

export default function SubscriptionPage() {
  const [state, setState] = useState({
    subscription: null,
    usage: null,
    renewalFailed: false,
    hasActivePlan: false,
    loading: true,
  });

  const handleSubscriptionStatus = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true }));

    try {
      const res = await checkSubscriptionStatus();

      if (res.success) {
        setState({
          subscription: res.data.subscription,
          usage: res.data.usage,
          hasActivePlan: true,
          renewalFailed: false,
          loading: false,
        });
      } else {
        setState({
          subscription: null,
          usage: null,
          hasActivePlan: false,
          renewalFailed: res.details === "renewal_failed",
          loading: false,
        });
      }
    } catch (error) {
      console.error("Error checking subscription status:", error);
      setState((prev) => ({ ...prev, loading: false }));
    }
  }, []);

  useEffect(() => {
    handleSubscriptionStatus();
  }, [handleSubscriptionStatus]);

  const handleCancelSubscription = useCallback(async () => {
    try {
      const res = await cancelSubscription();

      if (res.success) {
        setState({
          subscription: null,
          usage: null,
          hasActivePlan: false,
          renewalFailed: false,
          loading: false,
        });
      } else {
        console.error("Cancel subscription failed:", res.message);
      }
    } catch (error) {
      console.error("Error in handling cancel Subscription:", error);
    }
  }, []);

  if (state.loading) {
    return (
      <Loader />
    );
  }

  if (state.hasActivePlan) {
    return (
      <ActiveSubscription
        handleCancelSubscription={handleCancelSubscription}
        subscriptionDetails={state.subscription}
        userUsage={state.usage}
      />
    );
  }

  if (state.renewalFailed) {
    return <RenewalFailed />;
  }

  return <Plans hasActivePlan={state.hasActivePlan} />;
}
