import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Icon, Button } from 'semantic-ui-react';
import {
  CNavbar,
  CContainer,
  CNavbarBrand,
  CNavbarToggler,
  CCollapse,
  CNavbarNav,
  CNavItem,
  CNavLink,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CDropdownDivider,
  CForm,
  CFormInput,
  CButton,
} from '@coreui/react';

// components
import SignupWrapper from './Signup/SignupWrapper';
import { logoutActionCreator } from '../actionCreators/authActionCreators';

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  return (
    <>
      <CNavbar expand='lg' colorScheme='dark' className='bg-dark'>
        <CContainer fluid>
          <CNavbarBrand style={{ marginRight: '30px' }} href='#'>
            Lampost
          </CNavbarBrand>
          <CNavbarToggler onClick={() => setVisible(!visible)} />
          <CCollapse className='navbar-collapse' visible={visible}>
            <CNavbarNav>
              <CNavItem>
                <Link
                  style={{ marginRight: '100px' }}
                  // className='item'
                  to='/worldmap'
                >
                  <Icon enabled name='map signs' size='large' />
                </Link>
              </CNavItem>
              <CNavItem>
                <Link>
                  <Icon enabled name='film' size='large' />
                </Link>
              </CNavItem>
              <CDropdown variant='nav-item' popper={false}>
                <CDropdownToggle color='secondary'>
                  <Icon enanled name='group' size='large' />
                </CDropdownToggle>
                <CDropdownMenu>
                  <CDropdownItem href='#'>Join Meeting</CDropdownItem>
                  <CDropdownItem href='#'>Create Meeting</CDropdownItem>
                </CDropdownMenu>
              </CDropdown>
            </CNavbarNav>
          </CCollapse>
        </CContainer>
      </CNavbar>
    </>
  );
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
