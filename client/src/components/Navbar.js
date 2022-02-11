import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Icon } from 'semantic-ui-react';

// components
import SignupWrapper from './Signup/SignupWrapper';
import { logoutActionCreator } from '../actionCreators/authActionCreators';

const Navbar = (props) => {
  const [showSignupModal, setShowSignupModal] = useState(false);

  const UserPageLinkRender = () => {
    if (props.authState.currentUser) {
      return (
        <>
          <Link className='ui item' to={`/userpage/${props.authState.currentUser._id}`}>
            <Icon enabled name='address book' size='small' />
          </Link>
        </>
      );
    } else {
      return null;
    }
  };

  const renderSignupAndLoginButton = () => {
    if (props.authState.currentUser) {
      return (
        <>
          <Icon enabled name='sign-out alternate' size='small' onClick={() => props.logoutActionCreator()} />
        </>
      );
    } else {
      return (
        <>
          <Link className='ui item' to='/login'>
            Login
          </Link>
          {/* <Link className='ui item' to='/signup/basic'>
            Signup
          </Link> */}
          {/* <Icon enabled name='sign-in alternate' size='large' /> */}
          <button onClick={() => setShowSignupModal(true)}>Signup</button>
        </>
      );
    }
  };

  return (
    <>
      <div className='ui secondary menu'>
        <Link className='item' to='/worldmap'>
          <Icon enabled name='map signs' size='large' />
        </Link>
        {/* <Icon enabled name='film' size='small' />
      <Icon enabled name='film' size='small' /> */}
        <div className='right menu'>
          <div className='item'>
            <div className='ui icon input'>
              <i className='search link icon'></i>
            </div>
          </div>
          <Link className='ui item'>
            <Icon enanled name='group' size='small' />
          </Link>
          <Link className='ui item'>
            <Icon enabled name='film' size='small' />
          </Link>
          {UserPageLinkRender()}
          {renderSignupAndLoginButton()}
        </div>
      </div>
      <SignupWrapper showSignupModal={showSignupModal} setShowSignupModal={setShowSignupModal} />
    </>
  );
};

const mapStateToProps = (state) => {
  return { authState: state.authState };
};

export default connect(mapStateToProps, { logoutActionCreator })(Navbar);

// import * as React from 'react';
// import { styled, alpha } from '@mui/material/styles';
// import AppBar from '@mui/material/AppBar';
// import Box from '@mui/material/Box';
// import Toolbar from '@mui/material/Toolbar';
// import IconButton from '@mui/material/IconButton';
// import Typography from '@mui/material/Typography';
// import InputBase from '@mui/material/InputBase';
// import Badge from '@mui/material/Badge';
// import MenuItem from '@mui/material/MenuItem';
// import Menu from '@mui/material/Menu';
// import MenuIcon from '@mui/icons-material/Menu';
// import SearchIcon from '@mui/icons-material/Search';
// import AccountCircle from '@mui/icons-material/AccountCircle';
// import MailIcon from '@mui/icons-material/Mail';
// import NotificationsIcon from '@mui/icons-material/Notifications';
// import MoreIcon from '@mui/icons-material/MoreVert';

// const Search = styled('div')(({ theme }) => ({
//   position: 'relative',
//   borderRadius: theme.shape.borderRadius,
//   backgroundColor: alpha(theme.palette.common.white, 0.15),
//   '&:hover': {
//     backgroundColor: alpha(theme.palette.common.white, 0.25),
//   },
//   marginRight: theme.spacing(2),
//   marginLeft: 0,
//   width: '100%',
//   [theme.breakpoints.up('sm')]: {
//     marginLeft: theme.spacing(3),
//     width: 'auto',
//   },
// }));

// const SearchIconWrapper = styled('div')(({ theme }) => ({
//   padding: theme.spacing(0, 2),
//   height: '100%',
//   position: 'absolute',
//   pointerEvents: 'none',
//   display: 'flex',
//   alignItems: 'center',
//   justifyContent: 'center',
// }));

// const StyledInputBase = styled(InputBase)(({ theme }) => ({
//   color: 'inherit',
//   '& .MuiInputBase-input': {
//     padding: theme.spacing(1, 1, 1, 0),
//     // vertical padding + font size from searchIcon
//     paddingLeft: `calc(1em + ${theme.spacing(4)})`,
//     transition: theme.transitions.create('width'),
//     width: '100%',
//     [theme.breakpoints.up('md')]: {
//       width: '20ch',
//     },
//   },
// }));

// const PrimarySearchAppBar = () => {
//   const [anchorEl, setAnchorEl] = React.useState(null);
//   const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

//   const isMenuOpen = Boolean(anchorEl);
//   const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

//   const handleProfileMenuOpen = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleMobileMenuClose = () => {
//     setMobileMoreAnchorEl(null);
//   };

//   const handleMenuClose = () => {
//     setAnchorEl(null);
//     handleMobileMenuClose();
//   };

//   const handleMobileMenuOpen = (event) => {
//     setMobileMoreAnchorEl(event.currentTarget);
//   };

//   const menuId = 'primary-search-account-menu';
//   const renderMenu = (
//     <Menu
//       anchorEl={anchorEl}
//       anchorOrigin={{
//         vertical: 'top',
//         horizontal: 'right',
//       }}
//       id={menuId}
//       keepMounted
//       transformOrigin={{
//         vertical: 'top',
//         horizontal: 'right',
//       }}
//       open={isMenuOpen}
//       onClose={handleMenuClose}
//     >
//       <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
//       <MenuItem onClick={handleMenuClose}>My account</MenuItem>
//     </Menu>
//   );

//   const mobileMenuId = 'primary-search-account-menu-mobile';
//   const renderMobileMenu = (
//     <Menu
//       anchorEl={mobileMoreAnchorEl}
//       anchorOrigin={{
//         vertical: 'top',
//         horizontal: 'right',
//       }}
//       id={mobileMenuId}
//       keepMounted
//       transformOrigin={{
//         vertical: 'top',
//         horizontal: 'right',
//       }}
//       open={isMobileMenuOpen}
//       onClose={handleMobileMenuClose}
//     >
//       <MenuItem>
//         <IconButton size='large' aria-label='show 4 new mails' color='inherit'>
//           <Badge badgeContent={4} color='error'>
//             <MailIcon />
//           </Badge>
//         </IconButton>
//         <p>Messages</p>
//       </MenuItem>
//       <MenuItem>
//         <IconButton size='large' aria-label='show 17 new notifications' color='inherit'>
//           <Badge badgeContent={17} color='error'>
//             <NotificationsIcon />
//           </Badge>
//         </IconButton>
//         <p>Notifications</p>
//       </MenuItem>
//       <MenuItem onClick={handleProfileMenuOpen}>
//         <IconButton
//           size='large'
//           aria-label='account of current user'
//           aria-controls='primary-search-account-menu'
//           aria-haspopup='true'
//           color='inherit'
//         >
//           <AccountCircle />
//         </IconButton>
//         <p>Profile</p>
//       </MenuItem>
//     </Menu>
//   );

//   return (
//     <Box sx={{ flexGrow: 1 }}>
//       <AppBar position='static' sx={{ backgroundColor: 'black' }}>
//         <Toolbar>
//           <IconButton size='large' edge='start' color='inherit' aria-label='open drawer' sx={{ mr: 2 }}>
//             <MenuIcon />
//           </IconButton>
//           <Typography variant='h6' noWrap component='div' sx={{ display: { xs: 'none', sm: 'block' } }}>
//             Echolocation
//           </Typography>
//           <Search>
//             <SearchIconWrapper>
//               <SearchIcon />
//             </SearchIconWrapper>
//             <StyledInputBase placeholder='Search…' inputProps={{ 'aria-label': 'search' }} />
//           </Search>
//           <Box sx={{ flexGrow: 1 }} />
//           <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
//             <IconButton size='large' aria-label='show 4 new mails' color='inherit'>
//               <Badge badgeContent={4} color='error'>
//                 <MailIcon />
//               </Badge>
//             </IconButton>
//             <IconButton size='large' aria-label='show 17 new notifications' color='inherit'>
//               <Badge badgeContent={17} color='error'>
//                 <NotificationsIcon />
//               </Badge>
//             </IconButton>
//             <IconButton
//               size='large'
//               edge='end'
//               aria-label='account of current user'
//               aria-controls={menuId}
//               aria-haspopup='true'
//               onClick={handleProfileMenuOpen}
//               color='inherit'
//             >
//               <AccountCircle />
//             </IconButton>
//           </Box>
//           <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
//             <IconButton
//               size='large'
//               aria-label='show more'
//               aria-controls={mobileMenuId}
//               aria-haspopup='true'
//               onClick={handleMobileMenuOpen}
//               color='inherit'
//             >
//               <MoreIcon />
//             </IconButton>
//           </Box>
//         </Toolbar>
//       </AppBar>
//       {renderMobileMenu}
//       {renderMenu}
//     </Box>
//   );
// };

// export default PrimarySearchAppBar;
