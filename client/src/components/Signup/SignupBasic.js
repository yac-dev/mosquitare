import React, { useState, useEffect, useRef } from 'react';
import { Button, Form } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import './signup.css';

const SignupBasic = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [errorMessage, setErrorMessagea] = useState('');
  const lng = useRef(null);
  const lat = useRef(null);
  // const socketId = useRef(null);

  // const socket = io(process.env.REACT_APP_WEBRTC);
  // const [location, setLocation] = useState([]);

  // const [position, setPosition] = useState({ lng: null, lat: null });

  // useEffect(() => {
  //   // get geo
  //   navigator.geolocation.getCurrentPosition((position) => {
  //     const { longitude, latitude } = position.coords;
  //     location.push(longitude, latitude);
  //     console.log(location);
  //     // console.log(longitude, latitude);
  //     // console.log(longitude, latitude);
  //     // setPosition({ ...position, lng: longitude, lat: latitude });
  //     // console.log(position);
  //     // setLocation([...location, longitude, latitude]);
  //     // console.log(location);
  //   });
  // }, []);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(function (position) {
      lng.current = position.coords.longitude;
      lat.current = position.coords.latitude;
      console.log(lng);
      console.log(lat);
    });
  }, []);

  const onNextClick = (event) => {
    console.log(password, passwordConfirmation);
    if (password !== passwordConfirmation || !(lng && lat)) {
      event.preventDefault();
      if (!(lng && lat)) {
        setErrorMessagea('Require geo data.');
      }
      if (password !== passwordConfirmation) {
        setErrorMessagea('Please reenter your password correctlly.');
      }
      setTimeout(() => {
        setErrorMessagea('');
      }, 2000);
    }
  }; // ????

  const doesNotMatchRender = () => {
    if (errorMessage) {
      return <p style={{ color: 'red' }}>{errorMessage}</p>;
    }
  };

  return (
    <div className='signup-basic-wrapper'>
      {doesNotMatchRender()}
      <Form className='signup-basic-form'>
        <Form.Field>
          <label>Name</label>
          <input value={name} onChange={(event) => setName(event.target.value)} placeholder='Please enter your name.' />
        </Form.Field>
        <Form.Field>
          <label>Email</label>
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder='Please enter your email.'
          />
        </Form.Field>
        <Form.Field>
          <label>Password</label>
          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder='Please enter password.'
          />
        </Form.Field>
        <Form.Field>
          <label>Password Confirmation</label>
          <input
            value={passwordConfirmation}
            onChange={(event) => setPasswordConfirmation(event.target.value)}
            placeholder='Please reenter your password.'
          />
        </Form.Field>
        <Button type='submit'>
          <Link
            to={{ pathname: '/signup/details', state: [name, email, password, passwordConfirmation, lng, lat] }}
            onClick={(event) => onNextClick(event)}
          >
            Next
          </Link>
        </Button>
      </Form>
    </div>
  );
};

export default SignupBasic;
