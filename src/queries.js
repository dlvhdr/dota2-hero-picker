// @flow

var promise = require('bluebird');
var options = {
  promiseLib: promise
};

var pgp = require('pg-promise')(options);
const connectionString = /* process.env.DATABASE_URL || */
  'postgres://localhost:5432/dota2_hero_picker';
var db = pgp(connectionString);

const insertHero = (heroName, heroJSON) => {
  db.none(
      'INSERT INTO hero_test_table (hero_name, hero_json)' +
      "VALUES (${heroName}, ${heroJSON}) " +
      "ON CONFLICT (hero_name) DO UPDATE SET hero_json=excluded.hero_json",
      {heroName, heroJSON}
    )
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved ALL heroes'
        });
    })
    .catch(function (err) {
      return next(err);
    });
};

const getAllHeroes = () => {
  return db.any('SELECT * FROM heroes')
    .then(function (data) {
      return {
        status: 'success',
        data: data,
        message: 'Retrieved ALL heroes'
      };
    })
    .catch(function (err) {
      return {
        status: 'failure',
        data: err,
        message: 'Could not retrieve heroes'
      };
    });
};

const getHero = (heroName) => {
  return db.one('SELECT * FROM heroes WHERE hero_name = $1', [heroName])
    .then(function (data) {
      return {
        status: 'success',
        data: data,
        message: 'Retrieved ONE hero'
      };
    })
    .catch(function (err) {
      return {
        status: 'failure',
        data: err,
        message: 'Could not find hero ' + heroName
      };
    });
};

module.exports = {
  getAllHeroes: getAllHeroes,
  getHero: getHero
};
