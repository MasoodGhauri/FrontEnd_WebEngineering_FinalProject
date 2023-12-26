import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../Login/Adnan.css";
import useAccount from "../../hooks/useAccount";


const Signup = () => {
  const { data, setData } = useAccount();
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    navigate("/Subscriptiondetails");
  };

  return (
    <div className="signup_container">
      <div className="signup_form_container">
        <div className="left">
          <h1>Welcome Back</h1>
          <Link to="/login">
            <button type="button" className="white_btn">
              Sign in
            </button>
          </Link>
        </div>
        <div className="right">
          <form className="form_container" onSubmit={handleSubmit}>
            <h2>Create Account</h2>
            <input type="text" placeholder="First Name" name="firstname" onChange={handleChange} value={data.firstname}
              required
              className="input"
            />
            <input type="text" placeholder="Last Name" name="lastname" onChange={handleChange} value={data.lastname}
              required
              className="input"
            />
            <input type="email" placeholder="Email" name="email" onChange={handleChange} value={data.email}
              required
              className="input"
            />
            <input type="password" placeholder="Password" name="password" onChange={handleChange} value={data.password}
              required
              className="input"
            />

            <input type="text" placeholder="Expertise in Subject (For Teacher only)" name="expertise" onChange={handleChange} value={data.expertise}
              //required
              className="input"
            />

            <div>
              <label>
                <input
                  type="radio"
                  name="role"
                  value="student"
                  checked={data.role === "student"}
                  onChange={handleChange}
                />
                Student
              </label>
              <label>
                <input
                  type="radio"
                  name="role"
                  value="teacher"
                  checked={data.role === "teacher"}
                  onChange={handleChange}
                />
                Teacher
              </label>
            </div>



            {error && <div className={styles.error_msg}>{error}</div>}
            <button type="submit" className="green_btn">
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
