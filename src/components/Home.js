import React from 'react';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const navigate = useNavigate();

  const handleUserTypeSelection = (userType) => {
    if (userType === 'guest') {
      navigate(`/form?contract=liability-waiver`);
    } else if (userType === 'captains') {
      navigate('/today');
    }
  };

  return (
    <div className="container">
      <div className="logo-container">
        <img src="logo.jpg" alt="Logo" className="logo" />
      </div>
      <div className="title">
        Welcome aboard the Wiley Pixie! We're thrilled to have you with us. Just a couple of quick steps, and you'll be all set to sail with us.
      </div>
      <ul className="contract-list">
        <li>
          <button onClick={() => handleUserTypeSelection('guest')}>
            Charter Guest
          </button>
        </li>
        <li>
          <button onClick={() => handleUserTypeSelection('captains')}>
            Captain
          </button>
        </li>
      </ul>
    </div>

  );
}

export default HomePage;
