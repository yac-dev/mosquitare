import React, { useState } from 'react';
import { connect } from 'react-redux';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import GTranslateIcon from '@mui/icons-material/GTranslate';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';
import StarRateIcon from '@mui/icons-material/StarRate';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAltOutlined';
import HelpIcon from '@mui/icons-material/Help';
import Zoom from '@mui/material/Zoom';

// css
import '../styles/ratePartner.css';
import Checkbox from '@mui/material/Checkbox';

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

const badStatuslabels = {
  1: 'My partner is fine!',
  2: 'Ummm, my partner is creepy...',
  3: 'lppl',
  4: 'lppl',
  5: 'lppl',
};

function getLabelText(value) {
  console.log('its', value);
  return `${badStatuslabels[value]}`;
}

const RatePartner = (props) => {
  const [enthusiasticValue, setEnthusiasticValue] = useState(0);
  const [friendlyValue, setFriendlyValue] = useState(0);
  const [helpfulValue, setHelpfulValue] = useState(0);
  const [patientValue, setPatientValue] = useState(0);
  const [respectCultureValue, setRespectCultureValue] = useState(0);
  const [datingChecked, setDatingChecked] = useState(false);
  const [moneyChecked, setMoneyChecked] = useState(false);

  const handleDatingChange = (event) => {
    setDatingChecked(event.target.checked);
  };

  const renderDatingLable = () => {
    if (datingChecked) {
      return <>My partner is looking for Dating partner 💕</>;
    } else {
      return <>No problem. My partner is fine!</>;
    }
  };

  const renderMoneyLabel = () => {
    if (moneyChecked) {
      return <>My partner is asking for money 💰</>;
    } else {
      return <>No problem. My partner is fine!</>;
    }
  };

  const handleMoneyChange = (event) => {
    setMoneyChecked(event.target.checked);
  };
  // const [datingHover, setDatingHover] = useState(-1);

  const [deltaPosition, setDeltaPosition] = useState({ x: 0, y: 0 });
  const handleDrag = (e, ui) => {
    const { x, y } = deltaPosition;
    setDeltaPosition({ ...deltaPosition, x: x + ui.deltaX, y: y + ui.deltaY });
  };

  return (
    <Draggable onDrag={handleDrag}>
      {/* <div className={`rate-partner ${props.openRatePartner ? undefined : 'hidden'}`}> */}
      <div className='rate-partner' style={{}}>
        <div className='rate-partner-wrapper' style={{ display: 'flex', height: '10%' }}>
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
            {/* <Tooltip title='Translate'>
              <GTranslateIcon sx={{ cursor: 'pointer' }} />
            </Tooltip> */}
          </div>
        </div>

        <div className='rate-list' style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div>
            <Typography component='legend'>
              💪 Enthusiastic
              <Tooltip
                TransitionComponent={Zoom}
                title='How much were your partner passionate about practicing language?'
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
              <Tooltip TransitionComponent={Zoom} title='How much were your partner kind and pleasant to you?' arrow>
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
              <Tooltip TransitionComponent={Zoom} title='How much did your partner try to listen to you?' arrow>
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
                title='How much did your partner teach you or took a note on Shared Doc?'
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
                title='How much did your partner try to understand the cultural difference?'
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
              💕 Dating hunter 💕
              <Tooltip
                TransitionComponent={Zoom}
                title='Did your partner ask you about your relationship status? e.g. Do you have a boyfriend? Are you married?'
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
              💰 Money hunter 💰
              <Tooltip
                TransitionComponent={Zoom}
                title='Did your partner ask you about money related thing? e.g Are you interested in Bitcoin investment? Can I borrow $100?'
                arrow
              >
                <HelpIcon />
              </Tooltip>
            </Typography>
            <Checkbox checked={moneyChecked} onChange={handleMoneyChange} inputProps={{ 'aria-label': 'controlled' }} />
            {renderMoneyLabel()}
          </div>
        </div>
      </div>
    </Draggable>
  );
};

export default RatePartner;
