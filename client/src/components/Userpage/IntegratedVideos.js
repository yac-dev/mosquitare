import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import { loadMeActionCreator } from '../../actionCreators/authActionCreators';

const IntegratedVideos = (props) => {
  useEffect(() => {
    const jwtToken = localStorage.getItem('mosquitare token');
    if (jwtToken) {
      props.loadMeActionCreator(jwtToken);
    }
  }, []); // このuserのviodeを全部s3から持ってくる。

  // integratedのvideoを組み合わせて再生できるようにする。まず。s3から取ってくるapiを作らないといけないな。
  const test = () => {
    if (props.authState.currentUser) {
      return <div>{props.authState.currentUser.name}</div>;
    } else {
      return null;
    }
  };

  return (
    <div>
      <div>Integrated Videos here</div>
      {test()}
    </div>
  );
};

const mapStateToProps = (state) => {
  return { authState: state.authState };
};

export default connect(mapStateToProps, { loadMeActionCreator })(IntegratedVideos);
