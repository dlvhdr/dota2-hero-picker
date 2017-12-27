// @flow

const db = require('./queries');
const express = require('express')
const path = require('path')
const pg = require('pg');

module.exports = {
  app: () => {
    const app = express();

    const indexPath = path.join(__dirname, '/../index.html')
    const publicPath = express.static(path.join(__dirname, '../public'));

    app.get('/', (_, res) => res.sendFile(indexPath));
    app.use('/public', publicPath);

    app.get('/heroes', (req, res) => {
      console.log("Request received for heroes");
      db.getAllHeroes()
        .then(dbResult => res.status(200).send(dbResult))
        .catch(dbResult => res.status(500).send(dbResult));
    });
    app.get('/hero/:heroName', (req, res) => {
      console.log("Request received for hero " + req.params.heroName);
      db.getHero(req.params.heroName)
        .then(dbResult => res.status(200).send(dbResult))
        .catch(dbResult => res.status(500).send(dbResult));
    });

    return app;
  }
};
