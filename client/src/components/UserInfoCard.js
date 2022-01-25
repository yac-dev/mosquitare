import React from 'react';
import { connect } from 'react-redux';
import { Card, Table } from 'semantic-ui-react';
import '../styles/userInfoCard.css';

const UserInfoCard = (props) => {
  return (
    <div className='userinfo-card'>
      <div className='upper-card'>
        <div className='language-space'>
          {props.user.nativeLangs.map((lang) => (
            <div className='speaking-languages'>
              {lang.name} &nbsp;
              <img className='language-img' src={`https://unpkg.com/language-icons/icons/${lang.code}.svg`} />
            </div>
          ))}

          {props.user.learningLangs.map((lang) => (
            <div className='learning-languages'>
              {lang.name} &nbsp;
              <img className='language-img' src={`https://unpkg.com/language-icons/icons/${lang.code}.svg`} />
            </div>
          ))}
        </div>
        <div className='userinfo-space'>
          <div>Total Status</div>
          <div>{props.user.name}</div>
          <div>Job</div>
          {props.user.nationalities.map((nationality) => (
            <div className='countries'>
              {nationality.name} &nbsp;
              <img className='country-img' src={nationality.flagPic} />
            </div>
          ))}
        </div>
      </div>
      <div className='lower-card'>
        <div>Respectful</div>
        <div>Student</div>
        <div>Teacher</div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return { mediaState: state.mediaState };
};

export default connect(mapStateToProps)(UserInfoCard);
