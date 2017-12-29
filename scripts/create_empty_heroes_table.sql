DROP DATABASE IF EXISTS dota2_hero_picker;
CREATE DATABASE dota2_hero_picker;

\c dota2_hero_picker;

CREATE TABLE heroes (
  ID SERIAL PRIMARY KEY,
  hero_name VARCHAR(100) UNIQUE,
  main_attribute VARCHAR(50),
  roles text[],
  attack_type VARCHAR(50),
  hero_json text
);
