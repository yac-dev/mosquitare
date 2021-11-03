import React, { useEffect } from 'react';
import { Router, Route } from 'react-router-dom';
import history from './history';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

// components
import LandingPage from './components/LandingPage';
import Navbar from './components/Navbar';
import Login from './components/Login';
import SignupBasic from './components/Signup/SignupBasic';
import SignupDetails from './components/Signup/SignupDetails';
import Socket from './components/Socket';
import WorldMap from './components/WorldMap';
import ChatScreen from './components/ChatScreen';

import store from './store';
import { socket } from './components/WorldMap';
import { loadMeAndUpdateActionCreator } from './actionCreators/authActionCreators';
import { loadPositionActionCreator } from './actionCreators/authActionCreators';
import { getMediaActionCreator, getSocketIdActionCreator } from './actionCreators/mediaActionCreator';
import { getUsersActionCreator } from './actionCreators/usersActionCreator';

import { ADD_USER_GLOBALLY } from './actionCreators/type';

const App = () => {
  // useEffect(() => {
  //   const jwtToken = localStorage.getItem('mosquitare token');
  //   if (jwtToken) {
  //     store.dispatch(getSocketIdActionCreator()); //1
  //     if (store.getState().authState.socketId) {
  //       store.dispatch(loadMeAndUpdateActionCreator(jwtToken));
  //     }
  //     // store.dispatch(loadMeActionCreator(jwtToken)); //2
  //     // store.dispatch(getMediaActionCreator());
  //     // store.dispatch(loadPositionActionCreator()); // 3
  //     // store.dispatch(getUsersActionCreator());
  //     // const { authState } = store.getState();
  //     // console.log('huiauhvugau');
  //     // store.dispatch({
  //     //   type: ADD_USER_GLOBALLY,
  //     //   payload: authState,
  //     // });
  //   }
  // }, []);

  // useEffect(() => {
  //   store.dispatch(loadPositionActionCreator());
  // }, []);

  // useEffect(() => {
  //   store.dispatch(getSocketIdActionCreator(socket));
  // }, []);

  // useEffect(() => {
  //   store.dispatch(getUsersActionCreator());
  // }, []);

  // useEffect(() => {
  //   const { authState } = store.getState();
  //   console.log('huiauhvugau');
  //   store.dispatch({
  //     type: ADD_USER_GLOBALLY,
  //     payload: authState,
  //   });
  // }, []);

  return (
    <div>
      <Router history={history}>
        <Navbar />
        <Route path='/' exact component={LandingPage} />
        <Route path='/signup/basic' exact component={SignupBasic} />
        <Route path='/signup/details' exact component={SignupDetails} />
        <Route path='/login' exact component={Login} />
        <Route path='/socket' exact component={Socket} />
        <Route path='/worldmap' exact component={WorldMap} />
        <Route path='/chatscreen' exact component={ChatScreen} />
        {/* uber っぽくしたいなら、worldMapをself closingするのではなく、childrenを使うといいかもな 多分*/}
      </Router>
    </div>
  );
};

export default App;
