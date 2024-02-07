import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import Notification from './Notification';
import useNotification from '../hooks/useNotification';
import styles from '../styles/Dashboard.module.css';
interface FormData {
  name: string;
  email: string;
  message: string;
}

interface HttpError {
  status: number;
  message: string;
}

const ContactForm: React.FC = () => {
  const contactFormUrl =
    import.meta.env.VITE_BASE_API_URL + 'contact-form-submit';

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();

  const { showNotification, handleNotification } = useNotification();

  const formOnSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      const response = await fetch(contactFormUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();

      if (result.success) {
        console.log('form submitted successfully');
        reset();
        handleNotification(3000);
      } else {
        console.error('Error Submitting form', result.message);
        handleNotification(3000);
      }
    } catch (error: unknown) {
      const knownError = error as HttpError;
      console.error('Error Submitting Form', knownError.message);
      handleNotification(3000);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(formOnSubmit)}
      className={styles.linksContainer}>
      {showNotification && (
        <Notification message='Form Submitted Successfully!' />
      )}
      <div className={styles.formInputContainer}>
        <label htmlFor='name'>Name</label>
        <input
          type='text'
          id='name'
          autoComplete='name'
          {...register('name', { required: 'Name is required' })}
        />
        {errors.name && <span>{errors.name.message}</span>}

        <label htmlFor='email'>Email</label>
        <input
          type='email'
          id='email'
          autoComplete='email'
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address',
            },
          })}
        />
        {errors.email && <span>{errors.email.message}</span>}

        <label htmlFor='message'>Message</label>
        <textarea
          id='message'
          {...register('message', { required: 'Message is required' })}
        />
        {errors.message && <span>{errors.message.message}</span>}
      </div>

      <button type='submit' className={styles.submitButton}>
        Submit
      </button>
    </form>
  );
};

export default ContactForm;
