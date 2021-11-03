import React, { useState } from 'react';
import { connect } from 'react-redux';
import { loginActionCreator } from '../actionCreators/authActionCreators';

const Login = (props) => {
  // hooks system
  const [loginFormState, setLoginFormState] = useState({
    email: '',
    password: '',
  });

  const onSubmit = (event) => {
    event.preventDefault();
    props.loginActionCreator(loginFormState);
  };

  const onChange = (event) => {
    setLoginFormState({
      ...loginFormState,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <React.Fragment>
      <h2>Login</h2>
      <form className='ui form' onSubmit={onSubmit}>
        <div className='field'>
          <label>Email</label>
          <input name='email' type='email' onChange={onChange} />
        </div>
        <div className='field'>
          <label>Password</label>
          <input name='password' type='password' onChange={onChange} />
        </div>
        <button>Login!</button>
      </form>
    </React.Fragment>
  );
};

export default connect(null, { loginActionCreator })(Login);
