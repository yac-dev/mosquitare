import React from 'react';
import { Dimmer, Loader, Image, Segment } from 'semantic-ui-react';
import '../styles/callingModal.css';

const Dimer = () => {
  return (
    <div className='a'>
      <Segment>
        <Dimmer active>
          <Loader size='medium'>Please wait till your call accepted....</Loader>
        </Dimmer>
        <Image src='https://react.semantic-ui.com/images/wireframe/short-paragraph.png' />
        <Image src='https://react.semantic-ui.com/images/wireframe/short-paragraph.png' />
      </Segment>
    </div>
  );
};

export default Dimer;
