import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import { getVoiceTextActionCreator } from '../../actionCreators/mediaActionCreator';

const Subtitle = (props) => {
  const [languageSubtitle, setLanguageSubtitle] = useState();
  useEffect(() => {
    props.getVoiceTextActionCreator(props.socket, setLanguageSubtitle);
  }, []);

  return <div>{languageSubtitle}</div>;
};

const mapStateToProps = (state) => {
  return { authState: state.authState };
};

export default connect(mapStateToProps, { getVoiceTextActionCreator })(Subtitle);
