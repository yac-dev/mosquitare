import React, { useState } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';

// mui
import IconButton from '@mui/material/IconButton';
import GTranslateIcon from '@mui/icons-material/GTranslate';

const TranslateTranscript = (props) => {
  const [translated, setTranslated] = useState('');

  const googleTranslate = async (input) => {
    let targetLanguage;
    const { currentLanguage } = props.mediaState;
    const { exchangingLanguages } = props.mediaState; // array
    const [lang1, lang2] = exchangingLanguages;
    if (currentLanguage.name === lang1.name) {
      targetLanguage = lang2;
    } else if (currentLanguage.name === lang2.name) {
      targetLanguage = lang1;
    }

    try {
      const { data } = await axios.post(
        `https://translation.googleapis.com/language/translate/v2?key=${process.env.REACT_APP_GOOGLE_TRANSLATE_KEY}`,
        {
          q: input,
          target: targetLanguage.code,
        }
        // { cancelToken: cancelToken.token }
      );
      setTranslated(data.data.translations[0].translatedText);
      // return data.data.translations[0].translatedText;
    } catch (err) {
      return '';
    }
  };
  const renderTranslated = () => {
    if (translated) {
      return <div>{translated}</div>;
    } else {
      return null;
    }
  };

  return (
    <>
      <span>
        <IconButton onClick={() => googleTranslate(props.translateInput)}>
          <GTranslateIcon />
        </IconButton>
      </span>
      <br></br>
      {renderTranslated()}
    </>
  );
};

const mapStateToProps = (state) => {
  return { mediaState: state.mediaState };
};

export default connect(mapStateToProps)(TranslateTranscript);
