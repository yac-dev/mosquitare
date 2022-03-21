import React, { useState, useEffect } from 'react';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';

// components
import LanguageStatus from './LanguageStatus';
import SubtitleWrapper from './SubtitleWrapper';

// css
import '../../styles/languageStatusAndTranscript.css';

// openLanguageStatusAndTranscript
const LanguageStatusAndTranscript = (props) => {
  const [deltaPosition, setDeltaPosition] = useState({ x: 0, y: 0 });

  const handleDrag = (e, ui) => {
    const { x, y } = deltaPosition;
    setDeltaPosition({ ...deltaPosition, x: x + ui.deltaX, y: y + ui.deltaY });
  };

  return (
    <Draggable onDrag={handleDrag} cancel='.input-and-send, .chat-close-button'>
      <div className={`language-status-and-transcript ${props.openLanguageStatusAndTranscript ? undefined : 'hidden'}`}>
        <LanguageStatus
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

export default LanguageStatusAndTranscript;
