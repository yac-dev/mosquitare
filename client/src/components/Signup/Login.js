import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Modal, Button } from 'react-bootstrap';
import { Form } from 'semantic-ui-react';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EmailIcon from '@mui/icons-material/Email';
import PasswordIcon from '@mui/icons-material/Password';

import SnackBar from '../Snackbar';
import { Stack } from '@mui/material';

// ac
import { loginActionCreator } from '../../actionCreators/authActionCreators';

const Login = (props) => {
  const renderAlerts = () => {
    if (props.alertsState.length) {
      const alertsSnackBars = props.alertsState.map((alert) => {
        return <SnackBar open={true} id={alert.id} snackBarType={alert.alertType} message={alert.message} />;
      });

      return (
        <div style={{ position: 'absolute', top: '20px', right: '20px' }}>
          <Stack spacing={2}>{alertsSnackBars}</Stack>
        </div>
      );
    }
  };
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitButtonClicked, setSubmitButtonClicked] = useState(false);

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
        {renderAlerts()}
        <Modal.Header>
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
          <Button variant='secondary' onClick={() => props.setShowLoginModal(false)}>
            Close
          </Button>
          <Button variant='primary' onClick={(event) => onSubmitClick(event)}>
            Login
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

const mapStateToProps = (state) => {
  return { alertsState: state.alertsState };
};

export default connect(mapStateToProps, { loginActionCreator })(Login);
