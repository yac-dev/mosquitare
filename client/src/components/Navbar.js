import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { logoutActionCreator } from '../actionCreators/authActionCreators';

const Navbar = (props) => {
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
        <Link className='ui item' to='/login'>
          Login
        </Link>
        <Link className='ui item' to='/signup/basic'>
          Signup
        </Link>
        <button onClick={() => props.logoutActionCreator()}>Logout</button>
      </div>
    </div>
  );
};

export default connect(null, { logoutActionCreator })(Navbar);
