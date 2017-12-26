// @flow

var pg = require('pg');
var fs = require('fs');

// Connecting locally:
console.log('Connecting to DB: ', 'postgres://localhost:5432/dota2_hero_picker');

const createTableIfNeccessary = () => {
  pg.connect('postgres://localhost:5432/dota2_hero_picker',
    function(err, client, done) {
      if (err) {
        done();
        console.log(err);
        return;
      }
      client.query(
        "CREATE TABLE IF NOT EXISTS hero_test_table (" +
        "hero_name VARCHAR(100) UNIQUE," +
        "hero_json text" +
        ")"
      ).then(res => console.log(res))
        .catch(e => console.error(e));
    }
  );
}

const testInsert = () => {
  pg.connect('postgres://localhost:5432/dota2_hero_picker',
    function(err, client, done) {
      if (err) {
        done();
        console.log(err);
        return;
      }
      client.query(
        "INSERT INTO hero_test_table (name, json) " +
        "VALUES ($1, $2) ON CONFLICT name " +
        "DO UPDATE SET json EXCLUDED.json",
        ['dolev', '{}']
      );
      done();
    }
  );
}

testInsert();


// createTableIfNeccessary();

// fs.readFile('heroes/Abaddon.txt', 'utf8', (err, data) => {
//   // let abaddon = JSON.parse(data);
//   // pg.connect('postgres://localhost:5432/dota2_hero_picker', function(err, client, done) {
//   //   if (err) {
//   //     done();
//   //     console.log(err);
//   //     return;
//   //   }
//
//     // console.log("'" + JSON.stringify(abaddon) + "'");
//     // console.log("INSERT INTO hero_test_table values (" +
//     // "\'" + 'test' + "\'" +
//     // ", " +
//     // "\'{ \"wow\": \"yalla\"}\')");
//
//     // console.log("INSERT INTO hero_test_table values (" +
//     // "\'" + abaddon.info.title + "\'" +
//     // ", " +
//     // "\'" + JSON.stringify(abaddon, null, '\t').replace('\'', '\'\'') + "\')");
//
//     // console.log(JSON.parse(JSON.stringify(abaddon)));
//
//
//     // client.query(
//     //   "INSERT INTO hero_test_table VALUES ($1, $2)",
//     //   [abaddon.info.title, JSON.stringify(abaddon).replace('\'', '\'\'')]
//     // ).then(res => console.log(res))
//     //   .catch(e => console.error(e));
//
//
//
//   //   console.log('selecting...');
//   //   client.query("SELECT * from hero_test_table")
//   //     .then(res => JSON.parse(res.rows[0].hero_json))
//   //     .then(hero => { console.log(hero.abilities[0].name); done(); })
//   //     .catch(console.log);
//   // });
// });
