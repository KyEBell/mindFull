import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import userLoginService from '../services/userLoginService';
import styles from '../styles/LoginPage.module.css';
import useAuth from '../hooks/useAuth';

interface LoginForm {
  usernameOrEmail: string;
  password: string;
}
const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { setIsAuthenticated, setUser } = useAuth();
  const [formData, setFormData] = useState<LoginForm>({
    usernameOrEmail: '',
    password: '',
  });

  const handleFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleLogin = async () => {
    try {
      // console.log('Logging in with:', formData);
      const { accessToken, refreshToken, user } = await userLoginService(
        formData.usernameOrEmail,
        formData.password
      );
      console.log('AccessToken:', accessToken);
      console.log('RefreshToken:', refreshToken);
      console.log('user from handle login', user);
      setIsAuthenticated(true);
      setUser(user);
      console.log('uer from set user', user);
      // console.log('user is authenticated!', user);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <h2>Login</h2>
      <form>
        <label>
          Username or Email:
          <input
            type='text'
            id='usernameOrEmail'
            name='usernameOrEmail'
            autoComplete='username'
            value={formData.usernameOrEmail}
            onChange={handleFormChange}
          />
        </label>
        <label>
          Password:
          <input
            type='password'
            id='password'
            name='password'
            autoComplete='current-password'
            value={formData.password}
            onChange={handleFormChange}
          />
        </label>
        <button type='button' onClick={handleLogin}>
          Login
        </button>
      </form>
      <p>
        Don't have an account? Create one <Link to='/signup'>here</Link>.
      </p>
    </div>
  );
};

export default LoginPage;
