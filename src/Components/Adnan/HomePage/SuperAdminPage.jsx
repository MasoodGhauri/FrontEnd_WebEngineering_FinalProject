import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Table, Button, Form, Modal } from 'react-bootstrap';
import useUserLoggedIn from '../../hooks/useUserLoggedIn';
import { useNavigate } from 'react-router-dom';

const SuperAdminPage = () => {
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: '',
  });
  const { user, token } = useUserLoggedIn();
    const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async (route, setFunction) => {
      try {
        const response = await fetch(`http://localhost:3001/${route}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            token: token,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const usersData = await response.json();
        setFunction(usersData);
      } catch (error) {
        console.error(error);
        // Handle error
      }
    };

    fetchData('allteachers', setTeachers);
    fetchData('allstudents', setStudents);
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleBlockUnblock = async (userId, blocked, userType) => {
    try {
      const response = await fetch(`http://localhost:3001/${blocked ? 'unblock' : 'block'}/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          token: token,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      if (userType === 'teacher') {
        setTeachers((prevTeachers) =>
          prevTeachers.map((teacher) =>
            teacher._id === userId ? { ...teacher, isBlocked: !blocked } : teacher
          )
        );
      } else if (userType === 'student') {
        setStudents((prevStudents) =>
          prevStudents.map((student) =>
            student._id === userId ? { ...student, isBlocked: !blocked } : student
          )
        );
      }
    } catch (error) {
      console.error(error);
      // Handle error
    }
  };

  const handleIncreaseLevel = async (userId) => {
    try {
      const response = await fetch(`http://localhost:3001/updatelevel/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          token: token,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      setTeachers((prevTeachers) =>
        prevTeachers.map((teacher) =>
          teacher._id === userId ? { ...teacher, level: teacher.level + 1 } : teacher
        )
      );
    } catch (error) {
      console.error(error);
      // Handle error
    }
  };

  const handleDeleteUser = async (userId, userType) => {
    try {
      const response = await fetch(`http://localhost:3001/deleteuser/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          token: token,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      if (userType === 'teacher') {
        setTeachers((prevTeachers) => prevTeachers.filter((teacher) => teacher._id !== userId));
      } else if (userType === 'student') {
        setStudents((prevStudents) => prevStudents.filter((student) => student._id !== userId));
      }
    } catch (error) {
      console.error(error);
      // Handle error
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFormSubmit = async () => {
    try {
      const response = await fetch('http://localhost:3001/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          token: token,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      

      setShowForm(false);
      window.alert('New Admin has been created succesfully!');
    } catch (error) {
      console.error(error);
      // Handle error
    }
  };

  return (
    <div style={{ marginTop: '70px' }}>
      <Navbar style={{ backgroundColor: '#7DCEA0' }} variant="light" fixed="top">
        {/* Navbar Brand and Links */}
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
          {/* Add Admin button */}
        <Nav.Link onClick={() => setShowForm(true)} style={{ color: '#FFF', fontWeight: 'bold' }}>
          Add Admin
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

      {/* Teachers Table */}
      <h2>Super Admin Home Page</h2>
      <h3>Teachers</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Expertise</th>
            <th>Level</th>
            <th>Blocked</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {teachers.map((teacher) => (
            <tr key={teacher.id}>
              <td>{teacher._id}</td>
              <td>{teacher.firstName}</td>
              <td>{teacher.email}</td>
              <td>{teacher.expertise}</td>
              <td>{teacher.level}</td>
              <td>{teacher.isBlocked ? 'Blocked' : 'Active'}</td>
              <td>
                <Button
                  variant={teacher.isBlocked ? 'success' : 'danger'}
                  onClick={() => handleBlockUnblock(teacher._id, teacher.isBlocked, 'teacher')}
                >
                  {teacher.isBlocked ? 'Unblock' : 'Block'}
                </Button>
                <Button variant="primary" onClick={() => handleIncreaseLevel(teacher._id)}>
                  Increase Level
                </Button>
                <Button variant="danger" onClick={() => handleDeleteUser(teacher._id, 'teacher')}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Students Table */}
      <h3>Students</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Balance</th>
            <th>Blocked</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td>{student._id}</td>
              <td>{student.firstName}</td>
              <td>{student.email}</td>
              <td>{student.accountbalance}</td>
              <td>{student.isBlocked ? 'Blocked' : 'Active'}</td>
              <td>
                <Button
                  variant={student.isBlocked ? 'success' : 'danger'}
                  onClick={() => handleBlockUnblock(student._id, student.isBlocked, 'student')}
                >
                  {student.isBlocked ? 'Unblock' : 'Block'}
                </Button>
                <Button variant="danger" onClick={() => handleDeleteUser(student._id, 'student')}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Admin Registration Form */}
      <Modal show={showForm} onHide={() => setShowForm(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Admin</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formFirstName">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter first name"
                name="firstName"
                value={formData.firstName}
                onChange={handleFormChange}
              />
            </Form.Group>
            <Form.Group controlId="formLastName">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter last name"
                name="lastName"
                value={formData.lastName}
                onChange={handleFormChange}
              />
            </Form.Group>

            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter Email"
                name="email"
                value={formData.email}
                onChange={handleFormChange}
              />
            </Form.Group>

            <Form.Group controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter Password"
                name="password"
                value={formData.password}
                onChange={handleFormChange}
              />
            </Form.Group>

            <Form.Group controlId="formRole">
              <Form.Label>Role</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter role"
                name="role"
                value={formData.role}
                onChange={handleFormChange}
              />
            </Form.Group>
            <Button variant="primary" onClick={handleFormSubmit}>
              Register
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default SuperAdminPage;
