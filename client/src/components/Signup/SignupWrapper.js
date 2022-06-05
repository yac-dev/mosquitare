import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Modal, Button } from 'react-bootstrap';

// components
import BasicInfo from './BasicInfo';
import DetailInfo from './DetailInfo';
import SnackBar from '../Snackbar';

// mui components
import Stack from '@mui/material/Stack';

// ac
import { signupActionCreator } from '../../actionCreators/authActionCreators';
import { alertActionCreator } from '../../actionCreators/alertsActionCreator';
import { setSignupModalActionCreator } from '../../actionCreators/modalActionCreator';

const SignupWrapper = (props) => {
  // basic info用
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [photo, setPhoto] = useState('');
  const [selfIntroduction, setSelfIntroduction] = useState('');

  // detail info用
  const [learningLanguages, setLearningLanguages] = useState([]);
  const [nativeLanguages, setNativeLanguages] = useState([]);
  const [nationalities, setNationalities] = useState([]);
  const [location, setLocation] = useState('');
  const [visited, setVisited] = useState([]);

  const [amIFillingBasic, setAmIFillingBasic] = useState(true);
  const [submitButtonClicked, setSubmitButtonClicked] = useState(false);

  const renderAlerts = () => {
    if (props.alertsState.length) {
      const alertsSnackBars = props.alertsState.map((alert) => {
        return <SnackBar open={true} id={alert.id} snackBarType={alert.alertType} message={alert.message} />;
      });

      return (
        <div style={{ position: 'absolute', top: '20px', right: '20px' }}>
          <Stack spacing={2}>{alertsSnackBars}</Stack>
        </div>
      );
    }
  };

  const renderModalBody = () => {
    if (amIFillingBasic) {
      return (
        <>
          <BasicInfo
            name={name}
            setName={setName}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            passwordConfirmation={passwordConfirmation}
            setPasswordConfirmation={setPasswordConfirmation}
            photo={photo}
            setPhoto={setPhoto}
            selfIntroduction={selfIntroduction}
            setSelfIntroduction={setSelfIntroduction}
          />
        </>
      );
    } else {
      return (
        <>
          <DetailInfo
            learningLanguages={learningLanguages}
            setLearningLanguages={setLearningLanguages}
            nativeLanguages={nativeLanguages}
            setNativeLanguages={setNativeLanguages}
            nationalities={nationalities}
            setNationalities={setNationalities}
            location={location}
            setLocation={setLocation}
            visited={visited}
            setVisited={setVisited}
          />
        </>
      );
    }
  };

  const renderModalFooter = () => {
    if (amIFillingBasic) {
      return (
        <>
          <Button
            variant='secondary'
            onClick={() => {
              props.setSignupModalActionCreator(false);
              props.setShowSignupModal(false);
            }}
          >
            Close
          </Button>
          <Button variant='primary' onClick={() => setAmIFillingBasic(false)}>
            Next→
          </Button>
        </>
      );
    } else {
      return (
        <>
          <Button variant='secondary' onClick={() => setAmIFillingBasic(true)}>
            ←back
          </Button>
          {submitButtonClicked ? (
            <Button variant='primary' disabled={true}>
              Done
            </Button>
          ) : (
            <Button variant='primary' onClick={() => onSubmitClick()}>
              Submit!!
            </Button>
          )}
          {/* <Button variant='primary' onClick={() => onSubmitClick()}>
            Submit!!
          </Button> */}
        </>
      );
    }
  };

  const checkLanguagesMultiple = (learningLanguages, nativeLanguages) => {
    console.log(learningLanguages);
    console.log(nativeLanguages);
    for (let i = 0; i < learningLanguages.length; i++) {
      for (let j = 0; j < nativeLanguages.length; j++) {
        if (learningLanguages[i].value === nativeLanguages[j].value) {
          return false;
        }
      }
    }
    return true;
  };

  const onSubmitClick = () => {
    if (
      !name ||
      !email ||
      !password ||
      !passwordConfirmation ||
      // !selfIntroduction ||
      selfIntroduction.length >= 301 ||
      !learningLanguages.length ||
      !nativeLanguages.length ||
      !nationalities.length ||
      !checkLanguagesMultiple(learningLanguages, nativeLanguages) ||
      password !== passwordConfirmation ||
      password.length <= 7
    ) {
      if (name === '') {
        props.alertActionCreator('Please enter your name.', 'error');
      }
      if (email === '') {
        props.alertActionCreator('Please enter your email.', 'error');
      }
      if (password === '') {
        props.alertActionCreator('Please enter your password.', 'error');
      }
      if (passwordConfirmation === '') {
        props.alertActionCreator('Please enter your password again.', 'error');
      }
      // if (selfIntroduction === '') {
      //   props.alertActionCreator('Please write your self-introduction.', 'error');
      // }
      if (selfIntroduction.length >= 301) {
        props.alertActionCreator('Self-Introduction is limited at most 300 characters.', 'error');
      }
      if (learningLanguages.length === 0) {
        props.alertActionCreator('Please select at least one learning language.', 'error');
      }
      if (nativeLanguages.length === 0) {
        props.alertActionCreator('Please select at least one native language.', 'error');
      }
      if (nationalities.length === 0) {
        props.alertActionCreator('Please select at least one nationality.', 'error');
      }
      if (location === '') {
        props.alertActionCreator('Please select your country.', 'error');
      }
      if (password !== passwordConfirmation) {
        props.alertActionCreator("Your passwords don't match. Please enter again.", 'error');
      }
      if (password.length <= 7) {
        props.alertActionCreator('Password should be at least 8 characters.', 'error');
      }
      if (!checkLanguagesMultiple(learningLanguages, nativeLanguages)) {
        props.alertActionCreator('You cannot have same language in learning language and fluent language.', 'error');
      }
    } else {
      const formData = {
        name: name,
        email: email,
        password: password,
        passwordConfirmation: passwordConfirmation,
        // photo: photo,
        selfIntroduction: selfIntroduction,
        learningLangs: learningLanguages,
        nativeLangs: nativeLanguages,
        nationalities: nationalities,
        location: location,
        visited: visited,
      };
      setSubmitButtonClicked(true);
      console.log(formData);
      props.signupActionCreator(formData);
    }
  };

  return (
    <>
      <Modal
        show={props.showSignupModal}
        onHide={() => {
          props.setShowSignupModal(false);
        }}
        backdrop='static'
        keyboard={false}
        // bsPrefix='signup-modal'
      >
        {renderAlerts()}
        <Modal.Header>
          <Modal.Title style={{ color: 'black' }}>Welcome to Lampost!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className='signup-form'>{renderModalBody()}</div>
        </Modal.Body>
        <Modal.Footer>
          <>{renderModalFooter()}</>
        </Modal.Footer>
      </Modal>
    </>
  );
};

const mapStateToProps = (state) => {
  return { alertsState: state.alertsState };
};

export default connect(mapStateToProps, { signupActionCreator, alertActionCreator, setSignupModalActionCreator })(
  SignupWrapper
);
