import React, { useEffect } from 'react';
import { Router, Route } from 'react-router-dom';
import history from './history';

// components
import LandingPage from './components/LandingPage';
import Navbar from './components/Navbar';
import SignupBasic from './components/Signup/SignupBasic';
import SignupDetails from './components/Signup/SignupDetails';
import Socket from './components/Socket';
import WorldMap from './components/WorldMap';

import './App.css';

const App = () => {
  // useEffect(() => {
  //   const jwt = localStorage.getItem('mosquitare token');
  //   if (jwt) {
  //   }
  // }, []);

  return (
    <div>
      <Router history={history}>
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
};

export default App;
