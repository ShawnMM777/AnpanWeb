import axios from 'axios';
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./payment.css";
import gcash from "../ASSETS/gcash.png";
import maya from "../ASSETS/maya.jpg";
import paypal from "../ASSETS/paypal.jpg";

const Payment = () => {
  const [bookingData, setBookingData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    amount: '',
    paymentMethod: ''
  });

  const [routeInfo, setRouteInfo] = useState({ from: '', to: '' });
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [error, setError] = useState(null);

  const location = useLocation();

  // Extract from and to from URL query parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const from = params.get('from') || '';
    const to = params.get('to') || '';

    console.log('URL Search:', location.search);
    console.log('From:', from, 'To:', to);

    setRouteInfo({ from, to });
  }, [location.search]);

  const services = [
    { id: 'hotel', name: 'Hotel Reservation', price: 2500 },
    { id: 'tour', name: 'Tour Package', price: 5000 },
    { id: 'transport', name: 'Transport Service', price: 1500 },
    { id: 'event', name: 'Event Booking', price: 3000 }
  ];

  const paymentMethods = [
    { id: 'gcash', name: 'GCash', image: gcash },
    { id: 'paypal', name: 'PayPal', image: paypal },
    { id: 'maya', name: 'Maya', image: maya }
  ];

  const handleServiceChange = (serviceId) => {
    const service = services.find(s => s.id === serviceId);
    setBookingData({
      ...bookingData,
      service: serviceId,
      amount: service ? service.price : ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingData({ ...bookingData, [name]: value });
  };

  const processPayment = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:3001/api/payments/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...bookingData, routeInfo })
      });

      await new Promise(resolve => setTimeout(resolve, 2000));

      if (!response.ok) throw new Error('Payment processing failed');

      setPaymentStatus({
        success: true,
        transactionId: `TXN-${Date.now()}`,
        message: 'Payment successful! Your booking is confirmed.'
      });

      setTimeout(() => {
        setBookingData({
          name: '',
          email: '',
          phone: '',
          service: '',
          amount: '',
          paymentMethod: ''
        });
        setPaymentStatus(null);
      }, 5000);
    } catch (err) {
      setError(err.message || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!bookingData.name || !bookingData.email || !bookingData.service || !bookingData.paymentMethod) {
      setError('Please fill in all required fields');
      return;
    }
    processPayment();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header with dynamic route */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6">
            <h1 className="text-3xl font-bold text-white">
              {routeInfo.from && routeInfo.to ? `${routeInfo.from} → ${routeInfo.to} Booking` : 'Travel Booking'}
            </h1>
            <p className="text-indigo-100 mt-2">
              {routeInfo.from && routeInfo.to ? 'Complete your booking for this route' : 'Secure booking with multiple payment options'}
            </p>
          </div>

          {/* Body */}
          <div className="p-8">
            {paymentStatus?.success && (
              <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
                <svg className="text-green-600 flex-shrink-0 mt-0.5" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <div>
                  <p className="text-green-800 font-semibold">{paymentStatus.message}</p>
                  <p className="text-green-600 text-sm mt-1">Transaction ID: {paymentStatus.transactionId}</p>
                </div>
              </div>
            )}

            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                <svg className="text-red-600 flex-shrink-0 mt-0.5" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <p className="text-red-800">{error}</p>
              </div>
            )}

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Route Info Display */}
              {routeInfo.from && routeInfo.to && (
                <div className="bg-indigo-50 border-l-4 border-indigo-600 p-4 mb-6">
                  <p className="text-indigo-900 font-semibold">
                    Route: <span className="text-indigo-700">{routeInfo.from}</span> → <span className="text-indigo-700">{routeInfo.to}</span>
                  </p>
                </div>
              )}

              {/* Personal Info */}
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Personal Information</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                    <input type="text" name="name" value={bookingData.name} onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      placeholder="Juan Dela Cruz" required />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                    <input type="email" name="email" value={bookingData.email} onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      placeholder="juan@example.com" required />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <input type="tel" name="phone" value={bookingData.phone} onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      placeholder="+63 912 345 6789" />
                  </div>
                </div>
              </div>

              {/* Service Selection */}
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Select Service</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {services.map((service) => (
                    <button key={service.id} type="button" onClick={() => handleServiceChange(service.id)}
                      className={`p-4 border-2 rounded-lg text-left transition-all ${bookingData.service === service.id ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 hover:border-indigo-300'
                        }`}>
                      <div className="font-semibold text-gray-800">{service.name}</div>
                      <div className="text-2xl font-bold text-indigo-600 mt-2">₱{service.price.toLocaleString()}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Payment Method</h2>
                <div className="grid md:grid-cols-3 gap-4">
                  {paymentMethods.map((method) => (
                    <button key={method.id} type="button"
                      onClick={() => setBookingData({ ...bookingData, paymentMethod: method.id })}
                      className={`p-6 border-2 rounded-lg transition-all ${bookingData.paymentMethod === method.id ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 hover:border-indigo-300'
                        }`}>
                      <div className="w-20 h-20 flex items-center justify-center mx-auto mb-3">
                        <img src={method.image} alt={method.name} className="w-full h-full object-contain" />
                      </div>
                      <div className="font-semibold text-gray-800 text-center">{method.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Total Amount */}
              {bookingData.amount && (
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex justify-between items-center text-lg">
                    <span className="text-gray-700">Total Amount:</span>
                    <span className="text-3xl font-bold text-indigo-600">
                      ₱{parseFloat(bookingData.amount).toLocaleString()}
                    </span>
                  </div>
                </div>
              )}

              {/* Submit */}
              <button type="submit" disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-lg font-semibold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                      <line x1="1" y1="10" x2="23" y2="10"></line>
                    </svg>
                    Proceed to Payment
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;