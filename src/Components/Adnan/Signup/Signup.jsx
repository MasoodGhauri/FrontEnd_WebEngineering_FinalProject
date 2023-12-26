import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../Login/Adnan.css";
import useAccount from "../../hooks/useAccount";


const Signup = () => {
  const { data, setData } = useAccount();
  const [error, setError] = useState("");
  const [profilePreview, setProfilePreview] = useState(null);
  const navigate = useNavigate();
  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    // Update the profile picture data in the state
    setData({ ...data, profilePicture: file });

    // Update the image preview
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Store the image path in Zustand
        setData({ ...data, profilePicturePath: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(data.profilePicture)
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

            {/* Profile Picture Preview */}
            {/* {profilePreview && (
              <div>
                <label>Preview:</label>
                <img
                  src={profilePreview}
                  alt="Profile Preview"
                  style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                />
              </div>
            )} */}

              {/* Profile Picture Input */}
            <div>
              <label htmlFor="profilePicture">Profile Picture</label>
              <input
                type="file"
                id="profilePicture"
                name="profilePicture"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>

            

            <input type="text" placeholder="First Name" name="firstName" onChange={handleChange} value={data.firstName}
              required
              className="input"
            />
            <input type="text" placeholder="Last Name" name="lastName" onChange={handleChange} value={data.lastName}
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
