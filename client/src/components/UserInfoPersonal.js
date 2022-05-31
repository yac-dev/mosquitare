import React from 'react';
import { connect } from 'react-redux';
import { SocialIcon } from 'react-social-icons';

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
import WorkIcon from '@mui/icons-material/Work';

// mui components
import Tooltip from '@mui/material/Tooltip';
import Zoom from '@mui/material/Zoom';

// components
import PersonalityChart from './PersonalityChart';
import PersonalityChartMobile from './PersonalityChartMobile';

// css
import '../styles/userInfoPersonal.css';
import { useMediaQuery } from 'react-responsive';

const Desktop = ({ children }) => {
  const isDesktop = useMediaQuery({ minWidth: 992 });
  return isDesktop ? children : null;
};

const Tablet = ({ children }) => {
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 991 });
  return isTablet ? children : null;
};

const Mobile = ({ children }) => {
  const isMobile = useMediaQuery({ maxWidth: 599 });
  return isMobile ? children : null;
};

const Default = ({ children }) => {
  const isNotMobile = useMediaQuery({ minWidth: 768 });
  return isNotMobile ? children : null;
};

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

  const renderRomance = () => {
    if (props.user.ratingAverage['romanceHunter'] >= 1) {
      return (
        <Tooltip
          TransitionComponent={Zoom}
          title={"According to other user's rating, this user seems to be looking for romance 💕😍"}
          arrow
        >
          <span style={{ backgroundColor: 'rgb(219, 217, 217)', padding: '2px', borderRadius: '5px' }}>
            💕😍 Looking for Romance&nbsp;
            <span style={{ backgroundColor: 'rgb(227, 19, 0)', color: 'white', padding: '4px', borderRadius: '5px' }}>
              +{props.user.ratingAverage['romanceHunter']}
            </span>
          </span>
        </Tooltip>
      );
    }
  };

  const renderMoney = () => {
    if (props.user.ratingAverage['moneyHunter'] >= 1) {
      return (
        <Tooltip
          TransitionComponent={Zoom}
          title={"According to other user's rating, this user seems be asking for money 💰🤑"}
          arrow
        >
          <span style={{ backgroundColor: 'rgb(219, 217, 217)', padding: '2px', borderRadius: '5px' }}>
            💰🤑 Need some money&nbsp;
            <span style={{ backgroundColor: 'rgb(227, 19, 0)', color: 'white', padding: '4px', borderRadius: '5px' }}>
              +{props.user.ratingAverage['moneyHunter']}
            </span>
          </span>
        </Tooltip>
      );
    }
  };

  const renderRacism = () => {
    if (props.user.ratingAverage['racism'] >= 1) {
      return (
        <Tooltip
          TransitionComponent={Zoom}
          title={"According to other user's rating, this user sometimes seems to do a racist behavior."}
          arrow
        >
          <span style={{ backgroundColor: 'rgb(219, 217, 217)', padding: '2px', borderRadius: '5px' }}>
            Racist&nbsp;
            <span style={{ backgroundColor: 'rgb(227, 19, 0)', color: 'white', padding: '4px', borderRadius: '5px' }}>
              +{props.user.ratingAverage['racism']}
            </span>
          </span>
        </Tooltip>
      );
    }
  };

  const renderGettingNumber = () => {
    if (props.user.ratingAverage['numberHunter'] >= 1) {
      return (
        <span style={{ backgroundColor: 'rgb(219, 217, 217)', padding: '2px', borderRadius: '5px' }}>
          📱💕 Getting Number&nbsp;
          <span style={{ backgroundColor: 'rgb(227, 19, 0)', color: 'white', padding: '4px', borderRadius: '5px' }}>
            +{props.user.ratingAverage['numberHunter']}
          </span>
        </span>
      );
    }
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
        <Default>
          <PersonalityChart user={props.user} />
        </Default>
        <Mobile>
          <PersonalityChartMobile user={props.user} />
        </Mobile>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
          {renderRomance()}
          {renderMoney()}
          {renderRacism()}
        </div>
      </div>
      <div className='self-intro'>
        <h6 style={{ borderBottom: '1px solid rgb(217,217,217)' }}>
          <HailIcon />
          Self-Intro
        </h6>
        <div style={{ width: '100%', wordBreak: 'break-word' }}>
          <p style={{ display: 'inline-block', lineHeight: 1.5 }}>{props.user.selfIntroduction}</p>
        </div>
      </div>

      {/* <div className='self-introduction' style={{ marginBottom: '20px' }}>
        <h6 style={{ borderBottom: '1px solid rgb(217, 217, 217)' }}>
          <EmojiPeopleIcon />
          Self-Introduction&nbsp;
        </h6>
        <p>{props.user.selfIntroduction}</p>
      </div> */}

      {/* <div className='socials' style={{ marginBottom: '20px' }}>
        <h6 style={{ borderBottom: '1px solid rgb(217, 217, 217)' }}>
          <WorkIcon />
          Job&nbsp;
        </h6>
      </div> */}
    </div>
  );
};

const mapStateToProps = (state) => {
  return { messagesState: Object.values(state.messagesState) };
};

export default connect(mapStateToProps)(UserInfoPersonal);
