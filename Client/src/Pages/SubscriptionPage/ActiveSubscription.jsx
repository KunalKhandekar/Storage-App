import { Calendar, Check, CreditCard, Crown, FileText, HardDrive, Share2, Upload, Users, Zap } from "lucide-react";
import { formatFileSize } from "../../Utils/helpers";
import { useNavigate } from "react-router-dom";
import SubscriptionCancelModal from "./SubscriptionModal";

const ActiveSubscription = ({
  subscriptionDetails,
  userUsage,
  handleCancelSubscription,
}) => {
  const navigate = useNavigate();
  const Icon = subscriptionDetails.planName === "Pro" ? Zap : Crown;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Your Subscription
          </h1>
          <p className="text-gray-600 text-sm">
            Manage your plan and view usage details
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Current Plan Card */}
          <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 bg-green-50 px-3 py-1 rounded-full mb-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs font-medium text-green-700">
                    {subscriptionDetails.status.toUpperCase()}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  {subscriptionDetails?.planName || "Premium"} Plan
                </h2>
                <p className="text-gray-600 text-sm">
                  {subscriptionDetails?.planTagLine || "Professional Plan"}
                </p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <Icon className="w-6 h-6 text-blue-600" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <p className="text-xs text-gray-500 font-medium">
                    Next Billing
                  </p>
                </div>
                <p className="text-lg font-semibold text-gray-900">
                  {new Date(
                    subscriptionDetails.nextBillingDate
                  ).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  in {subscriptionDetails.daysUntilRenewal} days
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard className="w-4 h-4 text-gray-500" />
                  <p className="text-xs text-gray-500 font-medium">
                    Billing Amount
                  </p>
                </div>
                <p className="text-lg font-semibold text-gray-900">
                  ₹{subscriptionDetails.planPrice || "0"}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {/* Capitalizing */}
                  {subscriptionDetails.billingCycle[0].toUpperCase() +
                    subscriptionDetails.billingCycle.slice(1)}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                onClick={() => navigate("/plans/change-plan")}
              >
                Change Plan
              </button>
              <button
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                onClick={() => {
                  window.open(subscriptionDetails.invoiceURL, "_blank");
                }}
              >
                View invoice
              </button>
              <SubscriptionCancelModal onConfirm={handleCancelSubscription} />
            </div>
          </div>

          {/* Storage Usage Card */}
          <div className="bg-white rounded-lg border border-gray-200  p-6">
            <div className="flex items-center gap-2 mb-4">
              <HardDrive className="w-5 h-5 text-gray-700" />
              <h3 className="text-base font-semibold text-gray-900">
                Storage Usage
              </h3>
            </div>
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-2xl font-bold text-gray-900">
                  {formatFileSize(userUsage.storageUsed)}
                </span>
                <span className="text-sm text-gray-500">
                  of {formatFileSize(userUsage.storageTotal)}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${userUsage.storagePercentage}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {userUsage.storagePercentage}% used
              </p>
            </div>

            <div className="space-y-3 pt-4 border-t border-gray-200">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-lg p-3 border border-blue-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="bg-blue-600 rounded-full p-1">
                      <Zap className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      Priority Speed
                    </span>
                  </div>
                  <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full font-medium">
                    Active
                  </span>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-500 font-medium">
                    Max File Size
                  </span>
                  <span className="text-sm font-semibold text-gray-900">
                    {userUsage.maxFileUploadSize}
                  </span>
                </div>
                <p className="text-xs text-gray-600">Per file upload limit</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg border border-gray-200  p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-blue-50 p-2 rounded-lg">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">
              {userUsage.totalFiles}
            </p>
            <p className="text-sm text-gray-600">Total Files</p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200  p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-green-50 p-2 rounded-lg">
                <Share2 className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">
              {userUsage.sharedFiles}
            </p>
            <p className="text-sm text-gray-600">Shared Files</p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200  p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-purple-50 p-2 rounded-lg">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">
              {userUsage.devicesConnected} / {userUsage.maxDevices}
            </p>
            <p className="text-sm text-gray-600">Devices Connected</p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200  p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-orange-50 p-2 rounded-lg">
                <Upload className="w-5 h-5 text-orange-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">
              {userUsage.filesUploadedInSubscription}
            </p>
            <p className="text-sm text-gray-600">
              Files Uploaded During subscription
            </p>
          </div>
        </div>

        {/* Plan Features */}
        <div className="bg-white rounded-lg border border-gray-200  p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-5">
            Your Plan Includes
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subscriptionDetails.features.map((feature, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  <div className="bg-green-50 rounded-full p-1">
                    <Check className="w-3.5 h-3.5 text-green-600" />
                  </div>
                </div>
                <span className="text-sm text-gray-700">{feature}</span>
              </div>
            ))}
          </div>

          {subscriptionDetails.planName !== "Premium" && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-3">
                Want more storage and features?
              </p>
              <button
                className="px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                onClick={() => navigate("/plans/change-plan")}
              >
                Upgrade to Premium
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActiveSubscription;
