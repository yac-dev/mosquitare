import React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import HelpIcon from '@mui/icons-material/Help';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LanguageIcon from '@mui/icons-material/Language';

// mui for options
import { styled, alpha } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

// components
import LanguageChart from './LanguageChart';
import CallButton from './CallButton';
import VisitedMap from './VisitedMap';
import NavbarCollapse from 'react-bootstrap/esm/NavbarCollapse';
import BasicUserInfo from './UserInfoHeader';
import UserInfoWrapper from './UserInfoWrapper';

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color: theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
      },
    },
  },
}));

const UserDetail = (props) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const renderPersonalStatus = () => {
    const statuses = props.userInfo.info.personalStatus.map((status) => {
      return (
        <div style={{ borderRadius: '10px', backgroundColor: '#7FFF00', display: 'inline', padding: '5px' }}>
          {status}
        </div>
      );
    });

    return <>{statuses}</>;
  };

  const renderVisitedCountries = () => {
    const visitedCountriesList = props.userInfo.info.visited.map((country) => {
      return (
        <>
          <img src={country.flagPics[0]} style={{ width: '16px', height: '10px' }} />
          &nbsp;
        </>
      );
    });

    return <>{visitedCountriesList}</>;
  };

  const howMuchCompleted = (countriesLength) => {
    const percent = Math.floor((countriesLength / 198) * 100);
    return (
      <>
        <span>Completed {percent}&#37;</span>&nbsp;
      </>
    );
  };

  const renderUserDetail = () => {
    if (props.isUserIconClicked) {
      if (props.userInfo.info) {
        return (
          <>
            <div
              // sx={{ width: 450, height: '85vh', position: 'absolute', right: '50px', bottom: '50px' }}
              style={{ width: '100%', height: '100%', backgroundColor: 'rgb(0, 96, 191)' }}
            >
              {/* <CardHeader
                avatar={<Avatar alt={props.userInfo.info.name} />}
                action={<Button>send</Button>}
                title={`${props.userInfo.info.name}`}
                subheader={`${props.userInfo.info.selfIntroduction}`}
              />

              <CardContent>
                <Typography gutterBottom variant='h6' component='div'>
                  Personality Status{' '}
                  <Tooltip title="This status is determined based on user's activity.">
                    <HelpIcon />
                  </Tooltip>
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  {renderPersonalStatus()}
                </Typography>
              </CardContent>

              <CardContent>
                <Typography gutterBottom variant='h6' component='div'>
                  Language Status{' '}
                  <Tooltip title='This chart shows what language and how much the user speaks.'>
                    <HelpIcon />
                  </Tooltip>
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  <LanguageChart user={props.userInfo.info} />
                </Typography>
              </CardContent> */}

              <UserInfoWrapper
                user={props.userInfo.info}
                worldMapSettings={props.worldMapSettings}
                setWorldMapSetting={props.setWorldMapSetting}
                visitedCountries={props.userInfo.info.visited}
              />

              {/* <BasicUserInfo user={props.userInfo.info} /> */}

              {/* <CardContent>
                <Typography gutterBottom variant='h6' component='div'>
                  Visited Country&nbsp;
                  {renderVisitedCountries()}
                  {howMuchCompleted(props.userInfo.info.visited.length)}
                  <VisitedMap
                    worldMapSettings={props.worldMapSettings}
                    setWorldMapSetting={props.setWorldMapSetting}
                    visitedCountries={props.userInfo.info.visited}
                  />
                </Typography>
              </CardContent> */}

              {/* <div
                className='visited-country'
                style={{ backgroundColor: 'white', padding: '10px', borderRadius: '5px' }}
              >
                <LanguageIcon />
                Visited Country&nbsp;
                {renderVisitedCountries()}
                {howMuchCompleted(props.userInfo.info.visited.length)}
                <VisitedMap
                  worldMapSettings={props.worldMapSettings}
                  setWorldMapSetting={props.setWorldMapSetting}
                  visitedCountries={props.userInfo.info.visited}
                />
              </div> */}

              <div className='call-button-wrapper' style={{ margin: 'auto' }}>
                <CallButton
                  socket={props.socket}
                  user={props.userInfo.info}
                  setOpenSwipeableDrawer={props.setOpenSwipeableDrawer}
                  setShowCallingModal={props.setShowCallingModal}
                />
              </div>
            </div>
          </>
        );
      } else {
        return null;
      }
    } else {
      return null;
    }
  };
  return <>{renderUserDetail()}</>;
};

export default UserDetail;
