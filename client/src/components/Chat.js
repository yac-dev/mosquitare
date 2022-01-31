import React from 'react';

const Chat = (props) => {
  return (
    <div className={`tab-content ${props.isActiveChatComponent ? undefined : 'hidden'}`} style={{ color: 'white' }}>
      <div>Here is Chat tab content</div>
    </div>
  );
};

export default Chat;
