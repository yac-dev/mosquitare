import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

// components
import Signup from './components/Signup';

class App extends React.Component {
  render() {
    return (
      <div className='ui container'>
        <Router>
          <Route to='/signup'>
            <Signup />
          </Route>
        </Router>
      </div>
    );
  }
}

export default App;
