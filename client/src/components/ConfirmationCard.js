import React from 'react';
import { Button, Card } from 'semantic-ui-react';

const ConfirmationCard = () => {
  return (
    <div>
      <p>Do you accept this person??</p>
      <Card>
        <Card.Content>
          <Card.Header>Steve Sanders</Card.Header>
          <Card.Meta>Friends of Elliot</Card.Meta>
          <Card.Description>
            Steve wants to add you to the group <strong>best friends</strong>
          </Card.Description>
        </Card.Content>
        <Card.Content extra>
          <div className='ui two buttons'>
            <Button basic color='green'>
              Accept!!
            </Button>
            <Button basic color='red'>
              Decline...
            </Button>
          </div>
        </Card.Content>
      </Card>
    </div>
  );
};

export default ConfirmationCard;
