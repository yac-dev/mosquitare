import React from 'react';
import { Button, Card, Image } from 'semantic-ui-react';
import { connect } from 'react-redux';
// import '../../node_modules/language-icons/icons';

const ConfirmationCard = (props) => {
  const ButtonRender = () => {
    if (props.mediaState.amIRecieving) {
      return (
        <>
          <p>You got a language exchange. Say yes or no.</p>
          <div className='ui two buttons'>
            <Button
              positive
              onClick={() => props.callback(props.socket, props.myVideo, props.oppositeVideo, props.connectionRef)}
            >
              {' '}
              {/* ここ、argument沢山よ。 */}
              <i className='handshake icon'>Yes</i>
            </Button>
            <Button negative>
              {' '}
              <i className='x icon'>No</i>
            </Button>
          </div>
        </>
      );
    } else {
      return (
        <Button positive onClick={(event) => props.callback(event, props.socketId)} style={{ width: '100%' }}>
          <i className='video icon'>call</i>
          {/* <Link to='/chatscreen'>Call</Link> */}
        </Button>
      );
    }
  };

  return (
    <div>
      <Card>
        <Card.Content>
          <Card.Header className='card-header'>{props.user.name}</Card.Header>
          <div className='metas'>
            <Card.Meta>Speaks </Card.Meta>
            {props.user.nativeLangs.map((lang) => (
              <div className='languages'>
                {lang.name} &nbsp;
                <img className='language-img' src={`https://unpkg.com/language-icons/icons/${lang.code}.svg`} />
              </div>
            ))}
            <Card.Meta>Learns </Card.Meta>
            {props.user.learningLangs.map((lang) => (
              <div className='languages'>
                {lang.name} &nbsp;
                <img className='language-img' src={`https://unpkg.com/language-icons/icons/${lang.code}.svg`} />
              </div>
            ))}
            <Card.Meta>Nationalities </Card.Meta>
            {props.user.nationalities.map((nationality) => (
              <div className='countries'>
                {nationality.name} &nbsp;
                <img className='country-img' src={nationality.flagPic} />
              </div>
            ))}
          </div>
          <Card.Description>{props.user.description}</Card.Description>
        </Card.Content>
        <Card.Content extra>
          {/* <div className='ui two buttons'>
            <Button basic color='green'>
              Accept!!
            </Button>
            <Button basic color='red'>
              Decline...
            </Button>
          </div> */}
          {ButtonRender()}
        </Card.Content>
      </Card>
    </div>
  );
};

const mapStateToProps = (state) => {
  return { mediaState: state.mediaState };
};

export default connect(mapStateToProps)(ConfirmationCard);
