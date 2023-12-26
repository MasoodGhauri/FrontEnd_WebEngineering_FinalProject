import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import styles from "./Adnan.css";

const Login = () => {
  const [data, setData] = useState({ email: "", password: ""});
  const [role, setRole] = useState("student"); // Default role is "student"
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  const handleRoleChange = () => {
  };

  const handleSubmit = async (e) => {
	e.preventDefault();
  let GetRole = "http://localhost:3001/role";
  const response1 = await fetch(GetRole, {
    	method: "POST",
    	headers: {
    	  "Content-Type": "application/json",
    	},
    	body: JSON.stringify({
    	  email: data.email,
    	  password: data.password,
    	}),
      });
      const responseData = await response1.json();
    setRole(responseData.role);
   //console.log(responseData.role);
	try {
    //const localApiUrl = process.env.LOCAL_API_URL;
	  let loginApiEndpoint = "";
		loginApiEndpoint = "http://localhost:3001/login"; 
  
	  const response = await fetch(loginApiEndpoint, {
		method: "POST",
		headers: {
		  "Content-Type": "application/json",
		},
		body: JSON.stringify({
		  email: data.email,
		  password: data.password
		}),
	  });
  
	  if (!response.ok) {
		throw new Error(`HTTP error! Status: ${response.status}`);
	  }
  
	  const responseData = await response.json();
  
	  if (responseData.Success === true) {
		console.log(responseData);
  
		localStorage.setItem("token", responseData.token);
		if(role === 'student')
		navigate("/signup");
		else if (role === 'teacher'){
		navigate("/signup")
		}
    else if (role === 'admin'){ 
      navigate("/signup")
    }
    else{
      navigate("/signup")
    }
	  } else {
		console.log(responseData.Message);
	  }
	} catch (error) {
	  console.error(error);
	  setError("An error occurred during login. Please try again.");
	}
  };
  

  return (
    <div className="login_container">
      <div className="login_form_container">
        <div className="lleft">
          <form className="form_container" onSubmit={handleSubmit}>
            <h1>Login to Your Account</h1>
            <input
              type="email"
              placeholder="Email"
              name="email"
              onChange={handleChange}
              value={data.email}
              required
              className="input"
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={handleChange}
              value={data.password}
              required
              className="input"
            />
            {error && <div className="error_msg">{error}</div>}
            <button type="submit" className="green_btn">
              Sign In
            </button>
          </form>
        </div>
        <div className="rright">
          <h1>New Here ?</h1>
          <Link to="/signup">
            <button type="button" className="white_btn">
              Sign Up
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
