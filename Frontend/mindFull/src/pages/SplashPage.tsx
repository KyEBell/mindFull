import React, { useState } from 'react';
import Notification from '../components/Notification';

const SplashPage: React.FC = () => {
  const [isLoggedOut, setIsLoggedOut] = useState(false);

  return (
    <div>
      {isLoggedOut && (
        <Notification
          message='You have successfully logged out'
          onClose={() => setIsLoggedOut(true)}
        />
      )}
      <h1>This is the splash page</h1>
    </div>
  );
};

export default SplashPage;
