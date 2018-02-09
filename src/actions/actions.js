const axios = require('axios');

export const SEARCH_KEY_DOWN = 'SEARCH_KEY_DOWN';
export const CLEAR_SEARCH_TIMEOUT = 'CLEAR_SEARCH_TIMEOUT';
export const RECEIVE_HERO = 'RECEIVE_HERO';
export const SET_SEARCH_TIMEOUT = 'SET_SEARCH_TIMEOUT';
export const HERO_SELECTED = 'HERO_SELECTED';
export const ABILITY_SELECTED = 'ABILITY_SELECTED';
export const RECEIVED_ALL_HEROES = 'RECEIVED_ALL_HEROES';
export const FETCHING_ALL_HEROES = 'FETCHING_ALL_HEROES';
export const SELECT_ROLE= 'SELECT_ROLE';

export const keyDownUpdateSearchTerm = key => (dispatch, getState) => {
  const { heroes, searchInfo } = getState();
  if (key === 'ENTER' && searchInfo.currentSearchTerm.length !== 0) {
    dispatch({
      type: HERO_SELECTED,
      hero:
        heroes.find(hero => hero.readableName.toLowerCase() ===
          searchInfo.currentSearchTerm.toLowerCase()
        ) ||
        heroes.find(hero =>
          hero.readableName.toLowerCase().includes(
            searchInfo.currentSearchTerm.toLowerCase()
          )
        )
    });
  }

  dispatch({
    type: SEARCH_KEY_DOWN,
    key,
  });
  dispatch({
    type: SET_SEARCH_TIMEOUT,
    searchTimeout: setTimeout(() => dispatch(clearTimeout()), 1500)
  })
};

export const clearTimeout = () => ({
  type: CLEAR_SEARCH_TIMEOUT,
});

export const heroSelected = (hero) => {
  return {
    type: HERO_SELECTED,
    hero
  };
};

export const abilitySelected = (abilityName) => {
  return {
    type: ABILITY_SELECTED,
    abilityName
  };
};

export const fetchAllHeroes = () => dispatch => {
  dispatch({
    type: FETCHING_ALL_HEROES
  });
  axios.get('/heroes', { responseType: 'json' })
    .then(response => response.data)
    .then(serverResponse => dispatch(receivedAllHeroes(serverResponse.data)));
};

export const receivedAllHeroes = heroes => {
  return {
    type: RECEIVED_ALL_HEROES,
    heroes
  };
};

export const selectRole = role => {
  return {
    type: SELECT_ROLE,
    role
  };
};

export const fetchHero = heroName => dispatch => {
  return axios.get(`/hero/${heroName}`, { responseType: 'json' })
    .then(response => response.data)
    .then(hero => dispatch(receiveHero(heroName, hero)));
};
