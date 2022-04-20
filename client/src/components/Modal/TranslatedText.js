import React, { useState, useEffect } from 'react';

const TranslatedText = (props) => {
  const [text, setText] = useState('');

  useEffect(() => {
    setText(props.googleTranslated);
  }, [props.googleTranslated]);

  const renderText = () => {
    if (text) {
      return <>Translated&nbsp;{text}</>;
    } else {
      return null;
    }
  };

  return <>{renderText()}</>;
};

export default TranslatedText;
