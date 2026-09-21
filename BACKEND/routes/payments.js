// routes/payments.js
const express = require('express');
const router = express.Router();

// Process payment
router.post('/process', async (req, res) => {
  const { name, email, phone, service, amount, paymentMethod, routeInfo } = req.body;
  const pool = req.pool;

  try {
    // Validate required fields
    if (!name || !email || !service || !amount || !paymentMethod) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    const conn = await pool.getConnection();

    try {
      // Generate transaction ID
      const transaction_id = `TXN-${Date.now()}`;
      const payment_status = 'pending';
      const created_at = new Date();

      // Insert into database
      const query = `
        INSERT INTO payments (
          transaction_id, 
          customer_name, 
          customer_email, 
          customer_phone,
          service, 
          amount, 
          payment_method, 
          payment_status, 
          created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const result = await conn.query(query, [
        transaction_id,
        name,
        email,
        phone || null,
        service,
        parseFloat(amount),
        paymentMethod,
        payment_status,
        created_at
      ]);

      console.log('Payment inserted:', transaction_id);

      // Process payment based on method
      let paymentResult;
      switch (paymentMethod) {
        case 'gcash':
          paymentResult = await processGCashPayment({ name, email, amount, transaction_id });
          break;
        case 'paypal':
          paymentResult = await processPayPalPayment({ name, email, amount, transaction_id });
          break;
        case 'maya':
          paymentResult = await processMayaPayment({ name, email, amount, transaction_id });
          break;
        default:
          await conn.query('UPDATE payments SET payment_status = ? WHERE transaction_id = ?', ['failed', transaction_id]);
          return res.status(400).json({
            success: false,
            message: 'Invalid payment method'
          });
      }

      if (paymentResult.success) {
        // Update payment status to completed
        await conn.query(
          'UPDATE payments SET payment_status = ?, completed_at = NOW() WHERE transaction_id = ?',
          ['completed', transaction_id]
        );

        console.log('Payment completed:', transaction_id);

        return res.json({
          success: true,
          transactionId: transaction_id,
          message: 'Payment successful! Your booking is confirmed.',
          paymentDetails: paymentResult
        });
      } else {
        // Update payment status to failed
        await conn.query(
          'UPDATE payments SET payment_status = ? WHERE transaction_id = ?',
          ['failed', transaction_id]
        );

        console.log('Payment failed:', transaction_id);

        return res.status(400).json({
          success: false,
          message: 'Payment processing failed',
          error: paymentResult.error
        });
      }

    } finally {
      await conn.release();
    }

  } catch (error) {
    console.error('Payment processing error:', error);
    return res.status(500).json({
      success: false,
      message: 'Payment processing failed',
      error: error.message
    });
  }
});

// Get payment status
router.get('/status/:transactionId', async (req, res) => {
  const { transactionId } = req.params;
  const pool = req.pool;

  try {
    const conn = await pool.getConnection();

    try {
      const [rows] = await conn.query(
        'SELECT * FROM payments WHERE transaction_id = ?',
        [transactionId]
      );

      if (rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Payment not found'
        });
      }

      return res.json({
        success: true,
        payment: rows[0]
      });

    } finally {
      await conn.release();
    }

  } catch (error) {
    console.error('Status check error:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Payment processing functions
async function processGCashPayment(data) {
  try {
    // TODO: Integrate with actual GCash API
    console.log('Processing GCash payment:', data.transaction_id);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
      success: true,
      method: 'GCash',
      amount: data.amount,
      referenceNumber: `GCASH-${Date.now()}`
    };
  } catch (error) {
    console.error('GCash error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

async function processPayPalPayment(data) {
  try {
    // TODO: Integrate with actual PayPal API
    console.log('Processing PayPal payment:', data.transaction_id);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
      success: true,
      method: 'PayPal',
      amount: data.amount,
      referenceNumber: `PAYPAL-${Date.now()}`
    };
  } catch (error) {
    console.error('PayPal error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

async function processMayaPayment(data) {
  try {
    // TODO: Integrate with actual Maya API
    console.log('Processing Maya payment:', data.transaction_id);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
      success: true,
      method: 'Maya',
      amount: data.amount,
      referenceNumber: `MAYA-${Date.now()}`
    };
  } catch (error) {
    console.error('Maya error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

module.exports = router;