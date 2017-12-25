// @flow

var pg = require('pg');

console.log('Connecting to DB: ', process.env.DATABASE_URL);

pg.connect(process.env.DATABASE_URL, function(err, client, done) {
  if (err) {
    done();
    console.log(err);
    return;
  }

  client.query('SELECT * FROM test_table', function(err, result) {
    done();
    if (err)
     { console.error(err); response.send("Error " + err); }
    else
     { response.render('pages/db', {results: result.rows} ); }
  });
});
