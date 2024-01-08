import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
  };

  const handleLogin = () => {
    // Perform login logic here
    console.log('Logging in with:', formData);
    // Redirect to home or dashboard after successful login
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
