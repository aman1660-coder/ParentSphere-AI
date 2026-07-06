export const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

export const openRazorpayCheckout = async ({ order, keyId, user, counsellor }) => {
  const loaded = await loadRazorpayScript();
  if (!loaded || order.demo) {
    return {
      razorpay_order_id: order.id,
      razorpay_payment_id: `demo_payment_${Date.now()}`,
      razorpay_signature: 'demo_signature'
    };
  }

  return new Promise((resolve, reject) => {
    const checkout = new window.Razorpay({
      key: keyId,
      amount: order.amount,
      currency: order.currency,
      name: 'Parentsphere',
      description: `Counselling session with ${counsellor?.name || 'Parentsphere counsellor'}`,
      order_id: order.id,
      prefill: {
        name: user?.name,
        email: user?.email,
        contact: user?.phone
      },
      theme: { color: '#2563eb' },
      handler: resolve,
      modal: {
        ondismiss: () => reject(new Error('Payment window closed'))
      }
    });
    checkout.open();
  });
};
