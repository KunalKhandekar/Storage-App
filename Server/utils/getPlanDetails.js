export const getPlanDetailsById = (planId) => {
  const plans = {
    plan_RWtFksDzZOsg2V: {
      id: "plan_RWtFksDzZOsg2V",
      name: "Pro",
      tagline: "For Students & Freelancers",
      price: 299,
      billingCycle: "monthly",
      features: [
        "200 GB secure storage",
        "File upload limit: 2 GB per file",
        "Access from up to 3 devices",
        "Priority upload/download speed",
        "Email & chat support",
      ],
      limits: {
        storage: "200 GB",
        storageBytes: 214748364800,
        maxFileSize: "2 GB",
        maxFileSizeBytes: 2147483648,
        maxDevices: 3,
      },
    },
    plan_RWtGxMLUNKVu35: {
      id: "plan_RWtGxMLUNKVu35",
      name: "Premium",
      tagline: "For Professionals & Creators",
      price: 699,
      billingCycle: "monthly",
      features: [
        "2 TB secure storage",
        "File upload limit: 10 GB per file",
        "Access from up to 3 devices",
        "Priority upload/download speed",
        "Priority customer support",
      ],
      limits: {
        storage: "2 TB",
        storageBytes: 2199023255552,
        maxFileSize: "10 GB",
        maxFileSizeBytes: 10737418240,
        maxDevices: 3,
      },
    },
    plan_RWtGEM0EVl0gJE: {
      id: "plan_RWtGEM0EVl0gJE",
      name: "Pro",
      tagline: "For Students & Freelancers",
      price: 2999,
      billingCycle: "yearly",
      features: [
        "200 GB secure storage",
        "File upload limit: 2 GB per file",
        "Access from up to 3 devices",
        "Priority upload/download speed",
        "Email & chat support",
      ],
      limits: {
        storage: "200 GB",
        storageBytes: 214748364800,
        maxFileSize: "2 GB",
        maxFileSizeBytes: 2147483648,
        maxDevices: 3,
      },
    },
    plan_RWtGgZRP6VnyUc: {
      id: "plan_RWtGgZRP6VnyUc",
      name: "Premium",
      tagline: "For Professionals & Creators",
      price: 6999,
      billingCycle: "yearly",
      features: [
        "2 TB secure storage",
        "File upload limit: 10 GB per file",
        "Access from up to 3 devices",
        "Priority upload/download speed",
        "Priority customer support",
      ],
      limits: {
        storage: "2 TB",
        storageBytes: 2199023255552,
        maxFileSize: "10 GB",
        maxFileSizeBytes: 10737418240,
        maxDevices: 3,
      },
    },
    // default plan limits
    default: {
      limits: {
        storage: "500 MB",
        storageBytes: 524288000,
        maxFileSize: "100 MB",
        maxFileSizeBytes: 104857600,
        maxDevices: 1,
      },
    },
  };

  return plans[planId] || null;
};

export const getPlansEligibleForChange = (activePlanId) => {
  const allPlanIds = [
    "plan_RWtFksDzZOsg2V",
    "plan_RWtGxMLUNKVu35",
    "plan_RWtGEM0EVl0gJE",
    "plan_RWtGgZRP6VnyUc",
  ];

  return allPlanIds.filter((planId) => planId !== activePlanId);
};
