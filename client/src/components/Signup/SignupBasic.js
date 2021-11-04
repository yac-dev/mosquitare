import React, { useState, useEffect, useRef } from 'react';
import { Button, Form } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import { io } from 'socket.io-client';
import { I_GOT_SOCKET_ID } from '../../actionCreators/socketEvents';

const SignupBasic = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const location = [];
  const lng = useRef(null);
  const lat = useRef(null);
  const socketId = useRef(null);

  const socket = io(process.env.REACT_APP_WEBRTC);
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
    if ('geolocation' in navigator) {
      console.log('Available');
    } else {
      console.log('Not Available');
    }
    navigator.geolocation.getCurrentPosition(function (position) {
      lng.current = position.coords.longitude;
      lat.current = position.coords.latitude;
      console.log(lng);
      console.log(lat);
    });
  }, []);

  useEffect(() => {
    socket.on(I_GOT_SOCKET_ID, (socketIdFromServer) => {
      socketId.current = socketIdFromServer;
    });
  }, [socket]);

  return (
    <div className='ui container'>
      <div>Basic User Info</div>
      <Form>
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
        <Link
          to={{ pathname: '/signup/details', state: [name, email, password, passwordConfirmation, lng, lat, socketId] }}
        >
          Next
        </Link>
      </Form>
    </div>
  );
};

export default SignupBasic;

// class Signup extends React.Component {
//   state = {
//     name: '',
//     email: '',
//     password: '',
//   };

//   onFormSubmit = async () => {
//     console.log(this.state);
//   };

//   render() {
//     return (
//     <div className='ui container'>
//       <div>Basic User Info</div>
//       <Form onSubmit={this.onFormSubmit}>
//         <Form.Field>
//           <label>Name</label>
//           <input
//             value={this.state.name}
//             onChange={(event) => {
//               this.setState({ name: event.target.value });
//             }}
//             placeholder='Please enter your name.'
//           />
//         </Form.Field>

//         <Form.Field>
//           <label>Email</label>
//           <input
//             value={this.state.email}
//             onChange={(event) => {
//               this.setState({ email: event.target.value });
//             }}
//             placeholder='Please enter your email.'
//           />
//         </Form.Field>

//         <Form.Field>
//           <label>Password</label>
//           <input
//             value={this.state.password}
//             onChange={(event) => {
//               this.setState({ password: event.target.value });
//             }}
//             placeholder='Please enter password.'
//           />
//         </Form.Field>
//         <Button type='submit'>Next</Button>
//       </Form>
//     </div>
//   );
// }
// }

// export default Signup;
