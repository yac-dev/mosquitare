import React, { useEffect, useRef } from 'react';
import { connect } from 'react-redux';

// ac
import { switchCurrentLanguageActionCreator1 } from '../../actionCreators/mediaActionCreator';
import { updateUserMyLangsStatusActionCreator } from '../../actionCreators/authActionCreators';

// mui
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TranslateOutlinedIcon from '@mui/icons-material/TranslateOutlined';

// css
import '../../styles/languageStatus.css';

const theme = createTheme({
  breakpoints: {
    values: {
      xxs: 0, // small phone
      xs: 320, // phone
      sm: 768, // tablets
      md: 992, // small laptop
      lg: 1200, // desktop
      // xl: 1536, // large screens
    },
  },
});

const LanguageStatus = (props) => {
  const countLearningLangLengthRef = useRef();
  const countNativeLangLengthRef = useRef();

  useEffect(() => {
    countLearningLangLengthRef.current = props.countLearningLangLength;
  }, [props.countLearningLangLength]);

  useEffect(() => {
    countNativeLangLengthRef.current = props.countNativeLangLength;
  }, [props.countNativeLangLength]);

  useEffect(() => {
    return () => {
      console.log('language count logged!!!', props.countLearningLangLength, props.countNativeLangLength);
      props.updateUserMyLangsStatusActionCreator(countLearningLangLengthRef.current, countNativeLangLengthRef.current);
    };
  }, []);

  // useEffect(() => {
  //   if (props.mediaState.callDisconnected) {
  //     // ここで、promiseを分けて行うことできるかね。正直、calledUser側だけ送るのでいいよな。
  //     props.updateUserMyLangsStatusActionCreator(props.countLearningLangLength, props.countNativeLangLength);
  //   }
  // }, [props.mediaState.callDisconnected]);

  const renderLearningLanguageStatus = () => {
    return (
      <div className='learning-lang-wrapper'>
        <Typography sx={{ mb: 1.5 }} color='text.secondary'>
          Learnning
        </Typography>
        <Typography variant='h6' component='div'>
          {props.countLearningLangLength} words
        </Typography>
      </div>
    );
  };

  const renderNativeLanguageStatus = () => {
    return (
      <div>
        <Typography sx={{ mb: 1.5 }} color='text.secondary'>
          Native
        </Typography>
        <Typography variant='h6' component='div'>
          {props.countNativeLangLength} words
        </Typography>
      </div>
    );
  };

  const switchLanguage = () => {
    //言語を切り替えたら、自動でoffになる。
    props.switchCurrentLanguageActionCreator1(props.socket);
  };

  return (
    <div className='language-status-wrapper'>
      <div className='language-status'>
        {renderLearningLanguageStatus()}
        {renderNativeLanguageStatus()}
      </div>
      <div className='switch-language-button'>
        <ThemeProvider theme={theme}>
          <Button
            variant='contained'
            // startIcon={<TranslateOutlinedIcon />}
            onClick={() => switchLanguage()}
            sx={{
              height: { xxs: '20px', xs: '20px', sm: '30px', md: '30px', lg: '40px' },
              fontSize: { xxs: '10px', xs: '10px', sm: '12px', md: '14px', lg: '16px' },
            }}
          >
            Switch Language?
          </Button>
        </ThemeProvider>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return { mediaState: state.mediaState };
};

export default connect(mapStateToProps, { switchCurrentLanguageActionCreator1, updateUserMyLangsStatusActionCreator })(
  LanguageStatus
);
