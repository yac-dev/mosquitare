import React from 'react';
import { Button, Form } from 'semantic-ui-react';

const BasicInfo = (props) => {
  return (
    <Form>
      <Form.Field>
        <label>Name</label>
        <input
          type='text'
          placeholder='Please enter your name.'
          onChange={(event) => props.setName(event.target.value)}
          value={props.name}
        />
      </Form.Field>
      <Form.Field>
        <label>Email</label>
        <input
          type='email'
          placeholder='Please enter your email.'
          onChange={(event) => props.setEmail(event.target.value)}
          value={props.email}
        />
      </Form.Field>
      <Form.Field>
        <label>Password</label>
        <input
          type='password'
          placeholder='Please enter your password.'
          onChange={(event) => props.setPassword(event.target.value)}
          value={props.password}
        />
      </Form.Field>
      <Form.Field>
        <label>Password Confirmation</label>
        <input
          type='password'
          placeholder='Please enter your password again.'
          onChange={(event) => props.setPasswordConfirmation(event.target.value)}
          value={props.passwordConfirmation}
        />
      </Form.Field>
      <Form.Field>
        <label>Your picture (Not required)</label>
        <input type='file' onChange={() => props.setPhoto()} />
      </Form.Field>
      {/* <Button type='submit'>Submit</Button> */}
    </Form>
  );
};

export default BasicInfo;
