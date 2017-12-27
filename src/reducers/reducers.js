import { combineReducers } from 'redux';
import {
  SET_HERO_NAME
} from '../actions/actions';

const selectedHeroName = (state = '', action) => {
  switch (action.type) {
    case SET_HERO_NAME:
      return action.heroName;
    default:
      return state;
  }
};


const rootReducer = combineReducers({
  selectedHeroName,
});

export default rootReducer;
