import React from 'react';
import VisitedMap from './VisitedMap';

import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';

// mui icons
import LanguageIcon from '@mui/icons-material/Language';

const UserInfoVisited = (props) => {
  const renderVisitedCountries = () => {
    const visitedCountriesList = props.user.visited.map((element) => {
      return (
        <>
          <Avatar alt='country' src={element.country.flagPics[0]} sx={{ width: 30, height: 30 }} />
        </>
      );
    });

    return (
      <>
        <Stack direction='row' spacing={1}>
          {visitedCountriesList}
        </Stack>
      </>
    );
  };

  const howMuchCompleted = () => {
    const percent = Math.floor((props.user.visited.length / 198) * 100);
    return (
      <>
        <span>Completed {percent}&#37;</span>&nbsp;
      </>
    );
  };

  return (
    <div className='user-info-visited' style={{ padding: '10px' }}>
      <h6 style={{ borderBottom: '1px solid rgb(217, 217, 217)', marginBottom: '20px' }}>
        <LanguageIcon />
        Visited History
      </h6>
      {renderVisitedCountries()}
      {/* {howMuchCompleted()} */}
      <VisitedMap visitedCountries={props.user.visited} />
    </div>
  );
};

export default UserInfoVisited;
