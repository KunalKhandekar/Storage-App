export function openRazorpayPopup({ subscriptionId }) {
  const rzp = new Razorpay({
    key: "rzp_test_Ra0B5WI7uIwO1z",
    description: "testing the plans",
    name: "Storage App",
    subscription_id: subscriptionId,
    image: "https://dzdw2zccyu2wu.cloudfront.net/overview/readme-typing.svg",
    handler: async function (response) {
      console.log(response);
    },
  });

  rzp.on("payment.failed", function (response) {
    console.log(response);
  });

  rzp.open();
}