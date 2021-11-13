import React from 'react';
import { Link } from 'react-router-dom';

class LandingPage extends React.Component {
  render() {
    return (
      <>
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
        <div class='container my-5'>
          <footer class='text-center text-white' style={{ backgroundColor: '#f1f1f1' }}>
            <div class='container pt-4'>
              <section class='mb-4'>
                <a
                  class='btn btn-link btn-floating btn-lg text-dark m-1'
                  href='#!'
                  role='button'
                  data-mdb-ripple-color='dark'
                >
                  <i class='fab fa-facebook-f'></i>
                </a>

                <a
                  class='btn btn-link btn-floating btn-lg text-dark m-1'
                  href='#!'
                  role='button'
                  data-mdb-ripple-color='dark'
                >
                  <i class='fab fa-twitter'></i>
                </a>

                <a
                  class='btn btn-link btn-floating btn-lg text-dark m-1'
                  href='#!'
                  role='button'
                  data-mdb-ripple-color='dark'
                >
                  <i class='fab fa-google'></i>
                </a>

                <a
                  class='btn btn-link btn-floating btn-lg text-dark m-1'
                  href='#!'
                  role='button'
                  data-mdb-ripple-color='dark'
                >
                  <i class='fab fa-instagram'></i>
                </a>

                <a
                  class='btn btn-link btn-floating btn-lg text-dark m-1'
                  href='#!'
                  role='button'
                  data-mdb-ripple-color='dark'
                >
                  <i class='fab fa-linkedin'></i>
                </a>

                <a
                  class='btn btn-link btn-floating btn-lg text-dark m-1'
                  href='#!'
                  role='button'
                  data-mdb-ripple-color='dark'
                >
                  <i class='fab fa-github'></i>
                </a>
              </section>
            </div>

            <div class='text-center text-dark p-3' style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
              © 2020 Copyright:
              <a class='text-dark' href='https://mdbootstrap.com/'>
                yac/ yosuke kojima
              </a>
            </div>
          </footer>
        </div>
      </>
    );
  }
}

export default LandingPage;
