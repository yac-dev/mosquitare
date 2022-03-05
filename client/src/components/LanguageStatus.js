import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';

// mui
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import TranslateIcon from '@mui/icons-material/Translate';
import { styled } from '@mui/system';
import Button from '@mui/material/Button';

// ac
import { updateUserMyLangsStatusActionCreator } from '../actionCreators/authActionCreators';
import { switchCurrentLanguageActionCreator1 } from '../actionCreators/mediaActionCreator';

const CloseIconButton = styled(IconButton)(({ theme }) => ({
  // color: theme.palette.getContrastText(purple[500]),
  backgroundColor: 'rgb(237, 85, 85)',
  '&:hover': {
    backgroundColor: 'rgb(245, 27, 27)',
  },
}));

const LanguageStatus = (props) => {
  const [deltaPosition, setDeltaPosition] = useState({ x: 0, y: 0 });

  // useEffect(() => {
  //   return () => {
  //     props.updateUserMyLangsStatusActionCreator(props.countLearningLangLength, props.countNativeLangLength);
  //   };
  // }, []);

  const handleDrag = (e, ui) => {
    const { x, y } = deltaPosition;
    setDeltaPosition({ ...deltaPosition, x: x + ui.deltaX, y: y + ui.deltaY });
  };

  const renderStatus = () => {
    if (props.countLearningLangLength === 0) {
      <>
        <p style={{ color: 'red' }}>You are not practicing at all</p>
        <span>😣</span>
      </>;
    } else if (props.countLearningLangLength > props.countNativeLangLength) {
      <>
        <p style={{ color: 'green' }}>You are practicing soo mush!!</p>
        <span>🤗</span>
      </>;
    }
  };

  return (
    <Draggable onDrag={handleDrag}>
      <div
        className={`language ${props.openLanguageStatus === true ? undefined : 'hidden'}`}
        status
        style={{
          position: 'absolute',
          color: 'white',
          backgroundColor: 'rgb(29, 49, 79)',
          height: '40vh',
          width: '20vw',
          borderRadius: '5px',
          top: '80px',
          right: '50px',
          cursor: 'grab',
          zIndex: 10,
        }}
      >
        <CloseIconButton onClick={() => props.setOpenLanguageStatus(false)}>
          <CloseIcon />
        </CloseIconButton>
        <div>Your Language Status</div>
        <p>Learning: {props.countLearningLangLength} words</p>
        <p>Native: {props.countNativeLangLength} words</p>
        {renderStatus()}
        <Button
          variant='contained'
          size='medium'
          startIcon={<TranslateIcon />}
          onClick={() => props.switchCurrentLanguageActionCreator1()}
        >
          Switch Language!
        </Button>
      </div>
    </Draggable>
  );
};

export default connect(null, updateUserMyLangsStatusActionCreator, switchCurrentLanguageActionCreator1)(LanguageStatus);
