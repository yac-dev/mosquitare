import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import Avatar from '@mui/material/Avatar';

// ac
import { getTranscriptsByConversationIdActionCreator } from '../actionCreators/transcriptsActionCreator';

// css
import '../styles/renderedTranscripts.css';

const Transcripts = (props) => {
  const [deltaPosition, setDeltaPosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    props.getTranscriptsByConversationIdActionCreator();
  }, []);

  const renderTranscripts = () => {
    if (props.transcriptsState.length) {
      const transcriptsList = props.transcriptsState.map((transcript) => {
        return (
          <>
            <span>{transcript.user.name}</span>&nbsp;<p>{transcript.transcript}</p>
          </>
        );
      });

      return <div className='transcripts-list'>{transcriptsList}</div>;
    } else {
      return <div>No transcripts.</div>;
    }
  };

  const handleDrag = (e, ui) => {
    const { x, y } = deltaPosition;
    setDeltaPosition({ ...deltaPosition, x: x + ui.deltaX, y: y + ui.deltaY });
  };

  return (
    <Draggable onDrag={handleDrag} cancel='.shared-doc-close-button, .doc-editor'>
      <div className={`rendered-transcripts ${props.openTranscripts ? undefined : 'hidden'}`}>
        <div className='rendered-transcripts-header'>
          <p>Shared Doc</p>
          <div className='rendered-transcripts-close-button' onClick={() => props.setOpenTranscripts(false)}>
            <i className='fa fa-close' style={{ fontSize: '12px', color: 'white', cursor: 'pointer' }}></i>
          </div>
        </div>
        {renderTranscripts()}
      </div>
    </Draggable>
  );
};

const mapStateToProps = (state) => {
  return { transcriptsState: Object.values(state.transcriptsState) };
};

export default connect(mapStateToProps, { getTranscriptsByConversationIdActionCreator })(Transcripts);
