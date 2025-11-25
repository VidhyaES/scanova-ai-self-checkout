import React, { useState } from 'react';
import { CreditCard, Smartphone, Check, X } from 'lucide-react';
import axios from 'axios';
import { API_ENDPOINTS } from '../config';

function Checkout({ items, total, onClose, onComplete }) {
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [success, setSuccess] = useState(false);
  const [receipt, setReceipt] = useState(null);

  const processPayment = async () => {
    setProcessing(true);

    try {
      // Prepare cart items for backend
      const cartItems = items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price
      }));

      // Send checkout request to backend
      const response = await axios.post(API_ENDPOINTS.CHECKOUT, {
        items: cartItems,
        payment_method: paymentMethod
      });

      if (response.data.success) {
        setReceipt(response.data.receipt);
        setSuccess(true);

        // Auto close after 3 seconds
        setTimeout(() => {
          onComplete();
          onClose();
        }, 3000);
      } else {
        alert('Payment failed. Please try again.');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Payment processing failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content checkout-modal">
        <button className="modal-close" onClick={onClose}>
          <X size={24} />
        </button>

        {!success ? (
          <>
            <h2>Complete Payment</h2>

            <div className="checkout-summary">
              <div className="summary-box">
                <h3>Order Summary</h3>
                <div className="summary-items">
                  {items.map((item, index) => (
                    <div key={index} className="summary-item">
                      <span>{item.product?.name} × {item.quantity}</span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="summary-total">
                  <strong>Total Amount:</strong>
                  <strong>${total.toFixed(2)}</strong>
                </div>
              </div>
            </div>

            <div className="payment-methods">
              <h3>Select Payment Method</h3>
              
              <button
                className={`payment-option ${paymentMethod === 'card' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('card')}
              >
                <CreditCard size={24} />
                <div>
                  <strong>Credit/Debit Card</strong>
                  <small>Visa, Mastercard, Amex</small>
                </div>
              </button>

              <button
                className={`payment-option ${paymentMethod === 'wallet' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('wallet')}
              >
                <Smartphone size={24} />
                <div>
                  <strong>Mobile Wallet</strong>
                  <small>Apple Pay, Google Pay</small>
                </div>
              </button>
            </div>

            <button
              onClick={processPayment}
              disabled={processing}
              className="btn btn-pay"
            >
              {processing ? 'Processing...' : `Pay $${total.toFixed(2)}`}
            </button>
          </>
        ) : (
          <div className="payment-success">
            <div className="success-icon">
              <Check size={60} />
            </div>
            <h2>Payment Successful!</h2>
            <p>Thank you for shopping with us</p>
            
            {receipt && (
              <div className="receipt-info">
                <p><strong>Receipt ID:</strong> {receipt.receipt_id}</p>
                <p><strong>Amount:</strong> ${receipt.total}</p>
                <small>Receipt sent to your email</small>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Checkout;