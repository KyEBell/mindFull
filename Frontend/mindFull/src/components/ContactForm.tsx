import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';

interface FormData {
  name: string;
  email: string;
  message: string;
}

const ContactForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const formOnSubmit: SubmitHandler<FormData> = async (data) => {
    console.log('Form data submitted:', data);
  };

  return (
    <form onSubmit={handleSubmit(formOnSubmit)}>
      <div>
        <label htmlFor='name'>Name</label>
        <input
          type='text'
          id='name'
          {...register('name', { required: 'Name is required' })}
        />
        {errors.name && <span>{errors.name.message}</span>}
      </div>

      <div>
        <label htmlFor='email'>Email</label>
        <input
          type='email'
          id='email'
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address',
            },
          })}
        />
        {errors.email && <span>{errors.email.message}</span>}
      </div>

      <div>
        <label htmlFor='message'>Message</label>
        <textarea
          id='message'
          {...register('message', { required: 'Message is required' })}
        />
        {errors.message && <span>{errors.message.message}</span>}
      </div>

      <button type='submit'>Submit</button>
    </form>
  );
};

export default ContactForm;
