import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setHeroName } from '../actions/actions';
import { bindActionCreators } from 'redux';

import './App.css';

const App = ({ selectedHeroName, isFetching, setHeroName }) => {
  return (
    <div>
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
