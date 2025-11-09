import { CreditCard } from "lucide-react";

const RenewalFailed = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Subscription Renewal Failed Banner */}
        <div className="mb-8 bg-red-50 border-l-4 border-red-500 rounded-xl p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="bg-red-100 rounded-full p-3">
                <CreditCard className="w-6 h-6 text-red-600" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-red-900 mb-2">
                Subscription Renewal Failed
              </h3>
              <p className="text-sm text-red-800 leading-relaxed mb-3">
                We were unable to process your latest subscription renewal
                payment. Razorpay will automatically retry the payment up to{" "}
                <span className="font-medium">3 times</span>. If all attempts
                fail, your subscription will be cancelled, and your premium
                features will be downgraded.
              </p>

              <div className="mt-4 bg-red-100 rounded-md p-3 text-sm text-red-700">
                <p>
                  For assistance, please contact our support team at{" "}
                  <a
                    href="mailto:support@talkative.app"
                    className="font-medium underline hover:text-red-800"
                  >
                    kunalkhandekar.dev@gmail.com
                  </a>
                  .
                </p>
              </div>

              <p className="text-xs text-red-700 mt-4 italic">
                Your stored files and data remain safe during this retry period.
                You’ll be notified once the payment succeeds or the plan is
                cancelled.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RenewalFailed;
