import React from 'react';
import { connect } from 'react-redux';
import { Table } from 'semantic-ui-react';
import '../../styles/meeting.css';

const MeetingsList = (props) => {
  const meetingsList = props.meetingsState.map((meeting) => {
    return (
      <Table celled>
        <Table.Body>
          <Table.Row>
            <Table.Cell style={{ color: 'green' }}>Available</Table.Cell>
            <Table.Cell>{meeting.title}</Table.Cell>
            <Table.Cell>{meeting.language1}</Table.Cell>
            <Table.Cell>{meeting.language2}</Table.Cell>
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
