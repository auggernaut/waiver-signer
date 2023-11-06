import React from 'react';
import { useNavigate } from 'react-router-dom';

function ListPage() {
  const navigate = useNavigate();

  const handleContractClick = (contractType) => {
    navigate(`/form?contract=${contractType}`);
  };

  return (
    <div className="container">
        <div className="title">
      <h2>Select a Contract</h2>
      </div>
      <ul className="contract-list">
        <li>
          <button onClick={() => handleContractClick('liability-waiver')}>
            Liability Waiver
          </button>
        </li>
        <li>
          <button onClick={() => handleContractClick('captains-demise')}>
            Captain's Demise Agreement
          </button>
        </li>
        <li>
          <button onClick={() => handleContractClick('charter-agreement')}>
            Charter Agreement
          </button>
        </li>
      </ul>
    </div>
  );
}

export default ListPage;
