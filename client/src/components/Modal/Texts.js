import React from 'react';
// subtitle compoentnとchat componentを別々に分けて、toggleできるようにする。
import Subtitle from './SubtitleWrapper';
import Chat from './Chat';

const Texts = (props) => {
  return (
    <div className='texts'>
      <Subtitle
        socket={props.socket}
        setLearningLanguageScript={props.setLearningLanguageScript}
        setNativeLanguageScript={props.setNativeLanguageScript}
      />
      {/* <Chat /> */}
    </div>
  );
};

export default Texts;
