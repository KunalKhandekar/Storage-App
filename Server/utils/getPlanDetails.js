const _200GiB = 1024 * 1024 * 1024 * 200;
const _2TiB = 1024 * 1024 * 1024 * 1024 * 2;

export const getPlanDetailsById = (planId) => {
  const plans = {
    plan_Ra0GqWQ6p0ffYM: {
      name: "Pro",
      tagline: "For Students & Freelancers",
      price: 299,
      billingCycle: "monthly",
      features: [
        "200 GB secure storage",
        "File upload limit: 2 GB per file",
        "Password-protected sharing links",
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
    plan_Ra0Hyby0MmmZyU: {
      name: "Premium",
      tagline: "For Professionals & Creators",
      price: 699,
      billingCycle: "monthly",
      features: [
        "2 TB secure storage",
        "File upload limit: 10 GB per file",
        "Password-protected sharing links",
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
    plan_Ra0HCHX7tNXrQl: {
      name: "Pro",
      tagline: "For Students & Freelancers",
      price: 2999,
      billingCycle: "yearly",
      features: [
        "200 GB secure storage",
        "File upload limit: 2 GB per file",
        "Password-protected sharing links",
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
    plan_Ra0IGCFRabuW1y: {
      name: "Premium",
      tagline: "For Professionals & Creators",
      price: 6999,
      billingCycle: "yearly",
      features: [
        "2 TB secure storage",
        "File upload limit: 10 GB per file",
        "Password-protected sharing links",
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
  };

  return plans[planId] || null;
};

// console.log(getPlanDetailsById("plan_Ra0GqWQ6p0ffYM"));

// "plans": {
//     "monthly": [
//       {
//         "id": "free-monthly-001",
//         "name": "Free",
//         "tagline": "Starter Plan",
//         "bestFor": "Personal users who want to try the platform",
//         "price": 0,
//         "billingCycle": "monthly",
//         "icon": "Sparkles",
//         "popular": false,
//         "features": [
//           "5 GB secure storage",
//           "File upload limit: 100 MB per file",
//           "Basic sharing (link only)",
//           "Access from 1 device",
//           "Standard download speed",
//           "Basic email support"
//         ],
//         "limits": {
//           "storage": "5 GB",
//           "storageBytes": 5368709120,
//           "maxFileSize": "100 MB",
//           "maxFileSizeBytes": 104857600,
//           "maxDevices": 1,
//           "uploadSpeed": "standard",
//           "downloadSpeed": "standard"
//         }
//       },
//
//       },
//     ],
//     "yearly": [
//       {
//         "id": "free-yearly-001",
//         "name": "Free",
//         "tagline": "Starter Plan",
//         "bestFor": "Personal users who want to try the platform",
//         "price": 0,
//         "billingCycle": "yearly",
//         "icon": "Sparkles",
//         "popular": false,
//         "monthlyEquivalent": null,
//         "originalMonthly": null,
//         "savings": null,
//         "features": [
//           "5 GB secure storage",
//           "File upload limit: 100 MB per file",
//           "Basic sharing (link only)",
//           "Access from 1 device",
//           "Standard download speed",
//           "Basic email support"
//         ],
//         "limits": {
//           "storage": "5 GB",
//           "storageBytes": 5368709120,
//           "maxFileSize": "100 MB",
//           "maxFileSizeBytes": 104857600,
//           "maxDevices": 1,
//           "uploadSpeed": "standard",
//           "downloadSpeed": "standard"
//         }
//       },
//       {
//         "id": "plan_Ra0HCHX7tNXrQl",
//         "name": "Pro",
//         "tagline": "For Students & Freelancers",
//         "bestFor": "Students, freelancers, or small teams who need more space",
//         "price": 2999,
//         "billingCycle": "yearly",
//         "icon": "Zap",
//         "popular": true,
//         "monthlyEquivalent": 249,
//         "originalMonthly": 299,
//         "savings": 589,
//         "features": [
//           "200 GB secure storage",
//           "File upload limit: 2 GB per file",
//           "Password-protected sharing links",
//           "Access from up to 3 devices",
//           "Priority upload/download speed",
//           "Email & chat support"
//         ],
//         "limits": {
//           "storage": "200 GB",
//           "storageBytes": 214748364800,
//           "maxFileSize": "2 GB",
//           "maxFileSizeBytes": 2147483648,
//           "maxDevices": 3,
//           "uploadSpeed": "priority",
//           "downloadSpeed": "priority"
//         }
//       },
//       {
//         "id": "plan_Ra0IGCFRabuW1y",
//         "name": "Premium",
//         "tagline": "For Professionals & Creators",
//         "bestFor": "Professionals and creators handling large media files",
//         "price": 6999,
//         "billingCycle": "yearly",
//         "icon": "Crown",
//         "popular": false,
//         "monthlyEquivalent": 583,
//         "originalMonthly": 699,
//         "savings": 1389,
//         "features": [
//           "2 TB secure storage",
//           "File upload limit: 10 GB per file",
//           "Password-protected sharing links",
//           "Access from up to 3 devices",
//           "Priority upload/download speed",
//           "Priority customer support"
//         ],
//         "limits": {
//           "storage": "2 TB",
//           "storageBytes": 2199023255552,
//           "maxFileSize": "10 GB",
//           "maxFileSizeBytes": 10737418240,
//           "maxDevices": 3,
//           "uploadSpeed": "priority",
//           "downloadSpeed": "priority"
//         }
//       }
//     ]
//   },
