import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../lib/api';
import { toast } from "sonner";

const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rememberMe: false
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await loginUser(formData.username, formData.password);
      // The token is already saved in localStorage by the function
      // You can navigate to dashboard or handle the response as needed
      navigate('/dashboard');
    } catch (error) {
      toast.error('Login failed: ' + (error.message || 'Invalid credentials'));
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Inline styles for consistent appearance
  const formContainerStyle = {
    maxWidth: "450px", 
    width: "100%",
    backgroundColor: "#131A2B",
    borderRadius: "0.5rem",
    padding: "1.5rem",
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
    border: "1px solid #2A3655",
    margin: "0 auto"
  };
  
  const inputStyle = {
    width: "100%",
    padding: "0.75rem 1rem",
    backgroundColor: "transparent",
    color: "white",
    border: "1px solid #2A3655",
    borderRadius: "0.375rem",
    marginBottom: "1rem"
  };
  
  const buttonStyle = {
    width: "100%",
    padding: "0.75rem 1rem",
    background: "linear-gradient(to right, #4f74ff, #2f4ff5)",
    color: "white",
    border: "none",
    borderRadius: "0.375rem",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s ease",
    marginTop: "1.5rem",
    boxShadow: "0 4px 6px -1px rgba(79, 116, 255, 0.2)",
    transform: "translateY(0)",
  };
  
  const buttonHoverStyle = {
    ...buttonStyle,
    background: "linear-gradient(to right, #3e63f5, #1e36e6)",
    boxShadow: "0 6px 10px -1px rgba(79, 116, 255, 0.3)",
    transform: "translateY(-2px)",
  };
  
  const checkboxContainerStyle = {
    display: "flex",
    alignItems: "center",
    marginBottom: "1.5rem",
    marginTop: "1rem",
  };
  
  const checkboxStyle = {
    width: "1rem",
    height: "1rem",
    marginRight: "0.5rem",
    accentColor: "#4f74ff",
  };
  
  const [isButtonHovered, setIsButtonHovered] = useState(false);

  return (
    <div style={formContainerStyle}>
      <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", textAlign: "center", marginBottom: "1.5rem", color: "white" }}>MoonSide AI Admin</h2>
      <p style={{ color: "#94a3b8", textAlign: "center", marginBottom: "1.5rem" }}>Enter your credentials to access the dashboard</p>
      
      <form onSubmit={handleSubmit}>
        <div>
          <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", marginBottom: "0.5rem", color: "#e2e8f0" }} htmlFor="username">
            Username
          </label>
          <input
            style={inputStyle}
            id="username"
            name="username"
            type="text"
            placeholder="Enter your username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
            <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#e2e8f0" }} htmlFor="password">
              Password
            </label>
            <button type="button" style={{ fontSize: "0.75rem", color: "#4f74ff", background: "none", border: "none", cursor: "pointer" }}>
              Forgot password?
            </button>
          </div>
          <input
            style={inputStyle}
            id="password"
            name="password"
            type="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          
          <div style={checkboxContainerStyle}>
            <input
              style={checkboxStyle}
              id="rememberMe"
              name="rememberMe"
              type="checkbox"
              checked={formData.rememberMe}
              onChange={handleChange}
            />
            <label style={{ fontSize: "0.875rem", color: "#e2e8f0" }} htmlFor="rememberMe">
              Remember me
            </label>
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            style={isButtonHovered ? buttonHoverStyle : buttonStyle}
            onMouseEnter={() => setIsButtonHovered(true)}
            onMouseLeave={() => setIsButtonHovered(false)}
          >
            {isLoading ? (
              <span style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg style={{ animation: "spin 1s linear infinite", marginRight: "0.5rem", width: "1rem", height: "1rem" }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle style={{ opacity: "0.25" }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path style={{ opacity: "0.75" }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </span>
            ) : "Sign in"}
          </button>
        </div>
      </form>
      
      <p style={{ marginTop: "1.5rem", fontSize: "0.875rem", color: "#94a3b8", textAlign: "center" }}>
        Don't have admin access? Contact your system administrator.
      </p>
    </div>
  );
};

export default LoginForm;
