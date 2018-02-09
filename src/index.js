import './index.css';
import {
  createStore,
  combineReduces,
  applyMiddleware,
  bindActionCreators,
  compose
} from 'redux';
import App from './components/App';
import { Provider } from 'react-redux';
import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import thunk from 'redux-thunk';
import reducers from './reducers/reducers';

const logger = store => next => action => {
  console.log('Dispatching', action)
  let result = next(action)
  console.log('Next state', store.getState())
  return result
}

const composeEnhancers =
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  reducers,
  composeEnhancers(applyMiddleware(thunk, logger))
);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
// registerServiceWorker();
