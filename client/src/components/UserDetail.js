import React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

// components
import LanguageChart from './LanguageChart';

const UserDetail = (props) => {
  const renderPersonalStatus = () => {
    const statuses = props.user.personalStatus.map((status) => {
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
      if (props.user) {
        return (
          <div className='user-detail-wrapper' style={{ cursor: 'default' }}>
            <Card sx={{ width: 450, height: '85vh', position: 'absolute', right: '50px', bottom: '50px' }}>
              <CardHeader
                avatar={
                  // <Avatar sx={{ bgcolor: 'red' }} aria-label='recipe'>
                  //   R
                  // </Avatar>
                  <img src={`${props.user.photo}`} />
                }
                title={`${props.user.name}`}
                subheader={`${props.user.email}`}
              />
              <CardContent>
                <Typography gutterBottom variant='h5' component='div'>
                  Personal Status
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  {renderPersonalStatus()}
                </Typography>
              </CardContent>
              <CardContent>
                <Typography gutterBottom variant='h5' component='div'>
                  Language and Status
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  <LanguageChart user={props.user} />
                </Typography>
              </CardContent>
              <CardContent>
                <Typography gutterBottom variant='h5' component='div'>
                  Self-Introduction
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  {/* <LanguageChart user={props.user} /> */}
                  {props.user.selfIntroduction}
                </Typography>
              </CardContent>

              <CardActions>
                <Button size='small'>Share</Button>
                <Button size='small'>Learn More</Button>
              </CardActions>
            </Card>
          </div>
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
