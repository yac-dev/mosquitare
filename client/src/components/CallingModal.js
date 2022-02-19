import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Modal } from 'react-bootstrap';
import { Button } from 'semantic-ui-react';

// components
import Dimer from './Dimer';
import UserInfoCardNew from './UserInfoCardNew';
// import UserInfoCard from './UserInfoCard';

// css
import '../styles/callingModal.css';
import '../styles/userInfocardNew.css';

import { answerCallActionCreator1 } from '../actionCreators/mediaActionCreator';
import { myCallIsAcceptedActionCreator } from '../actionCreators/mediaActionCreator';

const CallingModal = (props) => {
  // modal bodyがcallをかけたか受けたかで変わるようにする。

  useEffect(() => {
    // 少なくとも、ここのcomponentでは、refをもたない。refを持つのはfulscreenの方だからね。
    props.myCallIsAcceptedActionCreator(props.socket, props.setShowCallingModal);
  }, []);

  const handleAnswerCall = () => {
    props.setShowCallingModal(false);
    props.answerCallActionCreator1(); // これを閉じて、fullscreenまでは出た。
  };

  const switchRender = () => {
    if (props.mediaState.amICalling) {
      return (
        <div className='dimmer-wrapper'>
          <Dimer />
        </div>
      );
    } else if (props.mediaState.amIRecieving) {
      const { exchangingLanguages } = props.mediaState;
      return (
        <>
          <div>You got a exchange application.</div>
          <div>
            Lets exchange{' '}
            {exchangingLanguages.map((language) => {
              return <span>{language}</span>;
            })}
          </div>
          <UserInfoCardNew user={props.mediaState.callingWith} />
          <Button positive onClick={() => handleAnswerCall()} style={{ width: '70%' }}>
            <i className='handshake icon' />
            Yes
          </Button>
          <Button negative style={{ width: '70%' }}>
            <i className='x icon' />
            No
          </Button>
          {/* <div className='confirmation'>
            <div className='userinfo-card'>
              <div className='upper-card'>
                <div className='language-space'>
                  {props.mediaState.callingWith.nativeLangs.map((lang) => (
                    <div className='speaking-languages'>
                      {lang.name} &nbsp;
                      <img className='language-img' src={`https://unpkg.com/language-icons/icons/${lang.code}.svg`} />
                    </div>
                  ))}

                  {props.mediaState.callingWith.learningLangs.map((lang) => (
                    <div className='learning-languages'>
                      {lang.name} &nbsp;
                      <img className='language-img' src={`https://unpkg.com/language-icons/icons/${lang.code}.svg`} />
                    </div>
                  ))}
                </div>
                <div className='userinfo-space'>
                  <div>Total Status</div>
                  <div>{props.mediaState.callingWith.name}</div>
                  <div>Job</div>
                  {props.mediaState.callingWith.nationalities.map((nationality) => (
                    <div className='countries'>
                      {nationality.name} &nbsp;
                      <img className='country-img' src={nationality.flagPic} />
                    </div>
                  ))}
                </div>
              </div>
              <div className='lower-card'>
                <div>Respectful</div>
                <div>Student</div>
                <div>Teacher</div>
              </div>
            </div>
            <Button positive onClick={() => handleAnswerCall()} style={{ width: '100%' }}>
              <i className='handshake icon' />
              Yes
            </Button>
            <Button negative style={{ width: '100%' }}>
              <i className='x icon' />
              No
            </Button>
          </div> */}
        </>
      );
    }
  };

  return (
    <>
      <Modal show={props.show} onHide={() => props.setShowCallingModal(false)} backdrop='static' keyboard={false}>
        <Modal.Body bsPrefix='calling-modal-body'>{switchRender()}</Modal.Body>
        <Modal.Footer>
          <Button
            variant='secondary'
            // onClick={handleClose}
          >
            Close
          </Button>
          <Button variant='primary'>Cancel Call</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

const mapStateToProps = (state) => {
  return { mediaState: state.mediaState };
};

export default connect(mapStateToProps, { answerCallActionCreator1, myCallIsAcceptedActionCreator })(CallingModal);
