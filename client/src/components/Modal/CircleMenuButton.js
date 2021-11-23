import React from 'react';
import { Button } from 'semantic-ui-react';
import Draggable from 'react-draggable';

const CircleMenuButton = () => {
  const onButtonClick = () => {
    console.log('button menu...');
    // return (
    //   <div className='chat-menu'>
    //     <div className='hangup'></div>
    //     <div className='activate-subtitle'></div>
    //     <div className='send-chat'></div>
    //     <div className=''></div>
    //     <div className=''></div>
    //     <div className=''></div>
    //   </div>
    // )
  };

  return (
    <>
      <Draggable>
        <Button onClick={() => onButtonClick()}></Button>
      </Draggable>
    </>
  );
};

export default CircleMenuButton;
