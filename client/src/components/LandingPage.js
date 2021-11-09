import React from 'react';
import { Link } from 'react-router-dom';

class LandingPage extends React.Component {
  render() {
    return (
      <div className='welcome'>
        <div className='messages-wrapper'>
          <div className='message'>Welcome!</div>
          <div className='message'>¡Bienvenido!</div>
          <div className='message'>Bienvenue!</div>
          <div className='message'>欢迎!</div>
          <div className='message'>ようこそ!</div>
          <div className='message'>Добро пожаловать!</div>
          <div className='message'>!أهلا بك</div>
          <div className='message'>Benveniti!</div>
          <div className='message'>willkommen</div>
          <div className='message'>Bemvindo</div>
          <div className='message'>Bemvindo</div>
        </div>
        <div className='signup-login'>
          <Link to='/signup/basic'>Signup?</Link>
          <Link to='/login'>Login?</Link>
        </div>
      </div>
    );
  }
}

export default LandingPage;
