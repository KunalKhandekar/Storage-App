export function getPlanChangeType(currentPlan, desirePlan) {
  if (!currentPlan || !desirePlan) return "invalid";

  // Pro -> Premium
  const isUpgrade =
    currentPlan.name === "Pro" && desirePlan.name === "Premium";

// Premium -> Pro
  const isDowngrade =
    currentPlan.name === "Premium" && desirePlan.name === "Pro";

  const isBillingCycleChange =
    currentPlan.name === desirePlan.name &&
    currentPlan.billingCycle !== desirePlan.billingCycle;

  if (isUpgrade) return "upgrade";
  if (isDowngrade) return "downgrade";
  if (isBillingCycleChange) return "cycle-change";

  // same plan & same billing cycle (edge-case)
  if (
    currentPlan.name === desirePlan.name &&
    currentPlan.billingCycle === desirePlan.billingCycle
  ) {
    return "no-change";
  }

  return "unknown";
}
