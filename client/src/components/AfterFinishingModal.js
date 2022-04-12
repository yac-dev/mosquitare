import React from 'react';
import { Dimmer, Loader, Image, Segment } from 'semantic-ui-react';
import { Modal } from 'react-bootstrap';

const AfterFinishingModal = (props) => {
  return (
    <Modal
      show={props.showAfterFinishingModal}
      onHide={() => props.setShowAfterFinishingModal(false)}
      backdrop='static'
      keyboard={false}
    >
      <Modal.Body>
        <Segment>
          <Dimmer active>
            <Loader size='medium'>Please wait for a while until the processing is completed.</Loader>
          </Dimmer>
          <Image src='https://react.semantic-ui.com/images/wireframe/short-paragraph.png' />
        </Segment>
      </Modal.Body>
    </Modal>
  );
};

export default AfterFinishingModal;
