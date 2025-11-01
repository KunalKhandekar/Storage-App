const _200GiB = 1024 * 1024 * 1024 * 200;
const _2TiB = 1024 * 1024 * 1024 * 1024 * 2;

export const getPlanDetailsById = (planId) => {
  const plans = {
    plan_Ra0GqWQ6p0ffYM: {
      name: "pro-monthly",
      maxStorageLimit: _200GiB,// 200 GB
      max_device: 0,
      file_limit: 0
    },
    plan_Ra0Hyby0MmmZyU: {
      name: "premium-monthly",
      maxStorageLimit: _2TiB, // 2 TB
    },
    plan_Ra0HCHX7tNXrQl: {
      name: "pro-yearly",
      maxStorageLimit: _200GiB, // 200 GB
    },
    plan_Ra0IGCFRabuW1y: {
      name: "premium-yearly",
      maxStorageLimit: _2TiB, // 2 TB
    },
  };

  return plans[planId] || null;
};

// console.log(getPlanDetailsById("plan_Ra0GqWQ6p0ffYM"));
