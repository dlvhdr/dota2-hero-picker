const axios = require('axios');

export const SET_HERO_NAME = 'SET_HERO_NAME';
export const RECEIVE_HERO = 'RECEIVE_HERO';

export const setHeroName = heroName => ({
  type: SET_HERO_NAME,
  heroName
});

export const fetchHero = heroName => dispatch => {
  return axios.get(`/hero/${heroName}`, { responseType: 'json' })
    .then(response => response.data)
    .then(hero => dispatch(receiveHero(heroName, hero)));
};
