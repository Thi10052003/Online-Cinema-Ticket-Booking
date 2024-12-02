import React, { useState } from 'react';
import { Box, Typography, FormLabel, TextField, Button, Link } from '@mui/material';

const AuthForm = ({ onSubmit, isAdmin }) => {
  const [inputs, setInputs] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [isSignup, setIsSignup] = useState(false); // Track whether it's signup or login

  // Handle input changes
  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ inputs, signup: isAdmin ? false : isSignup }); // Pass signup based on isAdmin or isSignup
  };

  // Toggle between Signup and Login
  const toggleForm = () => {
    setIsSignup(!isSignup);
  };

  return (
    <Box
      display="flex"
      justifyContent="flex-start"
      alignItems="center"
      height="100vh"
      padding={3}
      sx={{
        marginTop: '-80px',
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
          border: '1px solid #ddd',
        }}
      >
        {/* Title */}
        <Typography
          variant="h4"
          textAlign="center"
          mb={3}
          sx={{
            fontWeight: 'bold',
            color: '#fff',
          }}
        >
          {isSignup ? 'Sign Up' : 'Login'}
        </Typography>

        {/* Form Fields */}
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <FormLabel sx={{ fontWeight: 'bold', color: '#fff' }}>Email Address</FormLabel>
          <TextField
            type="email"
            name="email"
            value={inputs.email}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="outlined"
            sx={{
              backgroundColor: '#000',
              borderRadius: 2,
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#ccc',
                },
                '&:hover fieldset': {
                  borderColor: '#888',
                },
              },
              '& .MuiInputBase-input': {
                color: '#fff',
              },
              marginBottom: '16px',
            }}
          />

          {isSignup && (
            <>
              <FormLabel sx={{ fontWeight: 'bold', color: '#fff' }}>Username</FormLabel>
              <TextField
                type="text"
                name="name"
                value={inputs.name}
                onChange={handleChange}
                fullWidth
                margin="normal"
                variant="outlined"
                sx={{
                  backgroundColor: '#000',
                  borderRadius: 2,
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#ccc',
                    },
                    '&:hover fieldset': {
                      borderColor: '#888',
                    },
                  },
                  '& .MuiInputBase-input': {
                    color: '#fff',
                  },
                  marginBottom: '16px',
                }}
              />
            </>
          )}

          <FormLabel sx={{ fontWeight: 'bold', color: '#fff' }}>Password</FormLabel>
          <TextField
            type="password"
            name="password"
            value={inputs.password}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="outlined"
            sx={{
              backgroundColor: '#000',
              borderRadius: 2,
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#ccc',
                },
                '&:hover fieldset': {
                  borderColor: '#888',
                },
              },
              '& .MuiInputBase-input': {
                color: '#fff',
              },
              marginBottom: '16px',
            }}
          />

          <Button
            variant="contained"
            fullWidth
            sx={{
              marginTop: 3,
              padding: '12px',
              background: 'linear-gradient(90deg, #628EFF 0%, #8740CD 53%, #580475 100%)',
              borderRadius: 3,
              '&:hover': {
                background: 'linear-gradient(90deg, #580475 0%, #8740CD 53%, #628EFF 100%)',
              },
              fontWeight: 'bold',
            }}
            type="submit"
          >
            {isSignup ? 'Sign Up' : 'Login'}
          </Button>
        </form>

        {/* Switch between Login and Signup */}
        <Typography
          variant="body2"
          mt={2}
          sx={{
            color: '#666',
          }}
        >
          {isSignup ? (
            <span>
              Already have an account?{' '}
              <Link
                component="button"
                variant="body2"
                sx={{
                  color: '#7CC1F3',
                  textDecoration: 'none',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                }}
                onClick={toggleForm}
              >
                Login
              </Link>
            </span>
          ) : (
            <span>
              Don't have an account?{' '}
              <Link
                component="button"
                variant="body2"
                sx={{
                  color: '#7CC1F3',
                  textDecoration: 'none',
                  cursor: 'pointer',
                  fontWeight: 'bold',
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
};

export default AuthForm;
