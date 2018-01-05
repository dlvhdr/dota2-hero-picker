import { combineReducers } from 'redux';
import {
  SEARCH_KEY_DOWN,
  CLEAR_SEARCH_TIMEOUT,
  SET_SEARCH_TIMEOUT
} from '../actions/actions';

const searchInfo = (state = {
  currentSearchTerm: '',
  searchTimeout: null
}, action) => {
  switch (action.type) {
    case SEARCH_KEY_DOWN:
      // console.log(`Search term: ${state.currentSearchTerm + action.key}`);
      clearTimeout(state.searchTimeout);
      if (action.key === 'ESCAPE') {
        return {
          currentSearchTerm: '',
          searchTimeout: null
        };
      }

      if (state.searchTimeout === null) {
        return {
          currentSearchTerm: action.key === 'BACKSPACE' ? '' : action.key,
          searchTimeout: null
        };
      }

      if (action.key === 'BACKSPACE') {
        return {
          currentSearchTerm: state.currentSearchTerm.substring(
            0,
            state.currentSearchTerm.length - 1
          ),
          searchTimeout: null
        };
      }

      return {
        currentSearchTerm: state.currentSearchTerm + action.key,
        searchTimeout: null
      };
    case CLEAR_SEARCH_TIMEOUT:
      return {
        currentSearchTerm: state.currentSearchTerm,
        searchTimeout: null,
      };
    case SET_SEARCH_TIMEOUT:
      return {
        currentSearchTerm: state.currentSearchTerm,
        searchTimeout: action.searchTimeout
      };
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  searchInfo,
});

export default rootReducer;
