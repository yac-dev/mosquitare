import React, { useEffect, useState } from 'react';
import { Form, Button } from 'semantic-ui-react';
import path from 'path';
import axios from 'axios';
import Dropdown from '../Dropdown';
require('dotenv').config({ path: path.join(__dirname, '../', '../', '../', '.env') });

const SignupDetails = () => {
  // useState
  const [languages, setLanguages] = useState([]);

  useEffect(() => {
    const getLanguages = async () => {
      const result = await axios.get('/languages', {
        baseURL: process.env.REACT_APP_BASE_API_URL,
      });
      setLanguages(result.data);
    };
    getLanguages();
  }, []);

  console.log(languages);
  return (
    <div className='ui container'>
      <Form>
        <label>Your Native Languages</label>
        <Dropdown languagesOption={languages} />

        <Form.Group widths='equal'>
          <Form.Input
            onChange={(event) => {
              this.setState({ lang1: event.target.value });
            }}
            fluid
            label='Learning Language1'
          />
          <Form.Input
            onChange={(event) => {
              this.setState({ lang2: event.target.value });
            }}
            fluid
            label='Learning Language2'
          />
          <Form.Input
            onChange={(event) => {
              this.setState({ lang2: event.target.value });
            }}
            fluid
            label='Learning Language3'
          />
        </Form.Group>

        <Form.Field>
          <label>Nationalities</label>
          <input placeholder='Last Name' />
        </Form.Field>
        <Form.Field>
          <label>Job</label>
          <input placeholder='Please enter your job.' />
        </Form.Field>
        <Button>Submit</Button>
      </Form>
    </div>
  );
};

export default SignupDetails;
