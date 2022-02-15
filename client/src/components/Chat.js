import React, { useState } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { withStyles } from '@mui/styles';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import SendIcon from '@mui/icons-material/Send';
import Input from '@mui/material/Input';
import InputUnstyled from '@mui/base/InputUnstyled';
import { styled } from '@mui/system';

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

const Chat = (props) => {
  const [text, setText] = useState('');
  // const classes = styles(props);

  return (
    <div
      className={`tab-content ${props.isSelected === 'chat' ? undefined : 'hidden'}`}
      style={{ color: 'white', position: 'relative' }}
    >
      <div className='chats'>hello</div>
      <hr style={{ color: 'white' }}></hr>
      <div className='input-and-send' style={{ width: '700px', position: 'absolute', bottom: '0' }}>
        {/* <Stack direction='row' spacing={2}> */}
        {/* <Box
            sx={{
              width: 500,
              maxWidth: '100%',
            }}
          > */}
        {/* <TextField
              fullWidth
              label='Message'
              id='fullWidth'
              className={classes.textField}
              // sx={{ input: { color: 'white' } }}
              // InputProps={{
              //   className: classes.input,
              // }}
              InputProps={{ style: { color: 'black', backgroundColor: 'white' } }}
            /> */}
        <CustomInput aria-label='Demo input' placeholder='Type message...' />
        {/* </Box> */}
        {/* <Button variant='contained' startIcon={<SendIcon />} width='20%'>
            Send
          </Button> */}
        {/* </Stack> */}
      </div>
    </div>
  );
};

export default Chat;
