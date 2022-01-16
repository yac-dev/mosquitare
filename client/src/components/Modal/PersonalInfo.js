import React from 'react';
import { connect } from 'react-redux';
import '../../styles/1on1.css';

const PersonalInfo = (props) => {
  return (
    <div className='personal-info-wrapper' style={{ backgroundColor: 'white' }}>
      <div>{props.authState.currentUser.name}</div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return { authState: state.authState };
};

export default connect(mapStateToProps)(PersonalInfo);
