// routes/quoteRoutes.js
import express from 'express';
const router = express.Router();

// Mock data for insurance plans
const plans = {
  basic: { price: 100, coverage: 'Essential coverage for common medical expenses.' },
  standard: { price: 200, coverage: 'Comprehensive coverage for a wide range of medical needs.' },
  premium: { price: 300, coverage: 'Exclusive coverage with enhanced benefits and services.' }
};

// Endpoint for generating a quote
router.post('/get-quote', (req, res) => {
  const { name, age, coverage } = req.body;

  // Basic validation
  if (!name || !age || !coverage || !plans[coverage]) {
    return res.status(400).json({ message: 'Missing or invalid data.' });
  }

  // Simulate quote generation based on age (you can add more complex logic here)
  let priceMultiplier = 1;

  if (age < 30) {
    priceMultiplier = 1.0; // Younger age, lower multiplier
  } else if (age >= 30 && age < 50) {
    priceMultiplier = 1.5; // Middle-aged, moderate multiplier
  } else {
    priceMultiplier = 2.0; // Older age, higher multiplier
  }

  // Get the base price from the selected plan
  const plan = plans[coverage];
  const quotePrice = plan.price * priceMultiplier;

  // Create the quote response
  const quote = {
    name,
    age,
    coverage,
    coverageDescription: plan.coverage,
    price: quotePrice.toFixed(2), // Price calculated with multiplier
  };

  // Send the quote back to the client
  res.status(200).json(quote);
});

export default router;
