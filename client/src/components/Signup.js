import React from 'react';
import { Button, Form } from 'semantic-ui-react';

class Signup extends React.Component {
  state = {
    name: '',
    email: '',
    password: '',
    nativeLanguage: '',
    lang1: '',
    lang2: '',
    lang3: '',
    languages: [],
    lat: null,
    lng: null,
  };

  componentDidMount() {
    window.navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setState({ lat: Number(position.coords.latitude.toFixed(1)) });
        this.setState({ lng: Number(position.coords.longitude.toFixed(1)) });
      },
      (error) => {
        console.log(error);
      }
    );
  }

  onFormSubmit = async () => {};

  render() {
    return (
      <Form>
        <Form.Field>
          <label>Name</label>
          <input
            value={this.state.name}
            onChange={(event) => {
              this.setState({ name: event.target.value });
            }}
            placeholder='Please enter your name.'
          />
        </Form.Field>

        <Form.Field>
          <label>Email</label>
          <input
            value={this.state.email}
            onChange={(event) => {
              this.setState({ email: event.target.value });
            }}
            placeholder='Please enter your email.'
          />
        </Form.Field>

        <Form.Field>
          <label>Password</label>
          <input
            value={this.state.password}
            onChange={(event) => {
              this.setState({ password: event.target.value });
            }}
            placeholder='Please enter password.'
          />
        </Form.Field>

        <Form.Field>
          <label>Native Language</label>
          <input
            onChange={(event) => {
              this.setState({ nativeLanguage: event.target.value });
            }}
            placeholder='Please enter your native language.'
          />
        </Form.Field>
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
        <Button type='submit'>Submit</Button>
      </Form>
    );
  }
}

export default Signup;
