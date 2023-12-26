// Import necessary modules
import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Nav, Form, Button } from 'react-bootstrap';
import useAccount from '../../hooks/useAccount'; // Adjust the path accordingly
import useUserLoggedIn from '../../hooks/useUserLoggedIn';
import { useNavigate } from 'react-router-dom';

// Create the ProfileUpdate component
const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, token } = useUserLoggedIn();
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    expertise: '',
    profilePicture: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'profilePicture') {
      setUserData((prevData) => ({
        ...prevData,
        profilePicture: files[0],
      }));
    } else {
      setUserData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:3001/updateprofile/${user._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          token: token, // Include the token for authentication
        },
        body: JSON.stringify({
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          password: userData.password,
          expertise: userData.expertise,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseData = await response.json();
      console.log(responseData);

      // Handle success or error based on the responseData
    } catch (error) {
      console.error(error);
      // Handle error
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div>
      {/* Bootstrap Navbar */}
      <Navbar style={{ backgroundColor: '#7DCEA0' }} variant="light" fixed="top">
        <Navbar.Brand href="#home" style={{ color: '#FFF', fontWeight: 'bold' }}>
          ASK Pro
        </Navbar.Brand>
        <Nav className="mr-auto">
          <Nav.Link href="#contact" style={{ color: '#FFF', fontWeight: 'bold' }}>
            History
          </Nav.Link>
          <Nav.Link href="#features" style={{ color: '#FFF', fontWeight: 'bold' }}>
            Ask Anything
          </Nav.Link>
          <Nav.Link href="#home" style={{ color: '#FFF', fontWeight: 'bold' }}>
            Video Session
          </Nav.Link>
        </Nav>

        {/* Display the welcome message */}
        <Navbar.Text className="mr-3" style={{ color: '#FFF', fontWeight: 'bold' }}>
          Welcome, {user.firstName || 'User'}
        </Navbar.Text>

        {/* Logout link */}
        <Nav.Link onClick={handleLogout} style={{ color: '#FFF', fontWeight: 'bold' }}>
          Logout
        </Nav.Link>
      </Navbar>

      {/* Profile Update Form */}
      <div className="container" style={{ marginTop: '100px' }}>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formFirstName">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Update your first name"
              name="firstName"
              value={userData.firstName}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group controlId="formLastName">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Update your last name"
              name="lastName"
              value={userData.lastName}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Update your email"
              name="email"
              value={userData.email}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Update your Password"
              name="password"
              value={userData.password}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group controlId="formExpertise">
            <Form.Label>Expertise</Form.Label>
            <Form.Control
              type="text"
              placeholder="Update your expertise"
              name="expertise"
              value={userData.expertise}
              onChange={handleChange}
            />
          </Form.Group>

          {/* Add more form fields based on your user schema */}

          <Button variant="primary" type="submit">
            Update Profile
          </Button>
        </Form>
      </div>
    </div>
  );
};

// Export the ProfileUpdate component as default
export default ProfilePage;
