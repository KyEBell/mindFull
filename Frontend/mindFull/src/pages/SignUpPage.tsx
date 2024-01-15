import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import userSignUpService from '../services/userSignUpService';
import validateForm from '../utilities/signUpValidationUtil';

interface SignUpPageProps {
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean | null>>;
}

interface SignUpForm {
  username: string;
  password: string;
  email: string;
}

const SignUpPage: React.FC<SignUpPageProps> = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<SignUpForm>({
    username: '',
    password: '',
    email: '',
  });

  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: string;
  }>({});

  const handleFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setValidationErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
    // console.log('validation errors', validationErrors);
    // console.log('formData', formData);
  };

  const handleSignUp = async () => {
    try {
      const errors = validateForm(formData);
      console.log('SIGNUP ERRORS', errors);
      setValidationErrors(errors);
      if (Object.keys(errors).length === 0) {
        const { accessToken, refreshToken } = await userSignUpService(
          formData.username,
          formData.email,
          formData.password
        );
        setIsAuthenticated(true);
        // localStorage.setItem('accessToken', accessToken);
        // localStorage.setItem('refreshToken', refreshToken);
        console.log('AccessToken from signuppage:', accessToken);
        console.log('RefreshToken from signuppage:', refreshToken);
        console.log('user is authenticated and signed in was successful');
        navigate('/dashboard');
      }
    } catch (error) {
      console.log('sign up failed', error);
    }
  };
  return (
    <>
      <h2 style={{ color: '#f9bc60' }}>Create an account</h2>
      <form
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '300px', // Set a fixed width for the form container
          margin: 'auto', // Center the form horizontally
        }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            marginBottom: '10px',
          }}>
          <label>
            Email:
            <input
              type='email'
              name='email'
              value={formData.email}
              onChange={handleFormChange}
              style={{ marginTop: '5px', width: '100%' }}
            />
          </label>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            marginBottom: '10px',
          }}>
          <label>
            Username:
            <input
              type='text'
              name='username'
              value={formData.username}
              onChange={handleFormChange}
              style={{ marginTop: '5px', width: '100%' }}
            />
          </label>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            marginBottom: '10px',
          }}>
          <label>
            Password:
            <input
              type='password'
              name='password'
              value={formData.password}
              onChange={handleFormChange}
              style={{ marginTop: '5px', width: '100%' }}
            />
          </label>
          <button type='button' onClick={handleSignUp}>
            Sign Up!
          </button>
        </div>
      </form>
      <p style={{ color: 'lightblue' }}>
        Already have an account?{' '}
        <Link to='/login' style={{ color: 'lightyellow' }}>
          Click Here
        </Link>
        .
      </p>
    </>
  );
};

export default SignUpPage;
