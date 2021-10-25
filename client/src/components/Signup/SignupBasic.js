import React, { useState, useEffect } from 'react';
import { Button, Form } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

// componentDidMount() {
//   window.navigator.geolocation.getCurrentPosition(
//     (position) => {
//       this.setState({ lat: Number(position.coords.latitude.toFixed(1)) });
//       this.setState({ lng: Number(position.coords.longitude.toFixed(1)) });
//     },
//     (error) => {
//       console.log(error);
//     }
//   );
// }

const SignupBasic = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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
        <Link to={{ pathname: '/signup/details', state: [name, email, password] }}>Next</Link>
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
