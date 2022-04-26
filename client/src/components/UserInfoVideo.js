import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';

const UserInfoVideo = (props) => {
  // const [show, setShow] = useState();

  return (
    <>
      <div onClick={() => props.setShowVideoModal(true)} key={props.index} style={{ cursor: 'pointer' }}>
        <video width='200'>
          <source src={`${process.env.REACT_APP_S3_BUCKET_LINK}/${props.conversation.videoFilename}`} />
        </video>
      </div>
    </>
  );
};

export default UserInfoVideo;
