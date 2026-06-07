export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const openRazorpay = async (plan, amountINR, billingCycle) => {
  const isLoaded = await loadRazorpayScript();
  if (!isLoaded) {
    alert("Razorpay payment gateway failed to load. Please check your internet connection.");
    return;
  }

  const amountInPaise = Math.round(amountINR * 100);

  const options = {
    key: import.meta.env.VITE_RAZORPAY_KEY_ID || "YOUR_RAZORPAY_KEY_ID",
    amount: amountInPaise,

    currency: "INR",
    name: "saasforlife.co.in",
    description: `${plan} Plan (${billingCycle})`,
    handler: function (response) {
      alert(`Success! Payment ID: ${response.razorpay_payment_id}\nCheck your email for confirmation.`);
    },
    prefill: {
      name: "SaaS Customer",
      email: "customer@saasforlife.co.in",
      contact: "9999999999"
    },
    theme: {
      color: "#3B82F6"
    },
    modal: {
      ondismiss: function () {
        alert("Payment process was closed. If this was a mistake, please try again.");
      }
    }
  };

  const rzp = new window.Razorpay(options);
  rzp.open();
};
