import React, { useEffect, useState } from 'react';
import { Form, Button } from 'semantic-ui-react';
import { connect } from 'react-redux';
import path from 'path';
import axios from 'axios';
import English from '../../../node_modules/language-icons/icons/en.svg';
import './signup.css';

// redux....
import { signupActionCreator } from '../../actionCreators/authActionCreators';
require('dotenv').config({ path: path.join(__dirname, '../', '../', '../', '.env') });

const SignupDetails = (props) => {
  console.log(props.location.state);
  // useState
  // fetched datas
  const [fetchedLanguages, setFetchedLanguages] = useState([]);
  const [fetchedCountries, setFetchedCountries] = useState([]);
  const [mainLanguages, setMainLanguages] = useState([]);

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

  // const swap = (index1, index2, array) => {
  //   let temp = array[index1];
  //   array[index1] = array[index2];
  //   array[index2] = temp;
  // };

  // const bubbleSort = (data) => {
  //   for (let i = 0; i < data.length; i++) {
  //     for (let j = 0; j < data.length - 1; j++) {
  //       if (data[j] > data[j + 1]) {
  //         swap(j, j + 1, data);
  //       }
  //     }
  //   }
  //   return data;
  // };

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

  const handleChange = (index, event, state, setState) => {
    let newState = [...state];
    newState[index] = event.target.value;
    setState(newState);
  };

  const addFormFields = (state, setState) => {
    setState([...state, '']);
  };

  const onJobChange = (event) => {
    setJob(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const [name, email, password, passwordConfirmation, lng, lat, socketId] = props.location.state;
    const location = {
      type: 'Point',
      coordinates: [lng.current, lat.current],
    };

    console.log(location, socketId.current);
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
      socketId: socketId.current,
    };

    // const result = await axios.post('/users/signup', formData, {
    //   baseURL: process.env.REACT_APP_BASE_API_URL,
    // });
    props.signupActionCreator(formData);
    // localStorage.setItem('mosquitare token', result.data.jwtToken);
    // console.log(result);

    // ここのapi, languageとcountryのdata populateしないといけないな。
  };

  const pickLanguages = () => {
    if (fetchedLanguages) {
      const hashed = {};
      for (let i = 0; i < fetchedLanguages.length; i++) {
        hashed[fetchedLanguages[i]._id] = fetchedLanguages[i];
      }
      const pickedLangsArr = [];
      for (const property in mainLangs) {
        console.log(property);
        pickedLangsArr.push(hashed[property]);
      }

      let pickedLangsRender;

      nativeLangs.map((element, index) => {
        pickedLangsRender = pickedLangsArr.map((lang) => {
          return (
            <button
              value={lang._id}
              onClick={(event) => {
                handleChange(event, index, nativeLangs, setNativeLangs);
              }}
            >
              {lang.name}{' '}
              <img className='language-img' src={`https://unpkg.com/language-icons/icons/${lang.code}.svg`} />
            </button>
          );
        });
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

  // const renderForm = (fetchedData, stateData, setStateData, tagPhrase, buttonPhrase) => {
  //   return (
  //     <>
  //       {stateData.map((element, index) => {
  //         // まず、languageのlist展開。
  //         const option = fetchedData.map((dataElement) => {
  //           return (
  //             <option key={dataElement._id} value={dataElement._id}>
  //               {dataElement.name}
  //             </option>
  //           );
  //         });

  //         return (
  //           <>
  //             <select className='ui dropdown' onChange={(event) => handleChange(index, event, stateData, setStateData)}>
  //               <option value=''>{tagPhrase}</option>
  //               {option}
  //             </select>
  //           </>
  //         );
  //       })}
  //       <Button
  //         onClick={(event) => {
  //           addFormFields(stateData, setStateData);
  //         }}
  //       >
  //         {buttonPhrase}
  //       </Button>
  //     </>
  //   );
  // };

  return (
    <div className='ui container'>
      <Form onSubmit={(event) => handleSubmit(event)}>
        {/* {renderForm(fetchedLanguages, nativeLangs, setNativeLangs, 'Select language')}
        <Button
          onClick={(event) => {
            addFormFields(nativeLangs, setNativeLangs);
          }}
        >
          Add more language
        </Button>

        {renderForm(fetchedLanguages, nativeLangs, setNativeLangs, 'Select leaninge')}
        <Button
          onClick={(event) => {
            addFormFields(nativeLangs, setNativeLangs);
          }}
        >
          Add more leaning language
        </Button>

        {renderForm(fetchedLanguages, nativeLangs, setNativeLangs, 'Select nationality')}
        <Button
          onClick={(event) => {
            addFormFields(nationalities, setNationalities);
          }}
        >
          Add more nationality
        </Button> */}

        {nativeLangs.map((element, index) => {
          // まず、languageのlist展開。
          const languagesOption = fetchedLanguages.map((language) => {
            return (
              <option key={language._id} value={language._id}>
                {language.name}
              </option>
            );
          });

          return (
            <>
              <p>Select your native languages</p>
              <select
                className='ui dropdown'
                onChange={(event) => handleChange(index, event, nativeLangs, setNativeLangs)}
              >
                <option value=''>Select language</option>
                {languagesOption}
              </select>
            </>
          );
        })}
        {pickLanguages()}
        <Button
          className='button-add'
          onClick={(event) => {
            addFormFields(nativeLangs, setNativeLangs);
          }}
        >
          +
        </Button>

        {learningLangs.map((element, index) => {
          // まず、languageのlist展開。
          const languagesOption = fetchedLanguages.map((language) => {
            return (
              <option key={language._id} value={language._id}>
                {language.name}
              </option>
            );
          });

          return (
            <>
              <p>Select your leaning language</p>
              <select
                className='ui dropdown'
                onChange={(event) => handleChange(index, event, learningLangs, setLearningLangs)}
              >
                <option value=''>Select language</option>
                {languagesOption}
              </select>
            </>
          );
        })}
        {pickLanguages()}
        <Button
          className='button-add'
          onClick={(event) => {
            addFormFields(learningLangs, setLearningLangs);
          }}
        >
          +
        </Button>

        {nationalities.map((element, index) => {
          // まず、languageのlist展開。
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
                onChange={(event) => handleChange(index, event, nationalities, setNationalities)}
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
