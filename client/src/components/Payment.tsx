import React from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('YOUR_STRIPE_PUBLIC_KEY');

const Payment: React.FC = () => {
  const handlePayment = async () => {
    const stripe = await stripePromise;
    // Implement payment logic here
  };

  return <button onClick={handlePayment}>Pay Now</button>;
};

export default Payment; 