import React from 'react';
import { Button, Form } from 'semantic-ui-react';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EmailIcon from '@mui/icons-material/Email';
import PasswordIcon from '@mui/icons-material/Password';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const BasicInfo = (props) => {
  return (
    <Form>
      <Form.Field>
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
      <Form.Field>
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
      <Form.Field>
        <label>
          <PasswordIcon />
          &nbsp;Password
        </label>
        <input
          type='password'
          placeholder='Please enter your password.'
          onChange={(event) => props.setPassword(event.target.value)}
          value={props.password}
        />
      </Form.Field>
      <Form.Field>
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
      <Form.Field>
        <label>
          <CloudUploadIcon />
          &nbsp; Profile Image (Not required)
        </label>
        <input type='file' onChange={() => props.setPhoto()} />
      </Form.Field>
      {/* <Button type='submit'>Submit</Button> */}
    </Form>
  );
};

export default BasicInfo;
