import React, { Component } from 'react';
import { connect } from 'react-redux';
import { keyDownUpdateSearchTerm, fetchAllHeroes } from '../actions/actions';
import { bindActionCreators } from 'redux';
import path from 'path';
import HeroPicker from './HeroPicker';
import classNames from 'classnames';
import SelectedHero from './SelectedHero';
import './App.css';

import Abaddon from '../../mock_data/Abaddon';

class App extends React.Component {

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.props.fetchAllHeroes();
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyPress.bind(this));
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyPress.bind(this));
  }

  handleKeyPress(e) {
    if (e.key === ' ') {
      e.preventDefault();
    }
    if (e.key.match(/^([a-zA-Z ]|Backspace|Escape|Enter)$/g)) {
      this.props.keyDownUpdateSearchTerm(e.key.toUpperCase());
    }
  }

  render() {
    const {
      currentSearchTerm,
      searchTimeout,
      keyDownUpdateSearchTerm,
      isFetchingHeroes
    } = this.props;

    if (isFetchingHeroes) {
      return <div className="App">
        Fetching heroes...
      </div>;
    }

    return (
      <div className="App">
        <div className="Search">
          {
            searchTimeout !== null
              ? <div className={classNames({
                    SearchTerm: true,
                    Fade: searchTimeout !== null
                  })}>{currentSearchTerm}
                </div>
              : null
          }
          <div className="HeroPickerAndSelectedHeroContainer">
            <HeroPicker />
            <SelectedHero />
          </div>
        </div>
        <div className="Mock">
          <p>Mock data:</p>
          <p>Hero: {Abaddon.info.title}
            <img src={path.join(__dirname, '../public/images/', Abaddon.info.image)} />
          </p>
          <div>Hero abilities:
            {Abaddon.abilities.map(
              ability => {
                const { name, image } = ability;
                return (
                  <div key={`ability_${name}`}>
                    {name}:
                    <img src={path.join(__dirname, '../public/images/', image)} />
                  </div>
                );
              })
            }
          </div>
          <div>Select a hero
            <input
                type="text"
                value={currentSearchTerm}
                onChange={(e) => keyDownUpdateSearchTerm(e.target.value)}/>
            <button type="button">Click Me!</button>
          </div>
          <div>Current text: {currentSearchTerm} </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { currentSearchTerm, searchTimeout } = state.searchInfo;
  const { isFetchingHeroes } = state;

  return {
    currentSearchTerm,
    searchTimeout,
    isFetchingHeroes
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    keyDownUpdateSearchTerm,
    fetchAllHeroes
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
