import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
// import { Icon, Button } from 'semantic-ui-react';
// import {
//   CNavbar,
//   CContainer,
//   CNavbarBrand,
//   CNavbarToggler,
//   CCollapse,
//   CNavbarNav,
//   CNavItem,
//   CNavLink,
//   CDropdown,
//   CDropdownToggle,
//   CDropdownMenu,
//   CDropdownItem,
//   CDropdownDivider,
//   CForm,
//   CFormInput,
//   CButton,
// } from '@coreui/react';
// import IconButton from '@mui/material/IconButton';
// import AccountCircle from '@mui/icons-material/AccountCircle';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Tooltip from '@mui/material/Tooltip';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import CreateIcon from '@mui/icons-material/Create';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import MapIcon from '@mui/icons-material/Map';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import ExploreIcon from '@mui/icons-material/Explore';
import GroupsIcon from '@mui/icons-material/Groups';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreIcon from '@mui/icons-material/MoreVert';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import SettingsIcon from '@mui/icons-material/Settings';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import Button from '@mui/material/Button';
import EmailIcon from '@mui/icons-material/Email';
import PeopleIcon from '@mui/icons-material/People';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import InfoIcon from '@mui/icons-material/Info';

import SendIcon from '@mui/icons-material/Send';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import Stack from '@mui/material/Stack';
import BarChartIcon from '@mui/icons-material/BarChart';

// components
import SignupWrapper from './Signup/SignupWrapper';
import Login from './Signup/Login';

// components
import { logoutActionCreator } from '../actionCreators/authActionCreators';
import { showInboxModalActionCreator } from '../actionCreators/modalActionCreator';
import { clickNavMessageIconActionCreator } from '../actionCreators/clickActionCreator';
//ac

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

const Navbar = (props) => {
  const [anchorElForUserMenu, setAnchorElForUserMenu] = useState(null);
  const [anchorElForGroupMenu, setAnchorElForGroupMenu] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);

  const isUserMenuOpen = Boolean(anchorElForUserMenu);
  const isGroupMenuOpen = Boolean(anchorElForGroupMenu);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const history = useHistory();

  const handleGroupMenuOpen = (event) => {
    setAnchorElForGroupMenu(event.currentTarget);
  };

  const handleUserMenuOpen = (event) => {
    setAnchorElForUserMenu(event.currentTarget);
  }; // icon clickでこれを起こす。

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleUserMenuClose = () => {
    setAnchorElForUserMenu(null);
    handleMobileMenuClose();
  };

  const handleGroupMenuClose = () => {
    setAnchorElForGroupMenu(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  // これなんだろね。。。
  const userMenuId = 'primary-search-account-menu';
  const renderUserMenu = (
    <Menu
      anchorEl={anchorElForUserMenu}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={userMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isUserMenuOpen}
      onClose={handleUserMenuClose}
    >
      <MenuItem
        onClick={() =>
          //  history.push(`/userpage/${props.authState.currentUser._id}`)
          (window.location = `/userpage/${props.authState.currentUser._id}`)
        }
      >
        <LocalLibraryIcon />
        &nbsp;My Library
      </MenuItem>
      {/* <MenuItem onClick={() => props.showInboxModalActionCreator(true)}>
        <EmailIcon />
        &nbsp;Messages
      </MenuItem> */}
      <MenuItem disabled={true}>
        <PeopleIcon />
        &nbsp;Friends
      </MenuItem>
      <MenuItem disabled={true}>
        <MenuBookIcon />
        &nbsp; Activity
      </MenuItem>
      <MenuItem onClick={handleUserMenuClose} disabled={true}>
        <SettingsIcon />
        &nbsp;Setting
      </MenuItem>
      <MenuItem onClick={() => props.logoutActionCreator()}>
        <LogoutIcon /> &nbsp; Logout
      </MenuItem>
    </Menu>
  );

  const groupMenuId = 'primary-search-account-menu';
  const renderGroupMenu = (
    <Menu
      anchorEl={anchorElForGroupMenu}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={groupMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isGroupMenuOpen}
      onClose={handleGroupMenuClose}
    >
      <MenuItem disabled={true}>
        Create a Meeting&nbsp; <CreateIcon />
      </MenuItem>
      <MenuItem disabled={true}>
        Join a Meeting&nbsp; <MeetingRoomIcon />
      </MenuItem>
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton size='large' aria-label='show 4 new mails' color='inherit'>
          <Badge badgeContent={4} color='error'>
            <MailIcon />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem>
      <MenuItem>
        <IconButton size='large' aria-label='show 17 new notifications' color='inherit'>
          <Badge badgeContent={17} color='error'>
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem>
        <IconButton size='large' aria-label='show 17 new notifications' color='inherit'>
          <Badge badgeContent={17} color='error'>
            <Button variant='contained' endIcon={<PowerSettingsNewIcon />}>
              Logout
            </Button>
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>

      <MenuItem onClick={handleUserMenuOpen}>
        <IconButton
          size='large'
          aria-label='account of current user'
          aria-controls='primary-search-account-menu'
          aria-haspopup='true'
          color='inherit'
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  const renderSignupAndLogin = () => {
    if (props.authState.currentUser) {
      return null;
    } else {
      return (
        <>
          <Stack direction='row' spacing={2}>
            <Tooltip title='Public Library'>
              <IconButton size='large' color='inherit'>
                {/* <Badge badgeContent={17} color='error'> */}
                <VideoLibraryIcon
                  onClick={() => {
                    window.location = '/allvideos';
                  }}
                />
                {/* </Badge> */}
              </IconButton>
            </Tooltip>
            <Button
              variant='text'
              startIcon={<BorderColorIcon />}
              sx={{ color: 'white' }}
              onClick={() => {
                setShowSignupModal(true);
                setShowLoginModal(false);
              }}
            >
              Signup
            </Button>
            <Button
              variant='text'
              startIcon={<LoginIcon />}
              sx={{ color: 'white' }}
              onClick={() => {
                setShowLoginModal(true);
                setShowSignupModal(false);
              }}
            >
              Login
            </Button>
          </Stack>
        </>
      );
    }
  };

  const renderToolIconButtons = () => {
    // logged inの時にのみこれを表示する。
    if (props.authState.currentUser) {
      return (
        <>
          <Stack direction='row' spacing={2}>
            <Tooltip title='World Stats ( Under construction 🚜🛠  Please wait for a bit.)'>
              <IconButton
                size='large'
                edge='end'
                aria-label='show 4 new mails'
                aria-controls={userMenuId}
                // onClick={handleProfileMenuOpen}
                color='inherit'
              >
                <BarChartIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title='Meet Up ( Under construction 🚜🛠  Please wait for a bit.)'>
              <IconButton
                size='large'
                edge='end'
                aria-label='show 4 new mails'
                aria-controls={groupMenuId}
                aria-haspopup='true'
                onClick={handleGroupMenuOpen}
                color='inherit'
              >
                {/* <Badge badgeContent={4} color='error'> */}
                <GroupsIcon />
                {/* </Badge> */}
              </IconButton>
            </Tooltip>

            <Tooltip title='Public Library'>
              <IconButton size='large' color='inherit'>
                {/* <Badge badgeContent={17} color='error'> */}
                <VideoLibraryIcon
                  onClick={() => {
                    window.location = '/allvideos';
                  }}
                />
                {/* </Badge> */}
              </IconButton>
            </Tooltip>

            <Tooltip title='Messages'>
              <IconButton
                size='large'
                edge='end'
                aria-label='show 4 new mails'
                aria-controls={groupMenuId}
                aria-haspopup='true'
                onClick={() => props.clickNavMessageIconActionCreator(true)}
                color='inherit'
              >
                {/* <Badge badgeContent={4} color='error'> */}
                <EmailIcon />
                {/* </Badge> */}
              </IconButton>
            </Tooltip>

            <Tooltip title='My Account'>
              <IconButton
                size='large'
                edge='end'
                aria-label='account of current user'
                // component={Link}
                // to={`/userpage/${props.authState.currentUser._id}`}
                aria-controls={userMenuId}
                aria-haspopup='true'
                onClick={handleUserMenuOpen}
                color='inherit'
              >
                {/* <Link to={`/userpage/${props.authState.currentUser._id}`}> */}
                <AccountCircle />
                {/* </Link> */}
              </IconButton>
            </Tooltip>
            {/* <Button variant='contained' endIcon={<LogoutIcon />}>
              Logout
            </Button> */}
          </Stack>
        </>
      );
    } else {
      return null;
    }
  };

  const renderExploreAndSearchIcon = () => {
    // if (props.authState.currentUser) {
    return (
      <>
        <Tooltip title='World Map'>
          <IconButton
            size='large'
            aria-label='show 17 new notifications'
            color='inherit'
            onClick={() => (window.location = '/')}
          >
            <ExploreIcon />
          </IconButton>
        </Tooltip>
        {/* <Tooltip title='Search People ( Under construction 🚜🛠 Please wait for a bit.)'>
            <IconButton
              size='large'
              aria-label='show 17 new notifications'
              color='inherit'
              // onClick={() => (window.location = '/worldmap')}
            >
              <TravelExploreIcon />
            </IconButton>
          </Tooltip> */}
        <Tooltip title="Developers's Info">
          <IconButton
            size='large'
            aria-label='show 17 new notifications'
            color='inherit'
            onClick={() => (window.location = '/developersinfo')}
          >
            <InfoIcon />
          </IconButton>
        </Tooltip>
      </>
    );
    // }
    // else {
    //   return null;
    // }
  };

  const renderNavbar = () => {
    if (props.mediaState.callAccepted) {
      return null;
    } else {
      return (
        <>
          <ThemeProvider theme={theme}>
            <Box sx={{ flexGrow: 1 }}>
              <AppBar
                // position='fixed'
                position='static'
                color='transparent'
                style={{ background: 'rgb(0, 30, 60)', boxShadow: 'none' }}
              >
                <Toolbar>
                  <Typography variant='h6' noWrap component='div' sx={{ display: 'block', color: 'white' }}>
                    Lampost&nbsp;
                  </Typography>
                  <Box
                    sx={{ display: { xxs: 'none', xs: 'none', sm: 'flex', md: 'flex', lg: 'flex' }, color: 'white' }}
                  >
                    {renderExploreAndSearchIcon()}
                  </Box>
                  <Box sx={{ flexGrow: 1 }} />
                  <Box
                    sx={{ display: { xxs: 'none', xs: 'none', sm: 'flex', md: 'flex', lg: 'flex' }, color: 'white' }}
                  >
                    {renderSignupAndLogin()}
                    {renderToolIconButtons()}
                  </Box>
                  {/* ここのBoxってなんだろな。。。 */}
                  <Box sx={{ display: { xs: 'flex', sm: 'none' } }}>
                    <IconButton
                      size='large'
                      aria-label='show more'
                      aria-controls={mobileMenuId}
                      aria-haspopup='true'
                      onClick={handleMobileMenuOpen}
                      color='inherit'
                      sx={{ color: 'white' }}
                    >
                      <MenuIcon />
                    </IconButton>
                  </Box>
                </Toolbar>
              </AppBar>
              {renderMobileMenu}
              {renderUserMenu}
              {renderGroupMenu}
            </Box>
          </ThemeProvider>
          <SignupWrapper showSignupModal={showSignupModal} setShowSignupModal={setShowSignupModal} />
          <Login showLoginModal={showLoginModal} setShowLoginModal={setShowLoginModal} />
        </>
      );
    }
  };

  return <>{renderNavbar()}</>;
  // const [visible, setVisible] = useState(false);
  // return (
  //   <>
  //     <CNavbar expand='lg' colorScheme='dark' className='bg-dark'>
  //       <CContainer fluid>
  //         <CNavbarBrand style={{ marginRight: '30px' }} href='#'>
  //           Lampost
  //         </CNavbarBrand>
  //         <CNavbarToggler onClick={() => setVisible(!visible)} />
  //         <CCollapse className='navbar-collapse' visible={visible}>
  //           <CNavbarNav className='me-auto mb-2 mb-lg-0'>
  //             <CNavItem>
  //               <Link
  //                 style={{ marginRight: '100px' }}
  //                 // className='item'
  //                 to='/worldmap'
  //               >
  //                 <Icon enabled name='map signs' size='large' />
  //               </Link>
  //             </CNavItem>
  //             <CNavItem>
  //               <Link>
  //                 <Icon enabled name='film' size='large' />
  //               </Link>
  //             </CNavItem>
  //             <CDropdown variant='nav-item' popper={false}>
  //               <CDropdownToggle color='secondary'>
  //                 <Icon enanled name='group' size='large' />
  //               </CDropdownToggle>
  //               <CDropdownMenu>
  //                 <CDropdownItem href='#'>Join Meeting</CDropdownItem>
  //                 <CDropdownItem href='#'>Create Meeting</CDropdownItem>
  //               </CDropdownMenu>
  //             </CDropdown>
  //           </CNavbarNav>
  //           <IconButton
  //             size='large'
  //             aria-label='account of current user'
  //             aria-controls='menu-appbar'
  //             aria-haspopup='true'
  //             // onClick={handleMenu}
  //             color='inherit'
  //           >
  //             <AccountCircle />
  //           </IconButton>
  //           {/* <div className='d-grid gap-2 d-md-flex justify-content-md-end'>
  //             <CButton color='primary' className='me-md-2'>
  //               <Icon enabled name='film' size='large' />
  //             </CButton>
  //           </div> */}
  //           {/* <AccountCircleIcon /> */}
  //           {/* <CForm className='d-flex'>
  //             <CFormInput type='search' className='me-2' placeholder='Search' />
  //             <CButton type='submit' color='success' variant='outline'>
  //               Search
  //             </CButton>
  //           </CForm> */}
  //         </CCollapse>
  //       </CContainer>
  //     </CNavbar>
  //   </>
  // );
};

// const Navbar = (props) => {
//   const [showSignupModal, setShowSignupModal] = useState(false);

//   const UserPageLinkRender = () => {
//     if (props.authState.currentUser) {
//       return (
//         <>
//           <Link className='ui item' to={`/userpage/${props.authState.currentUser._id}`}>
//             <Icon enabled name='address book' size='small' />
//           </Link>
//         </>
//       );
//     } else {
//       return null;
//     }
//   };

//   const renderSignupAndLoginButton = () => {
//     if (props.authState.currentUser) {
//       return (
//         <>
//           <Icon enabled name='sign-out alternate' size='small' onClick={() => props.logoutActionCreator()} />
//         </>
//       );
//     } else {
//       return (
//         <>
//           <Link className='ui item' to='/login'>
//             Login
//           </Link>
//           {/* <Link className='ui item' to='/signup/basic'>
//             Signup
//           </Link> */}
//           {/* <Icon enabled name='sign-in alternate' size='large' /> */}
//           <button onClick={() => setShowSignupModal(true)}>Signup</button>
//         </>
//       );
//     }
//   };

//   return (
//     <>
//       <div className='ui secondary menu'>
//         <Link className='item' to='/worldmap'>
//           <Icon enabled name='map signs' size='large' />
//         </Link>
//         {/* <Icon enabled name='film' size='small' />
//       <Icon enabled name='film' size='small' /> */}
//         <div className='right menu'>
//           <div className='item'>
//             <div className='ui icon input'>
//               <i className='search link icon'></i>
//             </div>
//           </div>
//           <Link className='ui item'>
//             <Icon enanled name='group' size='small' />
//           </Link>
//           <Link className='ui item'>
//             <Icon enabled name='film' size='small' />
//           </Link>
//           {UserPageLinkRender()}
//           {renderSignupAndLoginButton()}
//         </div>
//       </div>
//       <SignupWrapper showSignupModal={showSignupModal} setShowSignupModal={setShowSignupModal} />
//     </>
//   );
// };

const mapStateToProps = (state) => {
  return { authState: state.authState, mediaState: state.mediaState };
};

export default connect(mapStateToProps, {
  logoutActionCreator,
  showInboxModalActionCreator,
  clickNavMessageIconActionCreator,
})(Navbar);
