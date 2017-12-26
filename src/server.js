// @flow

const express = require('express');
const path = require('path');
const pg = require('pg');
var db = require('./queries');

const app = express();

app.use(express.static(path.join(__dirname, '../build')));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

// app.use(express.static('public'));
app.get('/heroes', (req, res) => {
  console.log("request received for heroes");
  db.getAllHeroes()
    .then(dbResult => res.status(200).send(dbResult))
    .catch(dbResult => res.status(500).send(dbResult));
});
app.get('/hero/:heroName', (req, res) => {
  db.getHero(req.params.heroName)
    .then(dbResult => res.status(200).send(dbResult))
    .catch(dbResult => res.status(500).send(dbResult));
});

app.listen(9000);
console.log('server set up!');
