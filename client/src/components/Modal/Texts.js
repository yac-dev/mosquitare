import React, { useState } from 'react';
// subtitle compoentnとchat componentを別々に分けて、toggleできるようにする。
import SubtitleWrapper from './SubtitleWrapper';
import Chat from './Chat';

const Texts = (props) => {
  // const [languageSubtitles, setLanguageSubtitles] = useState([]);
  return (
    <div className='texts'>
      <SubtitleWrapper
        socket={props.socket}
        setLearningLanguageScript={props.setLearningLanguageScript}
        setNativeLanguageScript={props.setNativeLanguageScript}
        // languageSubtitles={languageSubtitles}
        // setLanguageSubtitles={setLanguageSubtitles}
      />
      {/* <Chat /> */}
    </div>
  );
};

export default Texts;
