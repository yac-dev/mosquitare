import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { logoutActionCreator } from '../actionCreators/authActionCreators';

const Navbar = (props) => {
  const UserPageLinkRender = () => {
    if (props.authState.currentUser) {
      return (
        <>
          <Link className='ui item' to={`/userpage/${props.authState.currentUser._id}`}>
            Userpage
          </Link>
        </>
      );
    } else {
      return null;
    }
  };

  const SignupLoginButtonRender = () => {
    if (props.authState.currentUser) {
      return (
        <>
          <button onClick={() => props.logoutActionCreator()}>Logout</button>
        </>
      );
    } else {
      return (
        <>
          <Link className='ui item' to='/login'>
            Login
          </Link>
          <Link className='ui item' to='/signup/basic'>
            Signup
          </Link>
        </>
      );
    }
  };

  return (
    <div className='ui secondary  menu'>
      <Link className='item' to='/'>
        Home
      </Link>
      <div className='right menu'>
        <div className='item'>
          <div className='ui icon input'>
            <i className='search link icon'></i>
          </div>
        </div>
        {UserPageLinkRender()}
        {SignupLoginButtonRender()}
        {/* <Link className='ui item' to='/login'>
          Login
        </Link>
        <Link className='ui item' to='/signup/basic'>
          Signup
        </Link> */}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return { authState: state.authState };
};

export default connect(mapStateToProps, { logoutActionCreator })(Navbar);
