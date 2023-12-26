import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import styles from "./Adnan.css";
import useUserLoggedIn  from "../../hooks/useUserLoggedIn";


const Login = () => {
  const [data, setData] = useState({ email: "", password: ""});
  const [role, setRole] = useState(""); // Default role is "student"
  const [error, setError] = useState("");
  const userhook = useUserLoggedIn();
  const navigate = useNavigate();

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
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
      console.log(responseData.role);
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

    userhook.setUser({user: responseData.rest, token: responseData.token});
  
		localStorage.setItem("token", responseData.token);
    
	  } else {
		console.log(responseData.Message);
	  }
	} catch (error) {
	  console.error(error);
	  setError("An error occurred during login. Please try again.");
	}


    console.log(responseData.role)
		if(responseData.role === 'student')
		navigate("/Profilesetting");
		else if (responseData.role === 'teacher'){
		navigate("/Profilesetting")
		}
    else if (responseData.role === 'admin'){ 
      navigate("/AdminHomePage")
    }
    else if (responseData.role === 'superadmin'){ 
      navigate("/SuperAdminPage")
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
