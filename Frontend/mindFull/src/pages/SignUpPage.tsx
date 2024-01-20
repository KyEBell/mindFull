import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import userSignUpService from '../services/userSignUpService';
import validateForm from '../utilities/signUpValidationUtil';
import useAuth from '../hooks/useAuth';

interface SignUpForm {
  username: string;
  password: string;
  email: string;
}

const SignUpPage: React.FC = () => {
  const navigate = useNavigate();
  const { setIsAuthenticated } = useAuth();
  const [formData, setFormData] = useState<SignUpForm>({
    username: '',
    password: '',
    email: '',
  });

  //checks for when a user touches a field to ensure valid entry on first attempt to login
  const [touchedFields, setTouchedFields] = useState<{
    [key: string]: boolean;
  }>({});

  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: string;
  }>({});

  const handleFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    const errors = validateForm({ ...formData, [name]: value });
    setValidationErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errors[name] || '',
    }));
    setTouchedFields((prevTouched) => ({ ...prevTouched, [name]: true }));

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
          width: '300px',
          margin: 'auto',
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
              id='email'
              name='email'
              value={formData.email}
              onChange={handleFormChange}
              autoComplete='email'
              onBlur={() =>
                setTouchedFields((prevTouched) => ({
                  ...prevTouched,
                  email: true,
                }))
              }
              style={
                touchedFields.email && validationErrors.email
                  ? { marginTop: '5px', width: '100%', border: '1px solid red' }
                  : { marginTop: '5px', width: '100%' }
              }
            />
          </label>
          {touchedFields.email && validationErrors.email && (
            <p style={{ color: 'red', fontSize: 14 }}>
              {validationErrors.email}
            </p>
          )}
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
              id='username'
              name='username'
              value={formData.username}
              onChange={handleFormChange}
              autoComplete='username'
              onBlur={() =>
                setTouchedFields((prevTouched) => ({
                  ...prevTouched,
                  username: true,
                }))
              }
              style={
                validationErrors.username
                  ? { marginTop: '5px', width: '100%', border: '1px solid red' }
                  : { marginTop: '5px', width: '100%' }
              }
            />
          </label>
          {validationErrors.username && (
            <p style={{ color: 'red', fontSize: 14 }}>
              {validationErrors.username}
            </p>
          )}
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
              id='password'
              name='password'
              value={formData.password}
              onChange={handleFormChange}
              autoComplete='current-password'
              onBlur={() =>
                setTouchedFields((prevTouched) => ({
                  ...prevTouched,
                  password: true,
                }))
              }
              style={
                validationErrors.password
                  ? { marginTop: '5px', width: '100%', border: '1px solid red' }
                  : { marginTop: '5px', width: '100%' }
              }
            />
          </label>
          {validationErrors.password && (
            <p style={{ color: 'red', fontSize: 14 }}>
              {validationErrors.password}
            </p>
          )}
          <button type='button' onClick={handleSignUp}>
            Sign Up!
          </button>
        </div>
      </form>
      <p style={{ color: '#f9bc60' }}>
        Already have an account?{' '}
        <Link to='/login' style={{ color: '#f5a021' }}>
          Click Here
        </Link>
        .
      </p>
    </>
  );
};

export default SignUpPage;
