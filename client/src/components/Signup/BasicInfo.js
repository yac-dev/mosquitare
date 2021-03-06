import React from 'react';
import { connect } from 'react-redux';
import { Button, Form, TextArea } from 'semantic-ui-react';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EmailIcon from '@mui/icons-material/Email';
import PasswordIcon from '@mui/icons-material/Password';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';

import { setSignupModalActionCreator } from '../../actionCreators/modalActionCreator';

const BasicInfo = (props) => {
  const selfIntroductionLength = () => {
    if (props.selfIntroduction.length >= 301) {
      return <span style={{ color: 'red' }}>{props.selfIntroduction.length}/300 (limited up to 300 characters)</span>;
    } else {
      return (
        <>
          <span>{props.selfIntroduction.length}/300</span>
        </>
      );
    }
  };
  return (
    <Form>
      <Form.Field style={{ marginBottom: '20px' }}>
        <label>
          <AccountCircleIcon />
          &nbsp;Name
        </label>
        <input
          type='text'
          placeholder='Please enter your name.'
          onChange={(event) => props.setName(event.target.value)}
          value={props.name}
        />
      </Form.Field>
      <Form.Field style={{ marginBottom: '20px' }}>
        <label>
          <EmailIcon />
          &nbsp;Email
        </label>
        <input
          type='email'
          placeholder='Please enter your email.'
          onChange={(event) => props.setEmail(event.target.value)}
          value={props.email}
        />
      </Form.Field>
      <Form.Field style={{ marginBottom: '20px' }}>
        <label>
          <PasswordIcon />
          &nbsp;Password (At least 8 characters)
        </label>
        <input
          type='password'
          placeholder='Please enter your password.'
          onChange={(event) => props.setPassword(event.target.value)}
          value={props.password}
        />
      </Form.Field>
      <Form.Field style={{ marginBottom: '20px' }}>
        <label>
          <PasswordIcon />
          &nbsp;Password Confirmation
        </label>
        <input
          type='password'
          placeholder='Please enter your password again.'
          onChange={(event) => props.setPasswordConfirmation(event.target.value)}
          value={props.passwordConfirmation}
        />
      </Form.Field>
      <Form.Field style={{ marginBottom: '20px' }}>
        <label>
          <EmojiPeopleIcon />
          &nbsp; Self-Introduction&nbsp;(Not required)&nbsp;
          {selfIntroductionLength()}
        </label>
        <TextArea
          placeholder='Please write about yourself such as your job, interests, why you are learning, how log have you been learning etc'
          onChange={(event) => props.setSelfIntroduction(event.target.value)}
          value={props.selfIntroduction}
        />
      </Form.Field>

      {/* <Button type='submit'>Submit</Button> */}
    </Form>
  );
};

export default connect(null, setSignupModalActionCreator)(BasicInfo);
