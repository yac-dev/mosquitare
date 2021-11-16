import React from 'react';
import { connect } from 'react-redux';
import { Table, Button } from 'semantic-ui-react';

// socket event
import { JOIN_MEETING } from '../../actionCreators/socketEvents';
import '../../styles/meeting.css';

// action creators
import { joinMeetingActionCreator } from '../../actionCreators/meetingActionCreator';

const MeetingsList = (props) => {
  const onButtonClick = (meeting) => {
    // socket.emit(JOIN_MEETING, roomName);
    console.log(meeting);
    props.joinMeetingActionCreator(meeting); // ここでは特に、actionの順番を気にする必要はない。この後に、modalを開かない解けないね。
    props.onJoinClick(meeting); //ここでmeetingをargumentで入れればいい訳ですよ。
  };

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
              {meeting.members.length}/8 <Button onClick={() => onButtonClick(meeting)}>Join!</Button>
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

export default connect(mapStateToProps, { joinMeetingActionCreator })(MeetingsList);
