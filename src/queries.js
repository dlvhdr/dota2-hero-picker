// @flow

var promise = require('bluebird');
var options = {
  promiseLib: promise
};

var pgp = require('pg-promise')(options);
const connectionString =
  process.env.DATABASE_URL || 'postgres://localhost:5432/dota2_hero_picker';
var db = pgp(connectionString);

const insertHero = (heroName, primaryAttribute, roles, attackType, heroJSON) => {
  console.log('Inserting ' + heroName + ' (' + heroJSON.info.title + ') to DB');
  db.none(
      'INSERT INTO heroes (hero_name, main_attribute, roles, attack_type, hero_json)' +
      "VALUES (${heroName}, ${primaryAttribute}, ${roles}, ${attackType}, ${heroJSON}) " +
      "ON CONFLICT (hero_name) DO UPDATE SET hero_json=excluded.hero_json",
      {heroName, primaryAttribute, roles, attackType, heroJSON}
    )
    .then(data => ({
        status: 'success',
        data: data,
        message: 'Inserted ONE hero'
    }))
    .catch(err => {
      console.log(err);
      return {
        status: 'failure',
        data: err,
        message: 'Failed to insert hero'
      }
    });
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

const getAllHeroNames = () => {
  return db.any('SELECT hero_name FROM heroes')
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

const getAllHeroesBasicInfo = () => {
  return db.any('SELECT hero_name, main_attribute, roles, attack_type FROM heroes')
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
  getAllHeroNames: getAllHeroNames,
  getAllHeroesBasicInfo: getAllHeroesBasicInfo,
  getHero: getHero,
  insertHero: insertHero
};
