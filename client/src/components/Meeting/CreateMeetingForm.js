import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Button, Form, TextArea } from 'semantic-ui-react';
import '../../styles/meeting.css';

// action creators
import { createMeetingActionCreator } from '../../actionCreators/meetingsActionCreator';

// socket event
import { JOIN_MEETING } from '../../actionCreators/socketEvents';

const CreateMeetingForm = (props) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [language1, setLanguage1] = useState('');
  const [language2, setLanguage2] = useState('');

  const onButtonClick = (event) => {
    event.preventDefault();
    const formData = {
      organizer: props.authState.currentUser,
      language1,
      language2,
      title,
      description,
    };
    props.socket.emit(JOIN_MEETING, { roomName: title });
    console.log('gonna send!!');
    props.createMeetingActionCreator(formData);
    // そして、ここでpost のrequestを送る。
    props.onHide();
  };

  return (
    <div>
      <Form>
        <Form.Field>
          <label>Meeting title</label>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder='Please write a meeting title'
          />
        </Form.Field>
        what languages are you gonna exchange?
        <Form.Group widths='equal'>
          <Form.Field>
            <input placeholder='language1' value={language1} onChange={(event) => setLanguage1(event.target.value)} />
          </Form.Field>
          <Form.Field>
            <input placeholder='language2' value={language2} onChange={(event) => setLanguage2(event.target.value)} />
          </Form.Field>
        </Form.Group>
        <Form.Field
          id='form-textarea-control-opinion'
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          control={TextArea}
          label='Description'
          placeholder='Please write a description, why you hold this meeting, what you gonna talk about, some conditions etc...'
        />
        <Button type='submit' onClick={(event) => onButtonClick(event)}>
          Submit
        </Button>
      </Form>
    </div>
  );
};

const mapStateToProps = (state) => {
  return { authState: state.authState };
};

export default connect(mapStateToProps, { createMeetingActionCreator })(CreateMeetingForm);
