import React from 'react';
import { Button, Form } from 'semantic-ui-react';

const CreateRoomForm = () => {
  return (
    <div className='room-form-wrapper'>
      <Form>
        <Form.Field>
          <label>What languages you wanna exchange?</label>
          <input placeholder='First Name' />
        </Form.Field>
        <Form.Field>
          <label>language1</label>
          <input placeholder='language1' />
        </Form.Field>
        <Form.Field>
          <label>language2</label>
          <input placeholder='language2' />
        </Form.Field>

        <Button type='submit'>Submit</Button>
      </Form>
    </div>
  );
};

export default CreateRoomForm;
