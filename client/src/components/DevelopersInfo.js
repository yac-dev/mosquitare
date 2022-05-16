import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Avatar } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import MyProfilePicture from '../Images/IMG_5887 2.jpg';

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
        <h3>Developer Info</h3>
        <div>YK 🇯🇵</div>
        <img className='profile-photo' src={MyProfilePicture} alt={'YK'} width='150px' />
        <div>
          Hello! I'm YK from Japan. I'm a software developer, founded this app. Thank you for joining here. Please let
          me know if you find any bugs, issues or have any questions. Enjoy 👍
        </div>
        <div className='my-socials'>
          <div>
            <span>
              Lampost page:
              <a className='fa fa-facebook' href='https://www.facebook.com/Lampost-101405925890356' target='_blank'></a>
            </span>
          </div>
          <div>
            <span>
              Lampost community:{' '}
              {/* <a className='fa fa-github' href='https://github.com/yac-dev' target='_blank'></a> */}
            </span>
          </div>
          <div>
            <span>
              My Linkedin:{' '}
              <a
                className='fa fa-linkedin'
                href='https://www.linkedin.com/uas/login?session_redirect=https%3A%2F%2Fwww.linkedin.com%2Ffeed%2F'
                target='_blank'
              ></a>
            </span>
          </div>

          <div>
            <EmailIcon />
            Email address: lamposttech@gmail.com
          </div>
        </div>
      </div>
    </div>
  );
};

export default connect(null, { loadMeActionCreator })(DevelopersInfo);
