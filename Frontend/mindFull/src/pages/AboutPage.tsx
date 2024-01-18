import React from 'react';
import { NavLink } from 'react-router-dom';

const AboutPage: React.FC = () => {
  return (
    <div>
      <h1>About mindFull</h1>
      <p>
        Welcome to mindFull, your personal space for thoughtful introspection.
        mindFull goes beyond being a simple journaling tool; it's designed to
        enhance the mental well-being of users through meaningful
        self-reflection.
      </p>
      <h2>Our Mission</h2>
      <p>
        At mindFull, our mission is to promote mindfulness and contribute to the
        improvement of mental well-being. We believe that thoughtful reflection
        can empower individuals to navigate life with a positive mindset.
      </p>
      <h2>Key Features</h2>
      <ul>
        <li>Effortless journaling for daily reflections</li>
        <li>Secure journal entries with end-to-end encryption</li>
        <li>Simple and user-friendly interface</li>
      </ul>
      <h2>Our Journey</h2>
      <p>
        The development of mindFull has been a journey of learning and growth.
        We faced challenges and celebrated successes, all of which have
        contributed to making mindFull the app it is today.
      </p>
      <h2>Future Plans</h2>
      <p>
        Exciting things are in store for mindFull! We're working on new features
        and improvements to provide an even better experience for our users.
      </p>
      <h2>Contact Us</h2>
      <p>
        Have questions, suggestions, or just want to connect? Feel free to reach
        out to Kyle using our <NavLink to='/contact'>Contact Form</NavLink>
      </p>
    </div>
  );
};

export default AboutPage;
