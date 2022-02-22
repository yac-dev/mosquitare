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

// mui for options
import { styled, alpha } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

// components
import LanguageChart from './LanguageChart';
import CallButton from './CallButton';

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
  const renderUserDetail = () => {
    if (props.isUserIconClicked) {
      if (props.userInfo.info) {
        return (
          <>
            <Card
            // sx={{ width: 450, height: '85vh', position: 'absolute', right: '50px', bottom: '50px' }}
            >
              <CardHeader
                avatar={
                  // <Avatar sx={{ bgcolor: 'red' }} aria-label='recipe'>
                  //   R
                  // </Avatar>
                  <img src={`${props.userInfo.info.photo}`} />
                }
                title={`${props.userInfo.info.name}`}
                subheader={`${props.userInfo.info.email}`}
              />
              <CardContent>
                <Typography gutterBottom variant='h5' component='div'>
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
                <Typography gutterBottom variant='h5' component='div'>
                  Language Status{' '}
                  <Tooltip title='This chart shows what language and how much the user speaks.'>
                    <HelpIcon />
                  </Tooltip>
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  <LanguageChart user={props.userInfo.info} />
                </Typography>
              </CardContent>
              <CardContent>
                <Typography gutterBottom variant='h5' component='div'>
                  Self-Introduction
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  {/* <LanguageChart user={props.user} /> */}
                  {props.userInfo.info.selfIntroduction}
                </Typography>
              </CardContent>

              <CardActions>
                <CallButton
                  socket={props.socket}
                  user={props.userInfo.info}
                  setOpenSwipeableDrawer={props.setOpenSwipeableDrawer}
                  setShowCallingModal={props.setShowCallingModal}
                />
                {/* <Button size='small'>Share</Button> */}
                {/* <Button size='small'>Learn More</Button> */}
                {/* <div>
                  <Button
                    id='demo-customized-button'
                    aria-controls={open ? 'demo-customized-menu' : undefined}
                    aria-haspopup='true'
                    aria-expanded={open ? 'true' : undefined}
                    variant='contained'
                    disableElevation
                    onClick={handleClick}
                    endIcon={<KeyboardArrowDownIcon />}
                  >
                    Exchange
                  </Button>
                  <StyledMenu
                    id='demo-customized-menu'
                    MenuListProps={{
                      'aria-labelledby': 'demo-customized-button',
                    }}
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                  >
                    <MenuItem onClick={handleClose} disableRipple>
                      Edit
                    </MenuItem>
                    <MenuItem onClick={handleClose} disableRipple>
                      Duplicate
                    </MenuItem>
                    <MenuItem onClick={handleClose} disableRipple>
                      Archive
                    </MenuItem>
                    <MenuItem onClick={handleClose} disableRipple>
                      More
                    </MenuItem>
                  </StyledMenu>
                </div> */}
              </CardActions>
            </Card>
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
