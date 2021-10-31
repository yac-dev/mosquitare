import React from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import 'semantic-ui-css/semantic.min.css';

// redux setup
import { Provider } from 'react-redux';
import store from './store';

// components
import App from './App';

const rootElement = document.querySelector('#root');
Modal.setAppElement(rootElement);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  rootElement
);
