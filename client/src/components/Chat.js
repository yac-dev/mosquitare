import React, { useState } from 'react';

const Chat = (props) => {
  const [text, setText] = useState('');

  return (
    <div
      className={`tab-content ${props.isActiveChatComponent ? undefined : 'hidden'}`}
      style={{ color: 'white' }}
    ></div>
  );
};

export default Chat;
