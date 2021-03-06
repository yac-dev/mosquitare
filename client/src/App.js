import React from 'react';
import { Router, Route } from 'react-router-dom';
import history from './history';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

// components
import LandingPage from './components/LandingPage';
import About from './components/About';
import Navbar from './components/Navbar';
import Login from './components/Login';
import SignupBasic from './components/Signup/SignupBasic';
import SignupDetails from './components/Signup/SignupDetails';
import WorldMap from './components/WorldMap';
import ChatScreen from './components/ChatScreen';
import UserPageWrapper from './components/UserPage/UserPageWrapper';
// import ConversationVideo from './components/UserPage/ConversationVideo';
import Review from './components/ReviewForm';
import AllConversationsWrapper from './components/AllConversationsWrapper';
import DisplayingConversation from './components/DisplayingConversation';
import DevelopersInfo from './components/DevelopersInfo';
// import MapEg from './MapEg';

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
        <Route path='/' exact component={WorldMap} />
        <Route path='/signup/basic' exact component={SignupBasic} />
        <Route path='/signup/details' exact component={SignupDetails} />
        <Route path='/login' exact component={Login} />
        {/* <Route path='/socket' exact component={Socket} /> */}
        {/* <Route path='/worldmap' exact component={WorldMap} /> */}
        {/* <Route path='/chatscreen' exact component={ChatScreen} /> */}
        <Route path='/about' exact component={About} />
        <Route path='/userpage/:id' exact component={UserPageWrapper} />
        <Route path='/review' exact component={Review} />
        <Route path='/allvideos' exact component={AllConversationsWrapper} />
        <Route path='/myconversation/:user0Id/:user1Id/:conversationId' exact component={DisplayingConversation} />
        <Route path='/developersinfo' exact component={DevelopersInfo} />
        {/* <Route path='/uservideo/:userid/:conversationid' exact component={ConversationVideo} /> */}
      </Router>
    </div>
  );
};

export default App;
