import React from 'react';
import { Button, Form } from 'semantic-ui-react';
import { signupActionCreator } from '../../actionCreators/authActionCreators';

// componentDidMount() {
//   window.navigator.geolocation.getCurrentPosition(
//     (position) => {
//       this.setState({ lat: Number(position.coords.latitude.toFixed(1)) });
//       this.setState({ lng: Number(position.coords.longitude.toFixed(1)) });
//     },
//     (error) => {
//       console.log(error);
//     }
//   );
// }

class Signup extends React.Component {
  state = {
    name: '',
    email: '',
    password: '',
    nativeLanguage: [],
    lang1: [],
    lang2: [],
    lang3: [],
    languages: [],
    nationalities: [],
    // nationalitiesArray: [],
  };

  onFormSubmit = async () => {
    console.log(this.state);
    const nativeLangInfo = {},
      lang1Info = {},
      lang2Info = {},
      lang3Info = {};
    nativeLangInfo[this.state.nativeLanguage[0]] = this.state.nativeLanguage[1];
    lang1Info[this.state.lang1[0]] = this.state.lang1[1];
    lang2Info[this.state.lang2[0]] = this.state.lang2[1];
    lang3Info[this.state.lang3[0]] = this.state.lang3[1];

    this.state.languages.push(nativeLangInfo, lang1Info, lang2Info, lang3Info);
    this.nationalities.push();

    const formValue = {
      name: this.state.name,
      email: this.state.name,
      password: this.state.password,
      languages: this.state.languages,
    };
  };

  render() {
    return (
      <div className='ui container'>
        <div>Basic User Info</div>
        <Form onSubmit={this.onFormSubmit}>
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
          <Button type='submit'>Next</Button>
        </Form>
      </div>
    );
  }
}

export default Signup;