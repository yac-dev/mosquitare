import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import { updateConversationDurationAndGenreActionCreator } from '../actionCreators/conversationActionCreators';

const MyClock = (props) => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let interval = null;
    interval = setInterval(() => {
      setSeconds((seconds) => seconds + 1);
    }, 1000);

    return () => clearInterval(interval);
    // uomountは一旦おいておこう。
  }, [seconds]);

  useEffect(() => {
    if (props.mediaState.callDisconnected) {
      props.updateConversationDurationAndGenreActionCreator(seconds);
    }
  }, [props.mediaState.callDisconnected]);

  return <></>;
};

const mapStateToProps = (state) => {
  return { mediaState: state.mediaState };
};

export default connect(mapStateToProps, { updateConversationDurationAndGenreActionCreator })(MyClock);
