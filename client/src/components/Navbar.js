import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreIcon from '@mui/icons-material/MoreVert';
import Button from '@mui/material/Button';
import LoginIcon from '@mui/icons-material/Login';
import SendIcon from '@mui/icons-material/Send';
import Stack from '@mui/material/Stack';

// components
import SignupWrapper from './Signup/SignupWrapper';
import Login from './Signup/Login';
import { logoutActionCreator } from '../actionCreators/authActionCreators';

const Navbar = (props) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  // これなんだろね。。。
  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
    </Menu>
  );

  // これなんだろね。。。
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
      <MenuItem onClick={handleProfileMenuOpen}>
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
            <Button
              variant='contained'
              // startIcon={<LoginIcon />}
              onClick={() => setShowSignupModal(true)}
            >
              Signup
            </Button>
            <Button
              variant='contained'
              // endIcon={<SendIcon />}
              onClick={() => setShowLoginModal(true)}
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
          <IconButton size='large' aria-label='show 4 new mails' color='inherit'>
            <Badge badgeContent={4} color='error'>
              <MailIcon />
            </Badge>
          </IconButton>
          <IconButton size='large' aria-label='show 17 new notifications' color='inherit'>
            <Badge badgeContent={17} color='error'>
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <IconButton
            size='large'
            edge='end'
            aria-label='account of current user'
            aria-controls={menuId}
            aria-haspopup='true'
            onClick={handleProfileMenuOpen}
            color='inherit'
          >
            <AccountCircle />
          </IconButton>
        </>
      );
    } else {
      return null;
    }
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position='static'>
          <Toolbar>
            <IconButton size='large' edge='start' color='inherit' aria-label='open drawer' sx={{ mr: 2 }}>
              <MenuIcon />
            </IconButton>
            <Typography variant='h6' noWrap component='div' sx={{ display: { xs: 'none', sm: 'block' } }}>
              Lamppost
            </Typography>
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              {renderSignupAndLogin()}
              {renderToolIconButtons()}
            </Box>
            {/* ここのBoxってなんだろな。。。 */}
            <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size='large'
                aria-label='show more'
                aria-controls={mobileMenuId}
                aria-haspopup='true'
                onClick={handleMobileMenuOpen}
                color='inherit'
              >
                <MoreIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>
        {renderMobileMenu}
        {renderMenu}
      </Box>
      <SignupWrapper showSignupModal={showSignupModal} setShowSignupModal={setShowSignupModal} />
      <Login showLoginModal={showLoginModal} setShowLoginModal={setShowLoginModal} />
    </>
  );
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
  return { authState: state.authState };
};

export default connect(mapStateToProps, { logoutActionCreator })(Navbar);
