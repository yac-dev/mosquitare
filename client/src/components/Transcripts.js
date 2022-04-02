import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';

// ac
import { getTranscriptsByConversationIdActionCreator } from '../actionCreators/transcriptsActionCreator';

// css
import '../styles/renderedTranscripts.css';

const Transcripts = (props) => {
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

      return <>{transcriptsList}</>;
    } else {
      return <div>No transcripts.</div>;
    }
  };

  return (
    <div className={`rendered-transcripts ${props.openTranscripts ? undefined : 'hidden'}`}>{renderTranscripts()}</div>
  );
};

const mapStateToProps = (state) => {
  return { transcriptsState: Object.values(state.transcriptsState) };
};

export default connect(mapStateToProps, { getTranscriptsByConversationIdActionCreator })(Transcripts);
