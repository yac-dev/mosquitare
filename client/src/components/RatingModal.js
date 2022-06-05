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
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import { TextField, InputAdornment } from '@mui/material';

// accordion
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// componetns
import Snackbar from './Snackbar';

// ac
import { alertActionCreator } from '../actionCreators/alertsActionCreator';
import { createRatingActionCreator } from '../actionCreators/ratingsActionCreator';

const RatingModal = (props) => {
  const [enthusiasmValue, setEnthusiasmValue] = useState(0);
  const [friendlinessValue, setFriendlinessValue] = useState(0);
  const [patienceValue, setPatienceValue] = useState(0);
  const [cooperationValue, setCooperationValue] = useState(0);
  const [diversityValue, setDiversityValue] = useState(0);
  const [romanceChecked, setRomanceChecked] = useState(false);
  const [romanceDetail, setRomanceDetail] = useState('');
  const [moneyChecked, setMoneyChecked] = useState(false);
  const [moneyDetail, setMoneyDetail] = useState('');
  const [racismChecked, setRacismChecked] = useState(false);
  const [racismDetail, setRacismDetail] = useState('');
  const [expanded, setExpanded] = useState('panel1');
  const [submitButtonClicked, setSubmitButtonClicked] = useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleRomanceChange = (event) => {
    setRomanceChecked(event.target.checked);
  };

  const renderRomanceLabel = () => {
    if (romanceChecked) {
      return (
        <>
          My partner asked me about my relationship status 💕<br></br>
          <TextField
            id='input-with-icon-textfield'
            label='Please write the problem you had briefly.'
            multiline
            fullWidth
            value={romanceDetail}
            onChange={(event) => setRomanceDetail(event.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <EditIcon />
                </InputAdornment>
              ),
            }}
            variant='standard'
          />
        </>
      );
    } else {
      return <>No problem. My partner was completely fine 👍</>;
    }
  };

  const handleMoneyChange = (event) => {
    setMoneyChecked(event.target.checked);
  };

  const renderMoneyLabel = () => {
    if (moneyChecked) {
      return (
        <>
          My partner asked me for money 💰<br></br>
          <TextField
            id='input-with-icon-textfield'
            label='Please write the problem you had briefly.'
            multiline
            fullWidth
            value={moneyDetail}
            onChange={(event) => setMoneyDetail(event.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <EditIcon />
                </InputAdornment>
              ),
            }}
            variant='standard'
          />
        </>
      );
    } else {
      return <>No problem. My partner was completely fine 👍</>;
    }
  };

  const handleRacismChange = (event) => {
    setRacismChecked(event.target.checked);
  };

  const renderRacismLabel = () => {
    if (racismChecked) {
      return (
        <>
          My partner gave me racist comments or behaviors 👎<br></br>
          <TextField
            id='input-with-icon-textfield'
            label='Please write the problem you had briefly.'
            multiline
            fullWidth
            value={racismDetail}
            onChange={(event) => setRacismDetail(event.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <EditIcon />
                </InputAdornment>
              ),
            }}
            variant='standard'
          />
        </>
      );
    } else {
      return <>No problem. My partner was completely fine 👍</>;
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

  const renderButton = () => {
    if (!submitButtonClicked) {
      return (
        <Button variant='contained' startIcon={<SendIcon />} onClick={() => onSubmitClick()}>
          Submit
        </Button>
      );
    } else {
      return (
        <Button variant='contained' disabled startIcon={<HourglassTopIcon />}>
          Wait one sec...
        </Button>
      );
    }
  };

  const onSubmitClick = () => {
    // ここでapi requestを送ることになる。
    // rating {"enthusiastic": 10, "friendly": 8, "patient": 6, "helpful": 5, "respectCulture": 8," datingHunter": false, "moneyHunter": false}
    // diversity

    const ratingData = {
      enthusiasm: enthusiasmValue,
      friendliness: friendlinessValue,
      patience: patienceValue,
      cooperation: cooperationValue,
      diversity: diversityValue,
      romanceHunter: {
        checked: romanceChecked,
        detail: romanceDetail,
      },
      moneyHunter: {
        checked: moneyChecked,
        detail: moneyDetail,
      },
      racism: {
        checked: racismChecked,
        detail: racismDetail,
      },
    };

    if (!enthusiasmValue || !friendlinessValue || !patienceValue || !cooperationValue || !diversityValue) {
      return props.alertActionCreator('Please leave every rating.', 'error');
    }
    if (romanceChecked) {
      if (!romanceDetail) {
        return props.alertActionCreator('Please write the problem about Romance Hunter', 'error');
      }
    } else {
      setRomanceDetail('');
    }

    if (moneyChecked) {
      if (!moneyDetail) {
        return props.alertActionCreator('Please write the problem about Money Hunter', 'error');
      }
    } else {
      setMoneyDetail('');
    }

    if (racismChecked) {
      if (!racismDetail) {
        return props.alertActionCreator('Please write the problem about Racism', 'error');
      }
    } else {
      setRacismDetail('');
    }
    setSubmitButtonClicked(true);
    console.log(ratingData);
    props.createRatingActionCreator(ratingData);
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
          <h5 style={{ color: 'black', textAlign: 'center', marginBottom: '30px' }}>
            Please rate {props.mediaState.callingWith.name} to make this application more usuful!
          </h5>
          <div
            className='rate-partner'
            style={{ backgroundColor: 'rgb(232, 232, 232)', width: '100%', padding: '10px' }}
          >
            <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls='panel1bh-content' id='panel1bh-header'>
                <Typography sx={{ width: '33%', flexShrink: 0 }}>Rating 1</Typography>
                {/* <Typography sx={{ color: 'text.secondary' }}>I am an accordion</Typography> */}
              </AccordionSummary>
              <AccordionDetails>
                <div
                  className='rating-1'
                  style={{ display: 'flex', flexDirection: 'column', gap: '10px', color: 'black' }}
                >
                  <Tooltip
                    TransitionComponent={Zoom}
                    title={`How much was ${props.mediaState.callingWith.name} passionate about practicing language?`}
                    arrow
                  >
                    <div>
                      <Typography component='legend'>💪 Enthusiasm</Typography>
                      <Rating
                        name='customized-10'
                        defaultValue={0}
                        max={10}
                        value={enthusiasmValue}
                        onChange={(event, newValue) => {
                          setEnthusiasmValue(newValue);
                        }}
                      />
                    </div>
                  </Tooltip>
                  <Tooltip
                    TransitionComponent={Zoom}
                    title={`How much was ${props.mediaState.callingWith.name} friendly to you?`}
                    arrow
                  >
                    <div>
                      <Typography component='legend'>😁 Friendliness</Typography>
                      <Rating
                        name='customized-10'
                        defaultValue={0}
                        max={10}
                        value={friendlinessValue}
                        onChange={(event, newValue) => {
                          setFriendlinessValue(newValue);
                        }}
                      />
                    </div>
                  </Tooltip>

                  <Tooltip
                    TransitionComponent={Zoom}
                    title={`How much did ${props.mediaState.callingWith.name} try to listen to you?`}
                    arrow
                  >
                    <div>
                      <Typography component='legend'>🦻 Patience</Typography>
                      <Rating
                        name='customized-10'
                        defaultValue={0}
                        max={10}
                        value={cooperationValue}
                        onChange={(event, newValue) => {
                          setCooperationValue(newValue);
                        }}
                      />
                    </div>
                  </Tooltip>

                  <Tooltip
                    TransitionComponent={Zoom}
                    title={`How much did ${props.mediaState.callingWith.name} teach language to you or take a note on Shared Doc?`}
                    arrow
                  >
                    <div>
                      <Typography component='legend'>✍️ Cooperation</Typography>
                      <Rating
                        name='customized-10'
                        defaultValue={0}
                        max={10}
                        value={patienceValue}
                        onChange={(event, newValue) => {
                          setPatienceValue(newValue);
                        }}
                      />
                    </div>
                  </Tooltip>

                  <Tooltip
                    TransitionComponent={Zoom}
                    title={`How much did ${props.mediaState.callingWith.name} respect the cultural difference?`}
                    arrow
                  >
                    <div>
                      <Typography component='legend'>🤝 Diversity</Typography>
                      <Rating
                        name='customized-10'
                        defaultValue={0}
                        max={10}
                        value={diversityValue}
                        onChange={(event, newValue) => {
                          setDiversityValue(newValue);
                        }}
                      />
                    </div>
                  </Tooltip>
                </div>
              </AccordionDetails>
            </Accordion>
            <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls='panel2bh-content' id='panel2bh-header'>
                <Typography sx={{ width: '33%', flexShrink: 0 }}>Rating 2</Typography>
                {/* <Typography sx={{ color: 'text.secondary' }}>You are currently not an owner</Typography> */}
              </AccordionSummary>
              <AccordionDetails>
                <div
                  className='rating-2'
                  style={{ display: 'flex', flexDirection: 'column', gap: '10px', color: 'black' }}
                >
                  <Tooltip
                    TransitionComponent={Zoom}
                    title={`Did ${props.mediaState.callingWith.name} ask you about your relationship status or phone number for dating? e.g. Do you have a boyfriend? Are you single? Can I get your number?`}
                    arrow
                  >
                    <div>
                      <Typography component='legend'>💕 Romance Hunter 💕</Typography>
                      <Checkbox
                        checked={romanceChecked}
                        onChange={handleRomanceChange}
                        inputProps={{ 'aria-label': 'controlled' }}
                      />
                      {renderRomanceLabel()}
                    </div>
                  </Tooltip>

                  <Tooltip
                    TransitionComponent={Zoom}
                    title={`Did ${props.mediaState.callingWith.name} ask you for your money or money transaction? e.g Can I borrow $100? Do you want to try Bitcoin investment?`}
                    arrow
                  >
                    <div>
                      <Typography component='legend'>💰 Money Hunter 💰</Typography>
                      <Checkbox
                        checked={moneyChecked}
                        onChange={handleMoneyChange}
                        inputProps={{ 'aria-label': 'controlled' }}
                      />
                      {renderMoneyLabel()}
                    </div>
                  </Tooltip>

                  <Tooltip
                    TransitionComponent={Zoom}
                    title={`Did ${props.mediaState.callingWith.name} give you any racist comments or behavior?`}
                    arrow
                  >
                    <div>
                      <Typography component='legend'>Racism</Typography>
                      <Checkbox
                        checked={racismChecked}
                        onChange={handleRacismChange}
                        inputProps={{ 'aria-label': 'controlled' }}
                      />
                      {renderRacismLabel()}
                    </div>
                  </Tooltip>
                </div>
              </AccordionDetails>
            </Accordion>
          </div>
        </Modal.Body>
        <Modal.Footer>
          {/* <Button variant='contained' startIcon={<SendIcon />} onClick={() => onSubmitClick()}>
            Submit
          </Button> */}
          {renderButton()}
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  );
};

const mapStateToProps = (state) => {
  return { mediaState: state.mediaState, alertsState: state.alertsState };
};

export default connect(mapStateToProps, { alertActionCreator, createRatingActionCreator })(RatingModal);
