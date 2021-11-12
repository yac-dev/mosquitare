import React, { useState } from 'react';
import { Button, Form, TextArea } from 'semantic-ui-react';
import '../../styles/meeting.css';

const CreateMeetingForm = (props) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const onSubmitClick = () => {
    props.socket.emit('JOIN MEETING ROOM');
  };

  return (
    <div>
      <Form>
        <Form.Field>
          <label>Meeting title</label>
          <input placeholder='Please write a meeting title' />
        </Form.Field>
        what languages are you gonna exchange?
        <Form.Group widths='equal'>
          <Form.Field>
            <input placeholder='language1' />
          </Form.Field>
          <Form.Field>
            <input placeholder='language2' />
          </Form.Field>
        </Form.Group>
        <Form.Field
          id='form-textarea-control-opinion'
          control={TextArea}
          label='Description'
          placeholder='Please write a description, why you hold this meeting, what you gonna talk about, some conditions etc...'
        />
        <Button type='submit'>Submit</Button>
      </Form>
    </div>
  );
};

export default CreateMeetingForm;
