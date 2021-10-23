import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

// components
import LandingPage from './components/LandingPage';
import Signup from './components/Signup';
import Socket from './components/Socket';
import WorldMap from './components/WorldMap';

class App extends React.Component {
  render() {
    return (
      <div className='ui container'>
        <Router>
          <Route path='/' exact component={LandingPage} />
          <Route path='/signup' exact component={Signup} />
          <Route path='/socket' exact component={Socket} />
          <Route path='/worldmap' exact component={WorldMap} />
        </Router>
      </div>
    );
  }
}

export default App;
