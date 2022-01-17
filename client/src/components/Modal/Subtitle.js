import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import { getVoiceTextActionCreator } from '../../actionCreators/mediaActionCreator';

const Subtitle = (props) => {
  // const [languageSubtitles, setLanguageSubtitles] = useState([]); // ここを配列にして、加えていく方法を取ろう。そしてdynamicにrenderするようにする。
  useEffect(() => {
    props.getVoiceTextActionCreator(props.socket, props.setLanguageSubtitles);
  }, []);

  const subtitlesRender = () => {
    const subtitles = props.languageSubtitles.map((languageSubtitle) => {
      return (
        <>
          <div className='name'>{props.authState.currentUser.name}</div>
          <p className='subtitle'>{languageSubtitle}</p>
        </>
      );
    });
  };

  return <div>{subtitlesRender()}</div>;
};

const mapStateToProps = (state) => {
  return { authState: state.authState };
};

export default connect(mapStateToProps, { getVoiceTextActionCreator })(Subtitle);
