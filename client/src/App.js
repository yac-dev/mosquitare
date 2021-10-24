import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

// components
import LandingPage from './components/LandingPage';
import Navbar from './components/Navbar';
import SignupBasic from './components/Signup/SignupBasic';
import SignupDetails from './components/Signup/SignupDetails';
import Socket from './components/Socket';
import WorldMap from './components/WorldMap';

import './App.css';

class App extends React.Component {
  render() {
    return (
      <div>
        <Router>
          <Navbar />
          <Route path='/' exact component={LandingPage} />
          <Route path='/signup/basic' exact component={SignupBasic} />
          <Route path='/signup/details' exact component={SignupDetails} />
          <Route path='/socket' exact component={Socket} />
          <Route path='/worldmap' exact component={WorldMap} />
          {/* uber っぽくしたいなら、worldMapをself closingするのではなく、childrenを使うといいかもな 多分*/}
        </Router>
      </div>
    );
  }
}

export default App;
