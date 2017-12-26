// @flow

const express = require('express');
const pg = require('pg');
var db = require('./queries');

const app = express();

app.listen(3000, function () {
  console.log("Express has started on port 3000");
});

app.use(express.static('public'));
app.get('/heroes', (req, res) => {
  db.getAllHeroes()
    .then(dbResult => res.status(200).send(dbResult))
    .catch(dbResult => res.status(500).send(dbResult));
});
app.get('/hero/:heroName', (req, res) => {
  db.getHero(req.params.heroName)
    .then(dbResult => res.status(200).send(dbResult))
    .catch(dbResult => res.status(500).send(dbResult));
});

console.log('server set up!');
