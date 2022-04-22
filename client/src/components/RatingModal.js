import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Modal } from 'react-bootstrap';
import { Button } from '@mui/material';

import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';
import { Tooltip } from '@mui/material';
import HelpIcon from '@mui/icons-material/Help';
import Zoom from '@mui/material/Zoom';
import EditIcon from '@mui/icons-material/Edit';
import { Stack } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

// componetns
import Snackbar from './Snackbar';

// ac
import { alertActionCreator } from '../actionCreators/alertsActionCreator';
import { createRatingActionCreator } from '../actionCreators/ratingsActionCreator';

const RatingModal = (props) => {
  const [enthusiasticValue, setEnthusiasticValue] = useState(0);
  const [friendlyValue, setFriendlyValue] = useState(0);
  const [helpfulValue, setHelpfulValue] = useState(0);
  const [patientValue, setPatientValue] = useState(0);
  const [respectCultureValue, setRespectCultureValue] = useState(0);
  const [datingChecked, setDatingChecked] = useState(false);
  const [moneyChecked, setMoneyChecked] = useState(false);
  const [numberChecked, setNumberChecked] = useState(false);

  const handleDatingChange = (event) => {
    setDatingChecked(event.target.checked);
  };

  const renderDatingLable = () => {
    if (datingChecked) {
      return <>My partner asked me about my relationship status 💕</>;
    } else {
      return <>No problem. My partner is fine 👍</>;
    }
  };

  const handleMoneyChange = (event) => {
    setMoneyChecked(event.target.checked);
  };

  const renderMoneyLabel = () => {
    if (moneyChecked) {
      return <>My partner asked me for money 💰</>;
    } else {
      return <>No problem. My partner is fine 👍</>;
    }
  };

  const handleNumberChange = (event) => {
    setNumberChecked(event.target.checked);
  };

  const renderNumberLabel = () => {
    if (numberChecked) {
      return <>My partner asked me for my phone number 📞</>;
    } else {
      return <>No problem. My partner is fine 👍</>;
    }
  };

  const renderAlerts = () => {
    if (props.alertsState.length) {
      const alertsSnackBars = props.alertsState.map((alert) => {
        return <Snackbar open={true} id={alert.id} snackBarType={alert.alertType} message={alert.message} />;
      });

      return (
        <div style={{ position: 'absolute', top: '20px', right: '20px' }}>
          <Stack spacing={2}>{alertsSnackBars}</Stack>
        </div>
      );
    }
  };

  const onSubmitClick = () => {
    // ここでapi requestを送ることになる。
    // rating {"enthusiastic": 10, "friendly": 8, "patient": 6, "helpful": 5, "respectCulture": 8," datingHunter": false, "moneyHunter": false}
    const rating = {
      enthusiastic: enthusiasticValue,
      friendly: friendlyValue,
      patient: patientValue,
      helpful: helpfulValue,
      respectCulture: respectCultureValue,
      datingHunter: datingChecked,
      moneyHunter: moneyChecked,
      numberHunter: numberChecked,
    };

    if (!enthusiasticValue || !friendlyValue || !patientValue || !helpfulValue || !respectCultureValue) {
      props.alertActionCreator('Please leave every rating.', 'error');
    }
    console.log(rating);
    props.createRatingActionCreator(rating);
  };

  return (
    <Modal
      show={props.showRatingModal}
      // onHide={() => props.setShowAfterFinishingModal(false)}
      backdrop='static'
      keyboard={false}
    >
      <Modal.Body>
        <Modal.Header>
          <Modal.Title style={{ color: 'black' }}>
            [Important!]&nbsp; <EditIcon />
            &nbsp;Rating
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {renderAlerts()}
          <div className='rate-partner' style={{}}>
            {/* <div className='rate-partner-wrapper' style={{ display: 'flex', height: '10%' }}>
              <div className='rate-partner-header' style={{ flex: 4 }}>
                <i
                  className='fa fa-close'
                  onClick={() => props.setOpenRatePartner(false)}
                  style={{ color: 'red', cursor: 'pointer' }}
                ></i>
                <p style={{ fontSize: '20px' }}>Rating &nbsp;</p>
              </div>
              <div
                className='rate-partner-app-menu'
                style={{ display: 'flex', flex: 2, alignItems: 'center', gap: '30px' }}
              >
              </div>
            </div> */}
            <h5 style={{ color: 'black', textAlign: 'center' }}>
              Please rate {props.mediaState.callingWith.name} to make this application more usuful.
            </h5>
            <div className='rate-list' style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div>
                <Typography component='legend'>
                  💪 Enthusiastic
                  <Tooltip
                    TransitionComponent={Zoom}
                    title={`How much was ${props.mediaState.callingWith.name} passionate about practicing language?`}
                    arrow
                  >
                    <HelpIcon />
                  </Tooltip>
                </Typography>
                <Rating
                  name='customized-10'
                  defaultValue={0}
                  max={10}
                  value={enthusiasticValue}
                  onChange={(event, newValue) => {
                    setEnthusiasticValue(newValue);
                  }}
                />
              </div>
              <div>
                <Typography component='legend'>
                  😁 Friendly
                  <Tooltip
                    TransitionComponent={Zoom}
                    title={`How much was ${props.mediaState.callingWith.name} kind and pleasant to you?`}
                    arrow
                  >
                    <HelpIcon />
                  </Tooltip>
                </Typography>
                <Rating
                  name='customized-10'
                  defaultValue={0}
                  max={10}
                  value={friendlyValue}
                  onChange={(event, newValue) => {
                    setFriendlyValue(newValue);
                  }}
                />
              </div>
              <div>
                <Typography component='legend'>
                  🧑‍🏫 Patient
                  <Tooltip
                    TransitionComponent={Zoom}
                    title={`How much did ${props.mediaState.callingWith.name} try to listen to you?`}
                    arrow
                  >
                    <HelpIcon />
                  </Tooltip>
                </Typography>
                <Rating
                  name='customized-10'
                  defaultValue={0}
                  max={10}
                  value={helpfulValue}
                  onChange={(event, newValue) => {
                    setHelpfulValue(newValue);
                  }}
                />
              </div>
              <div>
                <Typography component='legend'>
                  ✍️ Helpful
                  <Tooltip
                    TransitionComponent={Zoom}
                    title={`How much did ${props.mediaState.callingWith.name} teach language to you or took a note on Shared Doc?`}
                    arrow
                  >
                    <HelpIcon />
                  </Tooltip>
                </Typography>
                <Rating
                  name='customized-10'
                  defaultValue={0}
                  max={10}
                  value={patientValue}
                  onChange={(event, newValue) => {
                    setPatientValue(newValue);
                  }}
                />
              </div>
              <div>
                <Typography component='legend'>
                  🤝 Respect Culture
                  <Tooltip
                    TransitionComponent={Zoom}
                    title={`How much did ${props.mediaState.callingWith.name} try to understand the cultural difference?`}
                    arrow
                  >
                    <HelpIcon />
                  </Tooltip>
                </Typography>
                <Rating
                  name='customized-10'
                  defaultValue={0}
                  max={10}
                  value={respectCultureValue}
                  onChange={(event, newValue) => {
                    setRespectCultureValue(newValue);
                  }}
                />
              </div>
              <div>
                <Typography component='legend'>
                  💕 Dating Hunter 💕
                  <Tooltip
                    TransitionComponent={Zoom}
                    title={`Did ${props.mediaState.callingWith.name} ask you about your relationship status? e.g. Do you have a boyfriend? Are you single?`}
                    arrow
                  >
                    <HelpIcon />
                  </Tooltip>
                </Typography>
                <Checkbox
                  checked={datingChecked}
                  onChange={handleDatingChange}
                  inputProps={{ 'aria-label': 'controlled' }}
                />
                {renderDatingLable()}
              </div>
              <div>
                <Typography component='legend'>
                  💰 Money Hunter 💰
                  <Tooltip
                    TransitionComponent={Zoom}
                    title={`Did ${props.mediaState.callingWith.name} ask you for your money or money transaction? e.g Can I borrow $100? Do you want to try Bitcoin investment?`}
                    arrow
                  >
                    <HelpIcon />
                  </Tooltip>
                </Typography>
                <Checkbox
                  checked={moneyChecked}
                  onChange={handleMoneyChange}
                  inputProps={{ 'aria-label': 'controlled' }}
                />
                {renderMoneyLabel()}
              </div>
              <div>
                <Typography component='legend'>
                  📞 Phone Number Hunter 📞
                  <Tooltip
                    TransitionComponent={Zoom}
                    title={`Did ${props.mediaState.callingWith.name} ask your phone number? e.g Can I get your number? What's your number?`}
                    arrow
                  >
                    <HelpIcon />
                  </Tooltip>
                </Typography>
                <Checkbox
                  checked={numberChecked}
                  onChange={handleNumberChange}
                  inputProps={{ 'aria-label': 'controlled' }}
                />
                {renderNumberLabel()}
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='contained' startIcon={<SendIcon />} onClick={() => onSubmitClick()}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  );
};

const mapStateToProps = (state) => {
  return { mediaState: state.mediaState, alertsState: state.alertsState };
};

export default connect(mapStateToProps, { alertActionCreator, createRatingActionCreator })(RatingModal);
