import React, { useState, useEffect } from 'react';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import { connect } from 'react-redux';

// mui
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/system';

// components
import LanguageStatus from './LanguageStatus';
import SubtitleWrapper from './SubtitleWrapper';

// css
import '../../styles/languageStatusAndTranscript.css';

const CloseIconButton = styled(IconButton)(({ theme }) => ({
  // color: theme.palette.getContrastText(purple[500]),
  backgroundColor: 'rgb(237, 85, 85)',
  '&:hover': {
    backgroundColor: 'rgb(245, 27, 27)',
  },
}));

// openLanguageStatusAndTranscript
const LanguageStatusAndTranscript = (props) => {
  const [deltaPosition, setDeltaPosition] = useState({ x: 0, y: 0 });

  const handleDrag = (e, ui) => {
    const { x, y } = deltaPosition;
    setDeltaPosition({ ...deltaPosition, x: x + ui.deltaX, y: y + ui.deltaY });
  };

  return (
    <Draggable
      onDrag={handleDrag}
      cancel='.language-status-and-transcript-close-button, .language-status-wrapper, .transcript-component, .fa, .fa-close'
    >
      <div className={`language-status-and-transcript ${props.openLanguageStatusAndTranscript ? undefined : 'hidden'}`}>
        <div className='language-status-and-transcript-header'>
          <p>Status&#38;Transcript</p>
          <div
            className='language-status-and-transcript-close-button'
            onClick={() => props.setOpenLanguageStatusAndTranscript(false)}
          >
            <i className='fa fa-close' style={{ fontSize: '12px', color: 'white' }}></i>
          </div>
        </div>
        <LanguageStatus
          socket={props.socket}
          countLearningLangLength={props.countLearningLangLength}
          countNativeLangLength={props.countNativeLangLength}
        />
        <SubtitleWrapper
          socket={props.socket}
          setCountLearningLangLength={props.setCountLearningLangLength}
          setCountNativeLangLength={props.setCountNativeLangLength}
        />
      </div>
    </Draggable>
  );
};

export default connect(null)(LanguageStatusAndTranscript);
