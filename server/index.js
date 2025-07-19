// const express = require('express');
// const paypal = require('paypal-rest-sdk');
// const cors = require('cors');
// const app = express();

// app.use(cors());

// // PayPal configuration
// paypal.configure({
//   'mode': 'sandbox', // sandbox or live
//   'client_id': 'AdERhcMVSZ-06RfBudaqYZo3YH2_G0xtPeXf0wKm3Liizz5yCuy7y_fcQ6VT7n9yZivuSGa56wDSqmna',
//   'client_secret': 'EPQxWWOYT11ls8k5eKyqBNadbSu6FfEet1WHnXhq5gG5aQLsoD4qRXsZRi-Wm9YhBWMyoREyYmZEg6Q4'
// });

// // Define routes
// // Payment initiation route
// app.get('/payment', async (req, res) => {
//   try {
//     const create_payment_json = {
//       "intent": "sale",
//       "payer": {
//         "payment_method": "paypal"
//       },
//       "redirect_urls": {
//         "return_url": "http://localhost:8000/success",
//         "cancel_url": "http://localhost:8000/failed"
//       },
//       "transactions": [{
//         "item_list": {
//           "items": [{
//             "name": "item",
//             "sku": "item",
//             "price": "1.00",
//             "currency": "USD",
//             "quantity": 1
//           }]
//         },
//         "amount": {
//           "currency": "USD",
//           "total": "1.00"
//         },
//         "description": "This is the payment description."
//       }]
//     };

//     await paypal.payment.create(create_payment_json, function (error, payment) {
//       if (error) {
//         throw error;
//       } else {
//         console.log("Create Payment Response");
//         // console.log(payment);
//         res.json(payment);
//       }
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send("Error creating payment.");
//   }
// });

// // Success route after payment
// app.get('/success', async (req, res) => {
//   try {
//     const payerId = req.query.PayerID;
//     const paymentId = req.query.paymentId;

//     const execute_payment_json = {
//       "payer_id": payerId,
//       "transactions": [{
//         "amount": {
//           "currency": "USD",
//           "total": "1.00"
//         }
//       }]
//     };

//     paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
//       if (error) {
//         console.log(error);
//         return res.redirect("http://localhost:5173/failed");
//       } else {
//         console.log("Execute Payment Response");
//         const response = JSON.stringify(payment);
//         const parsedResponse = JSON.parse(response);
//         const transactions = parsedResponse.transactions[0];
//         console.log("transactions", transactions);
//         return res.redirect("http://localhost:5173/success");
//       }
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send("Error executing payment.");
//   }
// });

// // Failed payment route
// app.get('/failed', (req, res) => {
//   return res.redirect("http://localhost:5173/failed");
// });

// // Start the server
// app.listen(8000, () => {
//   console.log('Server is running on port 8000');
// });


const express = require("express");
const paypal = require("paypal-rest-sdk");
const cors = require("cors");
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// PayPal configuration
paypal.configure({
  mode: "sandbox", // Sandbox for testing; switch to "live" for production
  client_id: "AdERhcMVSZ-06RfBudaqYZo3YH2_G0xtPeXf0wKm3Liizz5yCuy7y_fcQ6VT7n9yZivuSGa56wDSqmna",
  client_secret: "EPQxWWOYT11ls8k5eKyqBNadbSu6FfEet1WHnXhq5gG5aQLsoD4qRXsZRi-Wm9YhBWMyoREyYmZEg6Q4",
});

// Test route
app.get("/test", (req, res) => {
  res.json({ message: "Server is running!" });
});

app.get("/success", (req, res) => {
  const payerId = req.query.PayerID;
  const paymentId = req.query.paymentId;

  if (!payerId || !paymentId) {
    return res.status(400).send("Missing PayerID or PaymentID.");
  }

  const execute_payment_json = {
    payer_id: payerId,
  };

  paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
    if (error) {
      console.error("Error while executing payment:", error.response);
      return res.status(500).send("Payment execution failed. Please try again.");
    }

    res.send("Payment successful! Thank you for your purchase.");
  });
});
// Payment route
app.post("/payment", (req, res) => {
  const { cartItems } = req.body;

  if (!cartItems || cartItems.length === 0) {
    return res.status(400).json({ error: "Cart is empty or invalid data." });
  }

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const create_payment_json = {
    intent: "sale",
    payer: {
      payment_method: "paypal",
    },
    redirect_urls: {
      return_url: "http://localhost:8000/success",
      cancel_url: "http://localhost:8000/failed",
    },
    transactions: [
      {
        item_list: {
          items: cartItems.map((item) => ({
            name: item.title,
            sku: item.id.toString(),
            price: item.price.toFixed(2), // PayPal requires string format for prices
            currency: "USD", // Keep this consistent
            quantity: item.quantity,
          })),
        },
        amount: {
          currency: "USD",
          total: totalAmount.toFixed(2), // PayPal requires total as a string
        },
        description: "Your purchase from our store",
      },
    ],
  };

  paypal.payment.create(create_payment_json, function (error, payment) {
    if (error) {
      console.error("PayPal Error:", error.response);
      return res
        .status(500)
        .json({ error: "Failed to create PayPal payment. Check server logs." });
    }

    // Send PayPal payment response
    res.json(payment);
  });
});

// Start the server
const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
