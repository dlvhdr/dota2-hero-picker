DROP DATABASE IF EXISTS dota2_hero_picker;
CREATE DATABASE dota2_hero_picker;

\c dota2_hero_picker;

CREATE TABLE heroes (
  ID SERIAL PRIMARY KEY,
  hero_name varchar(100) UNIQUE,
  hero_json text
);

INSERT INTO heroes (hero_name, hero_json)
  VALUES ('Dolev', '{ "ability1": "wowzah" }');
