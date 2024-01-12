import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface SignUpPageProps {
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}

interface SignUpForm {
  username: string;
  password: string;
  email: string;
}

const SignUpPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<SignUpForm>({
    username: '',
    password: '',
    email: '',
  });

  const handleFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    console.log('formData', formData);
  };

  return (
    <>
      <h2>Create an account</h2>
      <form>
        <label>
          Email:
          <input
            type='email'
            name='email'
            value={formData.email}
            onChange={handleFormChange}
          />
        </label>
        <label>
          Username:
          <input
            type='text'
            name='username'
            value={formData.username}
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
      </form>
    </>
  );
};

export default SignUpPage;
