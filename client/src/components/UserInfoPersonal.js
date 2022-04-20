import React from 'react';

// mui icons
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import HelpIcon from '@mui/icons-material/Help';
import HailIcon from '@mui/icons-material/Hail';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import GitHubIcon from '@mui/icons-material/GitHub';
import BarChartIcon from '@mui/icons-material/BarChart';

// mui components
import Tooltip from '@mui/material/Tooltip';

// components
import PersonalityChart from './PersonalityChart';

// css
import '../styles/userInfoPersonal.css';

const UserInfoPersonal = (props) => {
  // const renderBadges = (user) => {
  //   return <div>{user.name} Badges</div>;
  // };

  const renderBadges = () => {
    const personalStatusList = props.user.personalStatus.map((status) => {
      return (
        <>
          <span style={{ backgroundColor: 'rgb(219, 217, 217)', padding: '2px', borderRadius: '5px' }}>{status}</span>
          &nbsp;
        </>
      );
    });

    return <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2px' }}>{personalStatusList}</div>;
  };

  return (
    <div className='user-info-personal' style={{ padding: '10px' }}>
      <div className='badges' style={{ marginBottom: '20px' }}>
        <h6 style={{ borderBottom: '1px solid rgb(217, 217, 217)' }}>
          <BarChartIcon />
          Personal Status&nbsp; <span></span>
          <Tooltip title='This status is based on user reviews.'>
            <HelpIcon />
          </Tooltip>
        </h6>
        {/* {renderBadges(props.user)} */}
        <PersonalityChart user={props.user} />
      </div>

      <div className='self-introduction' style={{ marginBottom: '20px' }}>
        <h6 style={{ borderBottom: '1px solid rgb(217, 217, 217)' }}>
          <EmojiPeopleIcon />
          Self-Introduction&nbsp;
        </h6>
        <p>{props.user.selfIntroduction}</p>
      </div>

      <div className='socials' style={{ marginBottom: '20px' }}>
        <h6 style={{ borderBottom: '1px solid rgb(217, 217, 217)' }}>
          <FacebookIcon />
          Socials&nbsp;
        </h6>
        <a className='fa fa-facebook'></a>
        <a className='fa fa-twitter'></a>
        <a className='fa fa-github'></a>
        <a className='fa fa-youtube'></a>
        <a className='fa fa-instagram'></a>
        <a className='fa fa-linkedin'></a>
        <a className='fa fa-pinterest'></a>
        <a className='fa fa-reddit'></a>
      </div>
    </div>
  );
};

export default UserInfoPersonal;
