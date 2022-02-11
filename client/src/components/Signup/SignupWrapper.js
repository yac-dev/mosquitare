import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

// components
import BasicInfo from './BasicInfo';
import DetailInfo from './DetailInfo';

const SignupWrapper = (props) => {
  // basic info用
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [photo, setPhoto] = useState('');

  // detail info用
  const [learningLanguages, setLearningLanguages] = useState([]);
  const [nativeLanguages, setNativeLanguages] = useState([]);
  const [nationalities, setNationalities] = useState([]);
  const [location, setLocation] = useState('');
  const [job, setJob] = useState('');

  const [amIFillingBasic, setAmIFillingBasic] = useState(true);

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
            job={job}
            setJob={setJob}
          />
        </>
      );
    }
  };

  const renderModalFooter = () => {
    if (amIFillingBasic) {
      return (
        <>
          <Button variant='secondary' onClick={() => props.setShowSignupModal(false)}>
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
          <Button variant='primary' onClick={() => onSubmitClick()}>
            Submit!!
          </Button>
        </>
      );
    }
  };

  const onSubmitClick = () => {
    const formData = {
      name: name,
      email: email,
      password: password,
      passwordConfirmation: passwordConfirmation,
      photo: photo,
      learningLanguages: learningLanguages,
      nativeLanguages: nativeLanguages,
      nationalities: nationalities,
      location: location,
    };
    // これをbodyとして、api requestを送る。
    console.log(formData);
  };

  return (
    <>
      <Modal
        show={props.showSignupModal}
        onHide={() => {
          props.setShowSignupModal(false);
          // setAmIFillingBasic(true); これいらないかな。。。
        }}
        backdrop='static'
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Welcome to Lamppost!</Modal.Title>
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

export default SignupWrapper;
