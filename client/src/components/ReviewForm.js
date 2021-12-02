import React, { useState, useRef } from 'react';
import { Button, Form, Rating } from 'semantic-ui-react';
import ReactStars from 'react-rating-stars-component';
import { Tooltip } from '@mui/material';
// import audio from './1638434235029-7dad157d-6fa9-4472-8b44-228ca2e372ee.wav';
import audio from './file_example_WAV_1MG.wav';

const Review = (props) => {
  const [askDating, setAskDating] = useState(null);
  const [askRelationship, setAskRelationship] = useState(null);
  const [askIdIn10m, setAskIdIn10m] = useState(null);
  const [isPracticing, setIsPracticing] = useState(null);
  const [isListening, setIsListening] = useState(null);
  const [isPublicOk, setIsPublicOk] = useState(null);

  const onFormSubmit = () => {
    console.log(askDating, askRelationship, askIdIn10m, isPracticing, isListening, isPublicOk);
  };

  return (
    <>
      <Form>
        <Form.Field>
          <label>Did your partner ask you for dating?</label>
          <Button onClick={(event) => setAskDating(0)}>No</Button>
          <Button onClick={(event) => setAskDating(5)}>Yes</Button>
        </Form.Field>

        <Form.Field>
          <label>
            Did your partner ask you about your relationship status or your type?&nbsp;
            <Tooltip title='e.g. Do you have a boyfriend/girlfriend? Are you married? What is you type?'>
              <i className='question circle icon'></i>
            </Tooltip>
          </label>
          <Button onClick={(event) => setAskRelationship(0)}>No</Button>
          <Button onClick={(event) => setAskRelationship(5)}>Yes</Button>
        </Form.Field>

        <Form.Field>
          <label>
            Did your partner ask you for your social media id IN FIRST 10 MINUTES?&nbsp;
            <Tooltip title='e.g. facebook, Snapchat, Whatsapp, Instagram, Line'>
              <i className='question circle icon'></i>
            </Tooltip>
          </label>
          <Button onClick={(event) => setAskIdIn10m(0)}>No</Button>
          <Button onClick={(event) => setAskIdIn10m(5)}>Yes</Button>
        </Form.Field>

        <Form.Field>
          <label>Was your partner passionate about practicing?</label>
          <ReactStars count={3} onChange={(newRating) => setIsPracticing(newRating)} size={18} activeColor='#ffd700' />
        </Form.Field>

        <Form.Field>
          <label>Was your partner trying to listen to you?</label>
          <ReactStars count={3} onChange={(newRating) => setIsListening(newRating)} size={18} activeColor='#ffd700' />
        </Form.Field>

        <Form.Field>
          <label>Do you want to talk with this partner again?</label>
          <Button onClick={() => setIsPublicOk(true)}>Yes</Button>
          <Button onClick={() => setIsPublicOk(false)}>No</Button>
        </Form.Field>

        <Form.Field>
          <label>Do you want to show your conversation in public and get some advices?</label>
          <Button onClick={() => setIsPublicOk(true)}>Yes</Button>
          <Button onClick={() => setIsPublicOk(false)}>No</Button>
        </Form.Field>

        <Button onClick={onFormSubmit}>Submit</Button>
      </Form>
      <audio controls>
        <source src={audio} type='audio/wav' />
      </audio>
    </>
  );
};

export default Review;
