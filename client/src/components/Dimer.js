import React from 'react';
import { Dimmer, Loader, Image, Segment } from 'semantic-ui-react';

const Dimer = () => {
  return (
    <Segment>
      <Dimmer active>
        <Loader size='massive'>Please wait till your call accepted....</Loader>
      </Dimmer>
      <Image src='https://react.semantic-ui.com/images/wireframe/short-paragraph.png' />
      <Image src='https://react.semantic-ui.com/images/wireframe/short-paragraph.png' />
      <Image src='https://react.semantic-ui.com/images/wireframe/short-paragraph.png' />
    </Segment>
  );
};

export default Dimer;
