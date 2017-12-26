// @flow

var promise = require('bluebird');
var options = {
  promiseLib: promise
};

var pgp = require('pg-promise')(options);
const connectionString =
  process.env.DATABASE_URL || 'postgres://localhost:5432/dota2_hero_picker';
var db = pgp(connectionString);

const insertHero = (heroName, heroJSON) => {
  db.none(
      'INSERT INTO hero_test_table (hero_name, hero_json)' +
      "VALUES (${heroName}, ${heroJSON}) " +
      "ON CONFLICT (hero_name) DO UPDATE SET hero_json=excluded.hero_json",
      {heroName, heroJSON}
    )
    .then(data => ({
        status: 'success',
        data: data,
        message: 'Inserted ONE hero'
    }))
    .catch(err => ({
      status: 'failure',
      data: err,
      message: 'Failed to insert hero'
    }));
};

const getAllHeroes = () => {
  return db.any('SELECT * FROM heroes')
    .then(data => ({
      status: 'success',
      data: data,
      message: 'Retrieved ALL heroes'
    }))
    .catch(err => ({
      status: 'failure',
      data: err,
      message: 'Could not retrieve heroes'
    }));
};

const getHero = (heroName) => {
  return db.one('SELECT * FROM heroes WHERE hero_name = $1', [heroName])
    .then(data => ({
      status: 'success',
      data: data,
      message: 'Retrieved ONE hero'
    }))
    .catch(err => ({
      status: 'failure',
      data: err,
      message: 'Could not find hero ' + heroName
    }));
};

module.exports = {
  getAllHeroes: getAllHeroes,
  getHero: getHero,
  insertHero: insertHero
};
