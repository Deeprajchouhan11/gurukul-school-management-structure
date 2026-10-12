export const paymentConfig = {
  provider: process.env.PAYMENT_PROVIDER || "razorpay",
  keyId: process.env.RAZORPAY_KEY_ID,
  keySecret: process.env.RAZORPAY_KEY_SECRET,
};
