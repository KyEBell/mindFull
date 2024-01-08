import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import userLoginService from '../services/userLoginService';
import styles from '../styles/LoginPage.module.css';

interface LoginForm {
  usernameOrEmail: string;
  password: string;
}

const LoginPage: React.FC = () => {
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
    console.log('formData', formData);
  };

  const handleLogin = () => {
    console.log('Logging in with:', formData);
    userLoginService(formData.usernameOrEmail, '', formData.password);
  };

  return (
    <div className={styles.loginContainer}>
      <h2>Login</h2>
      <form>
        <label>
          Username or Email:
          <input
            type='text'
            name='usernameOrEmail'
            value={formData.usernameOrEmail}
            onChange={handleFormChange}
          />
        </label>
        <label>
          Password:
          <input
            type='password'
            name='password'
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
