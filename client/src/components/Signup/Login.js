import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Modal, Button } from 'react-bootstrap';
import { Form } from 'semantic-ui-react';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EmailIcon from '@mui/icons-material/Email';
import PasswordIcon from '@mui/icons-material/Password';

// ac
import { loginActionCreator } from '../../actionCreators/authActionCreators';

const Login = (props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmitClick = (event) => {
    event.preventDefault();
    const formData = {
      email: email,
      password: password,
    };

    props.loginActionCreator(formData);
  };

  return (
    <>
      <Modal
        show={props.showLoginModal}
        onHide={() => {
          props.setShowLoginModal(false);
          // setAmIFillingBasic(true); これいらないかな。。。
        }}
        backdrop='static'
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Login</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Field>
              <label>
                <EmailIcon />
                &nbsp;Email
              </label>
              <input
                type='email'
                placeholder='Please enter your email.'
                onChange={(event) => setEmail(event.target.value)}
                value={email}
              />
            </Form.Field>
            <Form.Field>
              <label>
                <PasswordIcon />
                &nbsp;Password
              </label>
              <input
                type='password'
                placeholder='Please enter your password.'
                onChange={(event) => setPassword(event.target.value)}
                value={password}
              />
            </Form.Field>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='primary' onClick={(event) => onSubmitClick(event)}>
            Login
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default connect(null, { loginActionCreator })(Login);
