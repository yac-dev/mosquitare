import React from 'react';
import VisitedMap from './VisitedMap';

// mui icons
import LanguageIcon from '@mui/icons-material/Language';

const UserInfoVisited = (props) => {
  const renderVisitedCountries = () => {
    const visitedCountriesList = props.user.visited.map((country) => {
      return (
        <>
          <img src={country.flagPics[0]} style={{ width: '16px', height: '10px' }} />
          &nbsp;
        </>
      );
    });

    return <>{visitedCountriesList}</>;
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
    <div className='user-info-visited'>
      <h6 style={{ borderBottom: '1px solid black' }}>
        <LanguageIcon />
        Visited
      </h6>
      {renderVisitedCountries()}
      {howMuchCompleted()}
      <VisitedMap visitedCountries={props.user.visited} />
    </div>
  );
};

export default UserInfoVisited;
