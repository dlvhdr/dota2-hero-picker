import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setHeroName } from '../actions/actions';
import { bindActionCreators } from 'redux';
import path from 'path';
import HeroPicker from './HeroPicker';
import './App.css';

import Abaddon from '../../mock_data/Abaddon';

const App = ({ selectedHeroName, isFetching, setHeroName }) => {
  return (
    <div>
      <HeroPicker />
      <div>
        <p>Mock data:</p>
        <p>Hero: {Abaddon.info.title}
          <img src={path.join(__dirname, '../public/images/', Abaddon.info.image)} />
        </p>
        <p>Hero abilities:
          {Abaddon.abilities.map(
            ability => {
              const { name, image } = ability;
              return (
                <div>
                  {name}:
                  <img src={path.join(__dirname, '../public/images/', image)} />
                </div>
              );
            })
          }</p>
      </div>
      <div>Select a hero
        <input
            type="text"
            value={selectedHeroName}
            onChange={(e) => setHeroName(e.target.value)}/>
        <button type="button">Click Me!</button>
      </div>
      <div>Current text: {selectedHeroName} </div>
      <div>
        {isFetching
          ? `Fetching ${selectedHeroName}...`
          : `Displaying ${selectedHeroName}`
        }
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  const { selectedHeroName, isFetching } = state;

  return {
    selectedHeroName,
    isFetching
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({setHeroName}, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
