import React, { useState } from "react";
import { Box, Typography, FormLabel, TextField, Button, Link, Alert, Collapse } from "@mui/material";

const AuthForm = React.memo(({ onSubmit, isAdmin }) => {
  const [inputs, setInputs] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [isSignup, setIsSignup] = useState(false); // Track whether it's signup or login
  const [errors, setErrors] = useState({}); // Track validation errors
  const [loginSuccess, setLoginSuccess] = useState(false); // Track login success state

  // Handle input changes
  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [e.target.name]: "", // Clear error when user starts typing
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = {};

    // Check for empty fields
    if (!inputs.email) validationErrors.email = "Please fill in your Email Address";
    if (!inputs.password) validationErrors.password = "Please fill in your Password";

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await onSubmit({ inputs, signup: isAdmin ? false : isSignup }); // Simulate login or signup
      setLoginSuccess(true); // Show success message
      setTimeout(() => setLoginSuccess(false), 3000); // Hide success message after 3 seconds
    } catch (error) {
      console.error("Login failed:", error); // Handle login failure
    }
  };

  // Toggle between Signup and Login
  const toggleForm = () => {
    setIsSignup(!isSignup);
    setErrors({}); // Clear errors when toggling forms
  };

  // Shared text field styles
  const textFieldStyles = {
    backgroundColor: "#000",
    borderRadius: 2,
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#ccc",
      },
      "&:hover fieldset": {
        borderColor: "#888",
      },
    },
    "& .MuiInputBase-input": {
      color: "#fff",
    },
    marginBottom: "16px",
  };

  return (
    <Box
      display="flex"
      justifyContent="flex-start"
      alignItems="center"
      height="100vh"
      padding={3}
      sx={{
        marginTop: "-80px",
      }}
    >
      {/* Left side for form */}
      <Box
        bgcolor="#000"
        borderRadius={5}
        boxShadow={3}
        padding={4}
        width={350}
        display="flex"
        flexDirection="column"
        alignItems="center"
        sx={{
          border: "1px solid #ddd",
        }}
      >
        {/* Title */}
        <Typography
          variant="h4"
          textAlign="center"
          mb={3}
          sx={{
            fontWeight: "bold",
            color: "#fff",
          }}
        >
          {isSignup ? "Sign Up" : "Login"}
        </Typography>

        {/* Success Message */}
        <Collapse in={loginSuccess}>
          <Alert severity="success" sx={{ marginBottom: 2 }}>
            Login successful!
          </Alert>
        </Collapse>

        {/* Form Fields */}
        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <FormLabel sx={{ fontWeight: "bold", color: "#fff" }}>Email Address</FormLabel>
          <TextField
            type="email"
            name="email"
            value={inputs.email}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="outlined"
            sx={textFieldStyles}
            error={!!errors.email}
            helperText={errors.email}
          />

          {isSignup && (
            <>
              <FormLabel sx={{ fontWeight: "bold", color: "#fff" }}>Username</FormLabel>
              <TextField
                type="text"
                name="name"
                value={inputs.name}
                onChange={handleChange}
                fullWidth
                margin="normal"
                variant="outlined"
                sx={textFieldStyles}
                error={!!errors.name}
                helperText={errors.name}
              />
            </>
          )}

          <FormLabel sx={{ fontWeight: "bold", color: "#fff" }}>Password</FormLabel>
          <TextField
            type="password"
            name="password"
            value={inputs.password}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="outlined"
            sx={textFieldStyles}
            error={!!errors.password}
            helperText={errors.password}
          />

          <Button
            variant="contained"
            fullWidth
            sx={{
              marginTop: 3,
              padding: "12px",
              background: "linear-gradient(90deg, #628EFF 0%, #8740CD 53%, #580475 100%)",
              borderRadius: 3,
              "&:hover": {
                background: "linear-gradient(90deg, #580475 0%, #8740CD 53%, #628EFF 100%)",
              },
              fontWeight: "bold",
            }}
            type="submit"
          >
            {isSignup ? "Sign Up" : "Login"}
          </Button>
        </form>

        {/* Switch between Login and Signup */}
        <Typography
          variant="body2"
          mt={2}
          sx={{
            color: "#666",
          }}
        >
          {isSignup ? (
            <span>
              Already have an account?{" "}
              <Link
                component="button"
                variant="body2"
                sx={{
                  color: "#7CC1F3",
                  textDecoration: "none",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
                onClick={toggleForm}
              >
                Login
              </Link>
            </span>
          ) : (
            <span>
              Don't have an account?{" "}
              <Link
                component="button"
                variant="body2"
                sx={{
                  color: "#7CC1F3",
                  textDecoration: "none",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
                onClick={toggleForm}
              >
                Sign Up
              </Link>
            </span>
          )}
        </Typography>
      </Box>

      {/* Right side space for other content */}
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        flex={1}
        bgcolor="#f5f5f5"
      >
        {/* Add your other content here */}
        <Typography variant="h6" textAlign="center" color="#333">
          {/* Other content */}
        </Typography>
      </Box>
    </Box>
  );
});

export default AuthForm;
