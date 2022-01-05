import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { loadMeActionCreator } from '../../actionCreators/authActionCreators';
import { Link } from 'react-router-dom';

const ConversationVideos = (props) => {
  useEffect(() => {
    const jwtToken = localStorage.getItem('mosquitare token');
    if (jwtToken) {
      props.loadMeActionCreator(jwtToken);
    }
  }, []); // このuserのviodeを全部s3から持ってくる。

  const test = () => {
    if (!props.authState.currentUser) {
      return null;
    } else {
      const conversationList = props.authState.currentUser.conversations.map((conversation) => {
        return (
          <Link to={`/uservideo/${props.authState.currentUser._id}/${conversation._id}`}>{conversation.createdAt}</Link>
        );
      });
      return <div>{conversationList}</div>;
    }
  };

  return (
    <div>
      <div>Conversations list here</div>
      {test()}
    </div>
  );
};

const mapStateToProps = (state, ownProps) => {
  return { authState: state.authState };
};

export default connect(mapStateToProps, { loadMeActionCreator })(ConversationVideos);
