import React from 'react';
import { io } from 'socket.io-client';

class Socket extends React.Component {
  render() {
    const socket = io('http://localhost:3500');
    socket.on('connect', (m) => {
      console.log(m);
    });
    return (
      <div>
        <div>Socket page</div>
      </div>
    );
  }
}

export default Socket;
