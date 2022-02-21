import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Global } from '@emotion/react';
import { styled } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { grey } from '@mui/material/colors';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';

// components
// cardの中身でひとつのcomponentをもっておくべきだ。そうすれば、reusableになる。
import UserDetail from './UserDetail';

const drawerBleeding = 54;

const Root = styled('div')(({ theme }) => ({
  // height: '100%',
  // backgroundColor: theme.palette.mode === 'light' ? grey[100] : theme.palette.background.default,
}));

const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'light' ? '#fff' : grey[800],
  // backgroundColor: 'grey',
}));

const Puller = styled(Box)(({ theme }) => ({
  width: 50,
  height: 6,
  // backgroundColor: theme.palette.mode === 'light' ? grey[300] : grey[900],
  backgroundColor: 'grey',
  borderRadius: 3,
  position: 'absolute',
  top: 8,
  left: 'calc(50% - 15px)',
}));

const SwipeableUserDetail = (props) => {
  const { window } = props;

  const toggleDrawer = (newOpen) => () => {
    props.setOpenSwipeableDrawer(newOpen);
  };

  // This is used only for the example
  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Root>
      <CssBaseline />
      <Global
        styles={{
          '.MuiDrawer-root > .MuiPaper-root': {
            height: `calc(50% - ${drawerBleeding}px)`,
            overflow: 'visible',
          },
        }}
      />
      {/* <Box sx={{ textAlign: 'center', pt: 1 }}>
        <Button onClick={toggleDrawer(true)}>Open</Button>
      </Box> */}
      <SwipeableDrawer
        container={container}
        anchor='bottom'
        open={props.openSwipeableDrawer}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
        swipeAreaWidth={drawerBleeding}
        disableSwipeToOpen={false}
        ModalProps={{
          keepMounted: true,
        }}
      >
        <StyledBox
          sx={{
            position: 'absolute',
            top: -drawerBleeding,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            visibility: 'visible',
            right: 0,
            left: 0,
          }}
        >
          <Puller />
          <Typography sx={{ p: 2, color: 'text.secondary' }}>Tap icons to see user's information!</Typography>
        </StyledBox>
        <StyledBox
          sx={{
            px: 2,
            pb: 2,
            height: '100%',
            overflow: 'auto',
          }}
        >
          <UserDetail socket={props.socket} userInfo={props.userInfo} isUserIconClicked={props.isUserIconClicked} />
        </StyledBox>
      </SwipeableDrawer>
    </Root>
  );
};

export default SwipeableUserDetail;
