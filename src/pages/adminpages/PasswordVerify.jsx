import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/PasswordVerify.css';

export default function ForgotPasswordVerify() {
  const [otp, setOtp] = useState(['', '', '', '', '']);
  const navigate = useNavigate();

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    // Focus next input
    if (element.value !== '' && element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    // Focus previous input on backspace
    if (e.key === 'Backspace' && !otp[index] && e.target.previousSibling) {
      e.target.previousSibling.focus();
    }
  };

  const handleVerify = () => {
    console.log('OTP entered:', otp.join(''));
    navigate('/change-password');
  };

  return (
    <div className="verify-container">
      <div className="verify-left-panel">
        <div className="verify-logo-container">
          <img src="/2.png" alt="Druk Health Logo" className="verify-logo" />
          <div className="verify-brand-name">DRUK HEALTH</div>
        </div>
      </div>
      
      <div className="verify-right-panel">
        <div className="verify-form-container">
          <h1 className="verify-title">Forgot Password</h1>
          
          <p className="verify-subtitle">
            Enter the verification code sent you in your email.
          </p>
          
          <div className="otp-wrapper">
            {otp.map((data, index) => {
              return (
                <input
                  className="otp-input"
                  type="text"
                  maxLength="1"
                  key={index}
                  value={data}
                  onChange={e => handleChange(e.target, index)}
                  onKeyDown={e => handleKeyDown(e, index)}
                  onFocus={e => e.target.select()}
                />
              );
            })}
          </div>
          
          <button onClick={handleVerify} className="verify-btn">
            Verify
          </button>
        </div>
      </div>
    </div>
  );
}