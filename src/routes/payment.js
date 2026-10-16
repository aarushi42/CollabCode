const express = require("express");
const paymentRouter = express.Router();
const { userAuth } = require("../middleware/auth");
const razorpayInstances = require("../utilis/razorpay");
const Payment = require("../models/payment");
const { membershipAmount } = require("../utilis/constants");
const {
  validateWebhookSignature,
} = require("razorpay/dist/utils/razorpay-utils");
const User = require("../models/user");

paymentRouter.post("/payment/create", userAuth, async (req, res) => {
  try {
    const { membershipType } = req.body;
    const { firstName, lastName, emailId } = req.user;
    const amount = membershipAmount[membershipType];

    if (membershipType !== "gold" || !amount) {
      return res.status(400).json({
        error: "membershipType must be gold",
      });
    }

    const order = await razorpayInstances.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: "receipt#1",
      notes: {
        firstName,
        lastName,
        emailId,
        membershipType: membershipType,
      },
    });

    console.log("Created Razorpay order:", order.id);

    //Save it to Db
    console.log(order);
    const payment = new Payment({
      userId: req.user._id,
      orderId: order.id,
      status: order.status,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      notes: order.notes,
    });

    const savedPayment = await payment.save();

    //return back my order to frontend
    res.json({ ...savedPayment.toJSON(), keyId: process.env.RAZORPAY_KEY_ID });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Unable to create payment order" });
  }
});

paymentRouter.post("/payment/webhook", async (req, res) => {
  try {
    const webhookSignature = req.get("X-Razorpay-Signature");
    const isWebhookValid = validateWebhookSignature(
      JSON.stringify(req.body), //webhookbody
      webhookSignature, //webhook signature
      process.env.RAZORPAY_WEBHOOK_SECRET,
    );

    if (!isWebhookValid) {
      return res.status(400).json({ error: "Invalid webhook signature" });
    }

    //update my payment status in db
    const paymentDetails = req.body.payload.payment.entity;
    console.log("Webhook order ID:", paymentDetails.order_id);
    console.log("Webhook payment ID:", paymentDetails.id);

    const payment = await Payment.findOne({ orderId: paymentDetails.order_id });
    console.log("Payment found:", Boolean(payment));

    payment.status = paymentDetails.status;
    await payment.save();

    //update the user as premium
    const user = await User.findById(payment.userId);

    user.isPremium = true;
    user.membershipType = payment.notes.membershipType;

    await user.save();

    res.status(200).json({ msg: "webhook received successfully" });
  } catch (err) {
    console.error(err);
  }
});

paymentRouter.get("/premium/verify", userAuth, async (req, res) => {
  const user = req.user;
  if (user.isPremium) {
    return res.json({ isPremium: true, membershipType: user.membershipType });
  }
  return res.json({ isPremium: false });
});

module.exports = paymentRouter;
