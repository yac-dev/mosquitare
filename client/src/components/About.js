import React from 'react';
import '../styles/about.css';

const About = () => {
  return (
    <div className='about-wrapper'>
      <h3>About this application</h3>
      <p>Technology</p>
      This application is fully built by JavaScript technology.
      <div className='people'>
        <p>yac kojima&nbsp;&nbsp;founder &amp; CEO</p>
      </div>
      <p>
        If you find some issues or bugs, please send a message to yabbee0828@gmail.com. Thank you and have a enjoy!!
      </p>
    </div>
  );
};

export default About;
