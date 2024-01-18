import React from 'react';
import ContactForm from '../components/ContactForm';

const ContactPage: React.FC = () => {
  return (
    <div>
      <h1>Contact Us</h1>
      <p>
        Whether you have questions, feedback, or just want to connect, we'd love
        to hear from you! Feel free to reach out to us via email or through the
        contact form below.
      </p>

      <h2>Email</h2>
      <p>
        For general inquiries, you can contact us{' '}
        <a href='mailto:KyleEvanBell@gmail.com'>HERE</a>.
      </p>

      <h2>Contact Form</h2>
      <ContactForm />
      {/* Add your contact form component or embed a form here */}

      {/* Feel free to include any additional contact options, such as social media links */}
    </div>
  );
};

export default ContactPage;
