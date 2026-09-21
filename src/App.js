import React, { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './Components/Homepage';
import Login from './Components/Login';
import Signup from './Components/Signup';
import Forgotpassword from './Components/forgotpassword';
import ResetPassword from './Components/resetpassword';
import Second from './Components/second';
import MapRouter from './Components/MapRouter';
import Account from './Components/account';
import Booking from './Components/booking';
import Drafts  from './Components/Drafts';
import Payment from './Components/payment';
import PaymentConfirmation from './Components/paymentConfimation';

function App() {
  const [currentForm, setCurrentForm] = useState('login');
  const toggleForm = (formName) => {
    setCurrentForm(formName);
  }
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<Login onFormSwitch={toggleForm} />} />
          <Route path="/signup" element={<Signup onFormSwitch={toggleForm} />} />
          <Route path="/forgotpassword" element={<Forgotpassword onFormSwitch={toggleForm} />} />
          <Route path="/resetpassword" element={<ResetPassword />} />
          <Route path="/second" element={<Second />} />
          <Route path="/MapRouter" element={<MapRouter />} />
          <Route path="/account" element={<Account />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/Drafts" element={<Drafts />} />
          <Route path= "/payment" element={<Payment/>} />
          <Route path="/PaymentConfirmation" elemet={<PaymentConfirmation/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;