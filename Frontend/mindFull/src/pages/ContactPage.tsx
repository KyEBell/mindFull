import React from 'react';
import ContactForm from '../components/ContactForm';

const ContactPage: React.FC = () => {
  return (
    <div>
      <h1>Contact Us</h1>
      <p>
        Whether you have questions, feedback, or just want to connect, we'd love
        to hear from you! Feel free to reach out to us through the contact form
        below.
      </p>

      <h2>Contact Form</h2>
      <ContactForm />
    </div>
  );
};

export default ContactPage;
