import React from 'react';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const navigate = useNavigate();

  const handleUserTypeSelection = (userType) => {
    if(userType === 'guest') {
      navigate(`/form?contract=liability-waiver`);
    } else if(userType === 'captains') {
      navigate('/today');
    }
  };

  return (
    <div className="container">
      <div className="title">
        <h2>Welcome</h2>
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
