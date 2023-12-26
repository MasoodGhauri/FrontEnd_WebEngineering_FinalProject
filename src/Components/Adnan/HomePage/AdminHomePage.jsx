import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Table } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import useUserLoggedIn from '../../hooks/useUserLoggedIn';

const AdminHome = () => {
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const navigate = useNavigate();
  const sortedTeachers = teachers.slice().sort((a, b) => b.level - a.level);
  const { user, token } = useUserLoggedIn();

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

    // Fetch all teachers
    fetchData('allteachers', setTeachers);
    // Fetch all students
    fetchData('allstudents', setStudents);
  }, []); // Only run once on component mount

  const handleBlockUnblock = async (userId, blocked, userType) => {
    try {
      // Implement block/unblock logic on the server
      const response = await fetch(`http://localhost:3001/${blocked ? 'unblock' : 'block'}/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          token: token
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Update the state based on the response
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
      // Implement level increase logic on the server
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
  
      // Update the state based on the response using the functional form
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
      // Implement delete user logic on the server
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

      // Update the state based on the response
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

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div style={{ marginTop: '70px' }}>
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

      <h2>Admin Home Page</h2>

      {/* Teachers Table */}
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
          {sortedTeachers.map((teacher) => (
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
    </div>
  );
};

export default AdminHome;
