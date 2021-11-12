import React from 'react';
import { connect } from 'react-redux';
import { Table, Button } from 'semantic-ui-react';
import '../../styles/meeting.css';

const MeetingsList = (props) => {
  const meetingsList = props.meetingsState.map((meeting) => {
    return (
      <Table celled key={meeting._id}>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Meeting Title</Table.HeaderCell>
            <Table.HeaderCell>Exchanging</Table.HeaderCell>
            <Table.HeaderCell>Member</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell>{meeting.title}</Table.Cell>
            <Table.Cell>
              {meeting.language1} and {meeting.language2}
            </Table.Cell>
            <Table.Cell style={{ color: 'green' }}>
              {meeting.members.length}/8 <Button>Join!</Button>
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    );
  });

  return <div className='meetings-list'>{meetingsList}</div>;
};

const mapStateToProps = (state) => {
  return { meetingsState: Object.values(state.meetingsState) };
};

export default connect(mapStateToProps)(MeetingsList);
