import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <div className='ui secondary  menu'>
      <Link className='item' to='/'>
        Home
      </Link>
      {/* <Link className='item'>Messages</Link> */}
      {/* <Link className='item active'>Friends</Link> */}
      <div className='right menu'>
        <div className='item'>
          <div className='ui icon input'>
            {/* <input type="text" placeholder="Search..."> */}
            <i className='search link icon'></i>
          </div>
        </div>
        <Link className='ui item' to='/'>
          Logout
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
