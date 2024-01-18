import React from 'react';

const ResourcePage: React.FC = () => {
  return (
    <div>
      {/* Hotline Information */}
      <div>
        <h2>24/7 Crisis Hotline</h2>
        <div>
          <img src='/phone-icon.png' alt='Phone Icon' />
          <p>Call: 988</p>
        </div>
        <div>
          <img src='/text-icon.png' alt='Text Icon' />
          <p>Text: 988</p>
        </div>
        <div>
          <img src='/chat-icon.png' alt='Chat Icon' />
          <p>Chat: 988</p>
        </div>
      </div>

      <h2> Check out the great resources below</h2>
      <div>
        <a
          href='https://dayoneapp.com/blog/journaling/'
          target='_blank'
          rel='noopener noreferrer'>
          <button>
            <img src='/journal-icon.png' alt='Journal Icon' />
            <p>How to Journal</p>
          </button>
        </a>
        <p>Explore techniques and tips for effective journaling.</p>

        {/* Button 2: Benefits of Journaling */}
        <a
          href='https://dayoneapp.com/blog/benefits-of-journaling-for-mental-health/#:~:text=Studies%20have%20shown%20that%20engaging,of%20journaling%20for%20mental%20health.'
          target='_blank'
          rel='noopener noreferrer'>
          <button>
            <img src='/benefits-icon.png' alt='Benefits Icon' />
            <p>Benefits of Journaling</p>
          </button>
        </a>
        <p>Discover the positive impacts of maintaining a journal.</p>

        {/* Button 3: Additional Resource */}
        <a
          href='https://psychcentral.com/blog/ready-set-journal-64-journaling-prompts-for-self-discovery#the-journal-prompts'
          target='_blank'
          rel='noopener noreferrer'>
          <button>
            <img src='/additional-icon.png' alt='Additional Resource Icon' />
            <p>Explore More</p>
          </button>
        </a>
        <p>Unsure of what to journal about? Click here for some prompts</p>
      </div>
    </div>
  );
};

export default ResourcePage;
