import { combineReducers } from 'redux';
import {
  SEARCH_KEY_DOWN,
  CLEAR_SEARCH_TIMEOUT,
  SET_SEARCH_TIMEOUT,
  HERO_SELECTED,
  ABILITY_SELECTED,
  RECEIVED_ALL_HEROES,
  FETCHING_ALL_HEROES,
  SELECT_ROLE
} from '../actions/actions';

const searchInfo = (state = {
  currentSearchTerm: '',
  searchTimeout: null
}, action) => {
  switch (action.type) {
    case SEARCH_KEY_DOWN:
      clearTimeout(state.searchTimeout);
      if (action.key === 'ESCAPE') {
        return {
          currentSearchTerm: '',
          searchTimeout: null
        };
      }

      if (action.key === 'ENTER') {
        return {
          currentSearchTerm: state.currentSearchTerm,
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

const selectedHero = (state = null, action) => {
  switch (action.type) {
    case HERO_SELECTED:
      return action.hero;
    default:
      return state;
  }
};

const selectedAbility = (state = null, action) => {
  switch (action.type) {
    case HERO_SELECTED:
        return action.hero.abilities[0].name;
    case ABILITY_SELECTED:
      return action.abilityName;
    default:
      return state;
  }
};

const isFetchingHeroes = (state = false, action) => {
  switch (action.type) {
    case FETCHING_ALL_HEROES:
      return true;
    case RECEIVED_ALL_HEROES:
      return false;
    default:
      return state;
  }
};

const heroes = (state = [], action) => {
  switch (action.type) {
    case RECEIVED_ALL_HEROES:
      return action.heroes.map(hero => {
        const heroJSON = JSON.parse(hero.hero_json);
        return Object.assign({},
          {
            id: hero.id,
            valveName: hero.hero_name,
            readableName: heroJSON.info.title,
            mainAttribute: hero.main_attribute,
            roles: hero.roles,
            attackType: hero.attack_type,
          },
          heroJSON,
        );
      });
    default:
      return state;
  }
}

const selectedRoles = (state = [], action) => {
  switch (action.type) {
    case SELECT_ROLE:
      const roleIndex = state.findIndex(role => role === action.role);
      if (roleIndex === -1) {
        return state.slice().concat([action.role]);
      }
      return [
        ...state.slice(0, roleIndex),
        ...state.slice(roleIndex + 1)
      ];
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  searchInfo,
  selectedHero,
  selectedAbility,
  heroes,
  isFetchingHeroes,
  selectedRoles
});

export default rootReducer;
