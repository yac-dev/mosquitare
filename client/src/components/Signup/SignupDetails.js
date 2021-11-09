import React, { useEffect, useState } from 'react';
import { Form, Button } from 'semantic-ui-react';
import { connect } from 'react-redux';
import axios from 'axios';
import './signup.css';

import { signupActionCreator } from '../../actionCreators/authActionCreators';

const SignupDetails = (props) => {
  console.log(props.location.state);
  const [fetchedLanguages, setFetchedLanguages] = useState([]);
  const [fetchedCountries, setFetchedCountries] = useState([]);
  const [mainLanguages, setMainLanguages] = useState(['']);
  const [buttonPushed, setButtonPushed] = useState(false);
  const [index, setIndex] = useState(0);

  const [nativeLangs, setNativeLangs] = useState(['']);
  const [learningLangs, setLearningLangs] = useState(['']);
  const [nationalities, setNationalities] = useState(['']);
  const [job, setJob] = useState('');

  const mainLangs = {
    '61711a02dc33a75226a7f363': 'English',
    '61711a02dc33a75226a7f358': 'Chinese',
    '61711a02dc33a75226a7f383': 'Japanese',
    '61711a02dc33a75226a7f36a': 'French',
    '61711a02dc33a75226a7f341': 'Arabic',
    '61711a02dc33a75226a7f3c0': 'Russian',
    '61711a02dc33a75226a7f3bb': 'Portuguese',
    '61711a02dc33a75226a7f36e': 'German',
    '61711a02dc33a75226a7f381': 'Italian',
    '61711a02dc33a75226a7f3cf': 'Spanish; Castilian',
    '61711a02dc33a75226a7f376': 'Hindu',
  };

  const fetchData = async (uri, setState) => {
    const result = await axios.get(uri, {
      baseURL: process.env.REACT_APP_BASE_API_URL,
    });
    const copiedData = [...result.data];
    copiedData.sort(function (a, b) {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });
    setState(copiedData);
  };

  const onLanguageChange = (index, event, state, setState) => {
    event.preventDefault();
    console.log(nativeLangs);
    let newState = [...state];
    newState[index] = event.target.value;
    setState(newState);
  };

  const onMainLanguageChange = (event) => {
    event.preventDefault();
    if (nativeLangs[0] === '') {
      setNativeLangs([]);
    }
    setNativeLangs((nativeLangs) => [...nativeLangs, event.target.value]);
    console.log(nativeLangs);
    setButtonPushed(true);
  };

  const addFormFields = (state, setState) => {
    setState([...state, '']);
  };

  const onJobChange = (event) => {
    setJob(event.target.value);
  };

  const onFormSubmit = async (event) => {
    event.preventDefault();

    const [name, email, password, passwordConfirmation, lng, lat] = props.location.state;
    const location = {
      type: 'Point',
      coordinates: [lng.current, lat.current],
    };

    const formData = {
      name,
      email,
      password,
      passwordConfirmation,
      nativeLangs,
      learningLangs,
      nationalities,
      job,
      location,
    };
    props.signupActionCreator(formData);
  };

  const pickLanguages = () => {
    if (fetchedLanguages.length) {
      const hashed = {};
      for (let i = 0; i < fetchedLanguages.length; i++) {
        hashed[fetchedLanguages[i]._id] = fetchedLanguages[i];
      }
      const pickedLangsArray = [];
      for (const property in mainLangs) {
        pickedLangsArray.push(hashed[property]);
      }

      const pickedLangsRender = pickedLangsArray.map((lang) => {
        return (
          <Button className='picked-language' value={lang._id} onClick={(event) => onMainLanguageChange(event)}>
            {lang.name} <img className='language-img' src={`https://unpkg.com/language-icons/icons/${lang.code}.svg`} />
          </Button>
        );
      });

      return <div className='picked-languages'>{pickedLangsRender}</div>;
    } else {
      return null;
    }
  };

  useEffect(() => {
    fetchData('/languages', setFetchedLanguages);
    fetchData('/countries', setFetchedCountries);
  }, []);

  return (
    <div className='ui container'>
      <Form onSubmit={(event) => onFormSubmit(event)}>
        <p>Select your native languages</p>
        {pickLanguages()}
        {nativeLangs.map((element, index) => {
          const languagesOption = fetchedLanguages.map((language) => {
            return (
              <option key={language._id} value={language._id}>
                {language.name}
              </option>
            );
          });

          return (
            <>
              <select
                className='ui dropdown'
                onChange={(event) => onLanguageChange(index, event, nativeLangs, setNativeLangs)}
              >
                <option value=''>Select language</option>
                {languagesOption}
              </select>
            </>
          );
        })}

        <Button
          className='button-add'
          onClick={(event) => {
            addFormFields(nativeLangs, setNativeLangs);
          }}
        >
          +
        </Button>

        <p>Select your leaning language</p>
        {pickLanguages()}
        {learningLangs.map((element, index) => {
          const languagesOption = fetchedLanguages.map((language) => {
            return (
              <option key={language._id} value={language._id}>
                {language.name}
              </option>
            );
          });

          return (
            <>
              <select
                className='ui dropdown'
                onChange={(event) => onLanguageChange(index, event, learningLangs, setLearningLangs)}
              >
                <option value=''>Select language</option>
                {languagesOption}
              </select>
            </>
          );
        })}

        <Button
          className='button-add'
          onClick={(event) => {
            addFormFields(learningLangs, setLearningLangs);
          }}
        >
          +
        </Button>

        {nationalities.map((element, index) => {
          const countriesOption = fetchedCountries.map((country) => {
            return (
              <option key={country._id} value={country._id}>
                {country.name}
              </option>
            );
          });

          return (
            <>
              <p>Select your nationalities</p>
              <select
                className='ui dropdown'
                onChange={(event) => onLanguageChange(index, event, nationalities, setNationalities)}
              >
                <option value=''>What is your nationality?</option>
                {countriesOption}
              </select>
            </>
          );
        })}

        <Button
          className='button-add'
          onClick={(event) => {
            addFormFields(nationalities, setNationalities);
          }}
        >
          +
        </Button>
        <Form.Field>
          <label>Job</label>
          <input value={job} onChange={(event) => onJobChange(event)} placeholder='Please enter your job.' />
        </Form.Field>

        <Button>Submit</Button>
      </Form>
    </div>
  );
};

export default connect(null, { signupActionCreator })(SignupDetails);
