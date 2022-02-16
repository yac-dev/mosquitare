import React, { useEffect, useState } from 'react';
import store from '../store';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import TranslateIcon from '@mui/icons-material/Translate';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { withStyles } from '@mui/styles';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import SendIcon from '@mui/icons-material/Send';
import Input from '@mui/material/Input';
import InputUnstyled from '@mui/base/InputUnstyled';
import { styled } from '@mui/system';

import { I_SEND_CHAT_MESSAGE_TO_MY_PARTNER, MY_PARTNER_SEND_ME_A_CHAT_MESSAGE } from '../actionCreators/socketEvents';

const ariaLabel = { 'aria-label': 'description' };

// const styles = (theme) => ({
//   textField: {
//     width: '90%',
//     marginLeft: 'auto',
//     marginRight: 'auto',
//     paddingBottom: 0,
//     marginTop: 0,
//     fontWeight: 500,
//     backgroundColor: 'white',
//   },
//   input: {
//     color: 'white',
//   },
// });

const blue = {
  100: '#DAECFF',
  200: '#80BFFF',
  400: '#3399FF',
  600: '#0072E5',
};

const grey = {
  50: '#F3F6F9',
  100: '#E7EBF0',
  200: '#E0E3E7',
  300: '#CDD2D7',
  400: '#B2BAC2',
  500: '#A0AAB4',
  600: '#6F7E8C',
  700: '#3E5060',
  800: '#2D3843',
  900: '#1A2027',
};

const StyledInputElement = styled('input')(
  ({ theme }) => `
  width: 100%;
  min-width: 100%;
  font-size: 0.875rem;
  font-family: IBM Plex Sans, sans-serif;
  font-weight: 400;
  line-height: 1.5;
  color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
  background: ${theme.palette.mode === 'dark' ? grey[900] : grey[50]};
  border: 1px solid ${theme.palette.mode === 'dark' ? grey[800] : grey[300]};
  border-radius: 8px;
  padding: 12px 12px;

  &:hover {
    background: ${theme.palette.mode === 'dark' ? '' : grey[100]};
    border-color: ${theme.palette.mode === 'dark' ? grey[700] : grey[400]};
  }

  &:focus {
    outline: 3px solid ${theme.palette.mode === 'dark' ? blue[600] : blue[100]};
  }
`
);

const CustomInput = React.forwardRef(function CustomInput(props, ref) {
  return <InputUnstyled components={{ Input: StyledInputElement }} {...props} ref={ref} />;
});

const ColorButton = styled(Button)(({ theme }) => ({
  // color: theme.palette.getContrastText(purple[500]),
  backgroundColor: 'rgb(35, 63, 105)',
  '&:hover': {
    backgroundColor: 'rgb(39, 78, 138)',
  },
}));

const SwitchLanguageIconButton = styled(IconButton)(({ theme }) => ({
  // color: theme.palette.getContrastText(purple[500]),
  backgroundColor: 'rgb(35, 63, 105)',
  '&:hover': {
    backgroundColor: 'rgb(39, 78, 138)',
  },
}));

// const styles = {
//   floatingLabelFocusStyle: {
//     color: 'somecolor',
//   },
// };

const Chat = (props) => {
  const [chats, setChats] = useState([]);
  const [inputText, setInputText] = useState('');
  // const classes = styles(props);

  useEffect(() => {
    props.socket.on(MY_PARTNER_SEND_ME_A_CHAT_MESSAGE, (dataFromServer) => {
      setChats((previousState) => [...previousState, dataFromServer.messageObject]);
    });
  }, []);

  const sendChat = () => {
    if (!inputText) {
      console.log('type somthing.');
    } else {
      const myName = store.getState().authState.currentUser.name;
      const messageObject = { name: myName, message: inputText };
      setChats((previousState) => [...previousState, messageObject]);
      // socket使って、partnerに送る。
      const partnerSocketId = store.getState().mediaState.callingWith.socketId;
      props.socket.emit(I_SEND_CHAT_MESSAGE_TO_MY_PARTNER, { to: partnerSocketId, messageObject });
      setInputText('');
    }
  };

  // &nbsp;
  const renderChats = () => {
    const renderedChats = chats.map((chat) => {
      return (
        <div style={{ marginBottom: '5px' }}>
          <p style={{ marginLeft: '5px', marginBottom: '2px' }}>{chat.name}</p>
          <div
            style={{
              borderRadius: '10px',
              backgroundColor: 'rgb(35, 63, 105)',
              border: '1px solid white',
              padding: '5px',
              display: 'inline',
            }}
          >
            {chat.message}
          </div>
        </div>
      );
    });

    return (
      <div
        style={{ overflow: 'auto', height: '140px', border: '1px groove #6495ED', borderRadius: '5px', padding: '5px' }}
      >
        {renderedChats}
      </div>
    );
  };

  return (
    <div
      className={`tab-content ${props.isSelected === 'chat' ? undefined : 'hidden'}`}
      style={{
        color: 'white',
        backgroundColor: 'rgb(29, 49, 79)',
        position: 'relative',
        borderRadius: '5px',
      }}
    >
      <p style={{ marginLeft: '5px', marginBottom: '0px' }}>
        chat in English...&nbsp;
        <Tooltip title='Switch current language'>
          <SwitchLanguageIconButton color='inherit'>
            <TranslateIcon variant='contained' size='small' />
          </SwitchLanguageIconButton>
        </Tooltip>
      </p>
      <div className='chats' style={{ padding: '5px' }}>
        {renderChats()}
      </div>
      {/*  ここら辺、smart phoneの場合でwidthを書くだけだな。*/}
      <div className='input-and-send' style={{ width: '100%', position: 'absolute', bottom: '0', padding: '5px' }}>
        {/* <hr style={{ color: 'white' }}></hr> */}
        <Stack direction='row' spacing={1}>
          {/* <Box
            sx={{
              width: 500,
              maxWidth: '100%',
            }}
          > */}
          <TextField
            fullWidth
            label='Type something...'
            id='fullWidth'
            // className={classes.textField}
            // sx={{ color: 'white' }}
            // InputProps={{
            //   className: classes.input,
            // }}rgb(186, 184, 184)
            InputProps={{ style: { color: 'white', backgroundColor: 'rgb(35, 63, 105)' } }}
            InputLabelProps={{
              style: { color: 'white' },
            }}
            value={inputText}
            onChange={(event) => setInputText(event.target.value)}
          />
          {/* <CustomInput
            aria-label='Demo input'
            placeholder='Message...'
            value={inputText}
            onChange={(event) => setInputText(event.target.value)}
          /> */}
          {/* </Box> */}
          {/* <Button variant='contained' startIcon={<SendIcon />} width='20%'>
          Send
        </Button> */}
          {/* <IconButton
            size='large'
            edge='end'
            aria-label='show 4 new mails'
            // aria-controls={userMenuId}
            // onClick={handleProfileMenuOpen}
            color='inherit'
          >
            <SendIcon />
          </IconButton> */}
          <ColorButton
            variant='contained'
            endIcon={<SendIcon />}
            onClick={() => sendChat()}
            // sx={{ border: '1px solid white' }}
          >
            Send
          </ColorButton>
        </Stack>
      </div>
    </div>
  );
};

export default Chat;
