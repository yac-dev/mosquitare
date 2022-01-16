import React from 'react';
// subtitle compoentnとchat componentを別々に分けて、toggleできるようにする。
import Subtitle from './Subtitle';
import Chat from './Chat';

const Texts = () => {
  return (
    <div className='texts' style={{ backgroundColor: 'white' }}>
      <Subtitle />
      {/* <Chat /> */}
    </div>
  );
};

export default Texts;
