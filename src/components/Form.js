import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function Form() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const contractType = queryParams.get('contract');

  const [form, setForm] = useState({
    name: '',
    email: '',
    address: '',
    phone: '',
    startDate: new Date().toLocaleDateString('en-CA'),
    startTime: '',
    endDate: '',
    endTime: '',
    captainName: '',
    marketingEmails: true,
    contractType: contractType
  });

  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const handleChange = e => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm({ ...form, [e.target.name]: value });
    if (e.target.name === 'startDate') {
      validateStartDate(value);
    }
  };

  const validateStartDate = (date) => {
    const today = new Date().toLocaleDateString('en-CA'); // Format: YYYY-MM-DD
    console.log("today", today);
    console.log(date);

    if (date < today) {
      setErrors(prevErrors => ({ ...prevErrors, startDate: 'Start date cannot be before today' }));
    } else {
      setErrors(prevErrors => {
        const { startDate, ...rest } = prevErrors;
        return rest;
      });
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!errors.startDate) {
      localStorage.setItem('form', JSON.stringify(form));
      navigate('/contract');
    }
  };

  return (
    <div className="container">
      
      <div className="form-container">
      <div className="title">Liability Waiver</div>
        <form onSubmit={handleSubmit}>
          <label>
            Charterer Name:
            <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Name" required />
          </label>

          {contractType.startsWith('liability') && (
            <>
              <label>
                Email:
                <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email" required />
              </label>
              <label>
                Address:
                <input type="text" name="address" value={form.address} onChange={handleChange} placeholder="Address" required />
              </label>
              <label>
                Phone Number:
                <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="Phone Number" required />
              </label>
              <div>
                <label className="marketing-checkbox">
                  <input type="checkbox" name="marketingEmails" onChange={handleChange} checked={form.marketingEmails} />
                  Yes, I'd like to join the Wiley Pixie Catamaran email list and receive promotional offers.
                </label>
              </div>
            </>
          )}

          {contractType.startsWith('captains') && (
            <>
              <label>
                Captain:
                <select name="captainName" value={form.captainName} onChange={handleChange} required>
                  {/* Captain options */}
                  <option value="">Select Captain</option>
                  <option value="mike-carissimo">Mike Carissimo</option>
                  <option value="mike-singleton">Mike Singleton</option>
                  {/* ... other time options ... */}
                </select>
              </label>
              <label>
                Start Date:
                <input type="date" name="startDate" value={form.startDate} onChange={handleChange} required />
              </label>
              {errors.startDate && <p className="error-text">{errors.startDate}</p>}
              <label>
                Start Time:
                <select name="startTime" value={form.startTime} onChange={handleChange} required>
                  {/* Adjust these times as needed */}
                  <option value="">Select start time</option>
                  <option value="08:00">08:00 AM</option>
                  <option value="09:00">09:00 AM</option>
                  {/* ... other time options ... */}
                </select>
              </label>
              <label>
                End Date:
                <input type="date" name="endDate" value={form.endDate} onChange={handleChange} required />
              </label>
              <label>
                End Time:
                <select name="endTime" value={form.endTime} onChange={handleChange} required>
                  {/* Adjust these times as needed */}
                  <option value="">Select end time</option>
                  <option value="17:00">05:00 PM</option>
                  <option value="18:00">06:00 PM</option>
                  {/* ... other time options ... */}
                </select>
              </label>
            </>
          )}

          <button type="submit">Next</button>
        </form>
      </div>
    </div>
  );
}

export default Form;
