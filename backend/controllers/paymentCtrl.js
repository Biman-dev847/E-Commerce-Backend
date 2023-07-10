import Razorpay from "razorpay"; /**A Payment Gateway creates a secure 
pathway between a customer and the business to facilitate payments securely. 
It involves the authentication of both parties from the banks involved. 
You can accept payments from customers on your website and mobile apps using 
the Razorpay Payment Gateway as a business owner. */
import dotenv from 'dotenv';
dotenv.config();



/**Razorpay is a payments solution in India that allows businesses 
to access all payment modes including credit card, debit card, 
netbanking, UPI and other popular wallets. 

    
    3.You then pass the Order ID to the checkout and collect payment details.
    4.Authentication of a payment then happens in your back-end by verifying the signature returned by Razorpay.
    5.Capture the payment.
*/

const instance = new Razorpay({
  /**These key you can generate them in your razorpay account */
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

export const checkout = async (req, res) => {
  const {amount} = req.body;
  const option = {
    amount: amount * 100,
    currency: "INR",
  };
  const order = await instance.orders.create(option);
  res.json({
    success: true,
    order,
  });
  console.log(order);
};

export const paymentVerification = async (req, res) => {
  const { razorpayOrderId, razorpayPaymentId } = req.body;
  res.json({
    razorpayOrderId,
    razorpayPaymentId,
  });
 
};
