import React, { useState, useEffect } from 'react';
import store from '../../store';

const Transcript = () => {
  const [conversationTranscript, setConversationTranscript] = useState();

  useEffect(() => {
    const fileName =
      store.getState().authState.currentUser.conversations[0].calledUserScript.conversationTranscriptFileName;
    fetch(`https://mosquitare-dev-bucket-for-mediafiles.s3.us-east-2.amazonaws.com/${fileName}`)
      .then((response) => response.text()) // これでpromiseが返っている。
      .then((data) => {
        // console.log(data);
        setConversationTranscript(data);
      });
  }, []);

  const renderConversationTranscript = () => {
    if (!conversationTranscript) {
      return null;
    } else {
      return <>{conversationTranscript}</>;
    }
  };
  return <></>;
};

export default Transcript;
