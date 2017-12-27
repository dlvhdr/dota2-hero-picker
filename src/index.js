import './index.css';
import {
  createStore,
  combineReduces,
  applyMiddleware,
  bindActionCreators
} from 'redux';
import App from './components/App';
import { Provider } from 'react-redux';
import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import thunk from 'redux-thunk';
import reducers from './reducers/reducers';

const store = createStore(
  reducers,
  applyMiddleware(thunk)
);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
// registerServiceWorker();
