import React, { useEffect, useState } from 'react';
import { Form, Button } from 'semantic-ui-react';
import { connect } from 'react-redux';
import path from 'path';
import axios from 'axios';

// redux....
import { signupActionCreator } from '../../actionCreators/authActionCreators';
require('dotenv').config({ path: path.join(__dirname, '../', '../', '../', '.env') });

const SignupDetails = (props) => {
  // useState
  // fetched datas
  const [fetchedLanguages, setFetchedLanguages] = useState([]);
  const [fetchedCountries, setFetchedCountries] = useState([]);

  const [nativeLangs, setNativeLangs] = useState(['']);
  const [learningLangs, setLearningLangs] = useState(['']);
  const [nationalities, setNationalities] = useState(['']);
  const [job, setJob] = useState('');

  const fetchData = async (uri, setState) => {
    const result = await axios.get(uri, {
      baseURL: process.env.REACT_APP_BASE_API_URL,
    });
    setState(result.data);
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
    const [name, email, password, passwordConfirmation] = props.location.state;
    const formData = {
      name,
      email,
      password,
      passwordConfirmation,
      nativeLangs,
      learningLangs,
      nationalities,
      job,
    };

    // const result = await axios.post('/users/signup', formData, {
    //   baseURL: process.env.REACT_APP_BASE_API_URL,
    // });
    props.signupActionCreator(formData);
    // localStorage.setItem('mosquitare token', result.data.jwtToken);
    // console.log(result);

    // ここのapi, languageとcountryのdata populateしないといけないな。
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
