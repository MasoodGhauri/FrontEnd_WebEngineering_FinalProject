import React, { useState, useEffect } from 'react';
import styles from '../Login/Adnan.css';
import { Link, useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import useAccount from '../../hooks/useAccount';

const Subscription = () => {
  const { data } = useAccount();
  const navigate = useNavigate();
  
  const [error, setError] = useState("");
  const [accountdetails, setDetails] = useState({
    cardHolderName: '',
    cardNumber: '',
    csvNumber: '',
	MM: '',
	YY: '',
  });
  const [formError, setFormError] = useState('');

  const { firstname, lastname, email, role, expertise } = data;
  console.log(firstname, lastname, email, role, expertise);
  
  useEffect(() => {
    // Use the image path stored in Zustand
    console.log("Profile Picture Path:", data.profilePicturePath);
  }, [data.profilePicturePath]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
	e.preventDefault();
  
	// Validate input fields
	const requiredFields = ['cardHolderName', 'cardNumber', 'MM', 'YY', 'csvNumber'];
	const missingFields = requiredFields.filter(
	  (field) => !accountdetails[field]
	);
  
	if (missingFields.length > 0) {
	  setFormError(`Please fill in the following fields: ${missingFields.join(', ')}`);
	} else {
	  setFormError('');
  
	  // Validate credit card number (16 digits)
	  const cardNumberRegex = /^\d{16}$/;
	  if (!cardNumberRegex.test(accountdetails.cardNumber)) {
		setFormError('Invalid credit card number. Please enter a valid 16-digit number.');
		return;
	  }
  
	  // Validate MM and YY against the current date
	  const currentYear = new Date().getFullYear() % 100; // Get last two digits of the current year
	  const enteredYear = parseInt(accountdetails.YY, 10);
	  const enteredMonth = parseInt(accountdetails.MM, 10);
  
	  if (enteredYear < currentYear || (enteredYear === currentYear && enteredMonth < 1)) {
		setFormError('Invalid expiration date. Please enter a date in the future.');
		return;
	  }
  
	  try {
		const response = await fetch("http://localhost:3001/signup", {
		  method: "POST",
		  headers: {
			"Content-Type": "application/json",
		  },
		  body: JSON.stringify({
			firstName: data.firstName,
			lastName: data.lastName,
			email: data.email,
			password: data.password,
			role: data.role,
			expertise: data.expertise,
			cardNumber: accountdetails.cardNumber,
			csvNumber: accountdetails.csvNumber,
			cardHolderName: accountdetails.cardHolderName,
			profilePicture: data.profilePicture,
			accountbalance: 50,
		  }),
		});
  
		if (!response.ok) {
		  throw new Error(`HTTP error! Status: ${response.status}`);
		}
  
		const responseData = await response.json();
		//console.log(responseData);
    if(responseData.role === 'student')
	  window.alert('50$ have been deducted from your Account and the account has been created Successfully!');

    else if(responseData.role === 'teacher')
    window.alert('Your Account has been created Successfully!');
  
	  } catch (error) {
		console.error(error);
		setError("An error occurred during registration. Please try again.");
	  }

    
	  // Assuming you have a navigate function to handle navigation
	  navigate("/login");
	}
  };
  

  return (
    <div>
      {/* ==============================================
      Credit Card Payment Section
      ===============================================*/}
      <section className="credit-card">
        <div className="container">
          <div className="card-holder">
            <div className="card-box bg-news">
              <div className="row">
                <div className="col-lg-6">
                  <div className="img-box">
                    <img
                      src="https://bootdey.com/img/Content/avatar/avatar7.png"
                      className="img-fluid"
                      alt="User Avatar"
                    />
                  </div>
                </div>
                <div className="col-lg-6">
                  <form onSubmit={handleSubmit}>
                    <div className="card-details">
                      <h3 className="title">Credit Card Details</h3>
                      <div className="row">
                        <div className="form-group col-sm-7">
                          <div className="inner-addon right-addon">
                            <label htmlFor="card-holder">Card Holder</label>
                            <i className="far fa-user"></i>
                            <input
                              id="card-holder"
                              type="text"
                              className="form-control"
                              placeholder="Card Holder"
                              aria-label="Card Holder"
                              aria-describedby="basic-addon1"
                              name="cardHolderName"
                              value={accountdetails.Personname}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                        <div className="form-group col-sm-5">
                          <label htmlFor="">Expiration Date</label>
                          <div className="input-group expiration-date">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="MM"
                              aria-label="MM"
                              name="MM"
                              value={accountdetails.MM}
                              onChange={handleChange}
                            />
                            <span className="date-separator">/</span>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="YY"
                              aria-label="YY"
                              name="YY"
                              value={accountdetails.YY}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                        <div className="form-group col-sm-8">
                          <div className="inner-addon right-addon">
                            <label htmlFor="card-number">Card Number</label>
                            <i className="far fa-credit-card"></i>
                            <input
                              id="card-number"
                              type="text"
                              className="form-control"
                              placeholder="Card Number"
                              aria-label="Card Holder"
                              aria-describedby="basic-addon1"
                              name="cardNumber"
                              value={accountdetails.Cardnumber}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                        <div className="form-group col-sm-4">
                          <label htmlFor="cvc">CVC</label>
                          <input
                            id="cvc"
                            type="text"
                            className="form-control"
                            placeholder="CVC"
                            aria-label="Card Holder"
                            aria-describedby="basic-addon1"
                            name="csvNumber"
                            value={accountdetails.CVC}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="form-group col-sm-12">
                          <button
                            type="submit"
                            className="btn btn-primary btn-block"
                          >
                            Proceed
                          </button>
                        </div>
                        {formError && (
                          <div className="form-error-message">
                            {formError}
                          </div>
                        )}
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Subscription;
