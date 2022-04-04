import React, { useState } from 'react';
import { connect } from 'react-redux';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';

// components
import UserInfoWrapper from './UserInfoWrapper';

// css
import '../styles/partnerUserInfo.css';

const PartnerUserInfo = (props) => {
  const [deltaPosition, setDeltaPosition] = useState({ x: 0, y: 0 });

  const handleDrag = (e, ui) => {
    const { x, y } = deltaPosition;
    setDeltaPosition({ ...deltaPosition, x: x + ui.deltaX, y: y + ui.deltaY });
  };

  return (
    <Draggable onDrag={handleDrag} cancel='.partner-user-info-close-button, .user-info-wrapper'>
      <div className={`partner-user-info-component ${props.openPartnerUserInfo ? undefined : 'hidden'}`}>
        <div className='partner-user-info-header'>
          <p>Partner Infomation</p>
          <div className='partner-user-info-close-button' onClick={() => props.setOpenPartnerUserInfo(false)}>
            <i className='fa fa-close' style={{ fontSize: '12px', color: 'white' }}></i>
          </div>
        </div>
        <UserInfoWrapper user={props.mediaState.callingWith} />
      </div>
    </Draggable>
  );
};

const mapStateToProps = (state) => {
  return { mediaState: state.mediaState };
};

export default connect(mapStateToProps, {})(PartnerUserInfo);
