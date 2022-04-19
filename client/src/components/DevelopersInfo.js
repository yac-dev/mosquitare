import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Avatar } from '@mui/material';

// ac
import { loadMeActionCreator } from '../actionCreators/authActionCreators';

const DevelopersInfo = (props) => {
  useEffect(() => {
    const jwtToken = localStorage.getItem('mosquitare token');
    if (jwtToken) {
      props.loadMeActionCreator(jwtToken);
    }
  }, []);
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div>
        <h3>Developers' Info</h3>
        <div>YK 🇯🇵</div>
        <div className='my-socials'>
          <a className='fa fa-facebook' href='https://www.facebook.com/Lampost-101405925890356' target='_blank'></a>
          {/* <a className='fa fa-github' href='https://github.com/yac-dev' target='_blank'></a> */}
          <a
            className='fa fa-linkedin'
            href='https://www.linkedin.com/uas/login?session_redirect=https%3A%2F%2Fwww.linkedin.com%2Ffeed%2F'
            target='_blank'
          ></a>
          <div>email address: lamposttech@gmail.com</div>
        </div>
        Please send a message if you find a bug, issue or have any questions,
      </div>
    </div>
  );
};

export default connect(null, { loadMeActionCreator })(DevelopersInfo);
