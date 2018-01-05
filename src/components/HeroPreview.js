// @flow

import React from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import './HeroPreview.css';

const HeroPreview = ({ hero, currentSearchTerm, className }) => {
  const heroName = hero.heroName.replace(/\ /g, '_');
  const heroMatches = hero.heroName.toUpperCase().includes(currentSearchTerm);
  return (
    <img
      className={classNames(
        className,
        {
          MatchingHero: currentSearchTerm !== '' && heroMatches,
          NonMatchingHero: !heroMatches,
        }
      )}
      width={42}
      height={60}
      alt={heroName}
      title={heroName}
      src={'../public/images/' + heroName + '_vert_small.jpg'} />
  );
};

const mapStateToProps = (state) => {
  const { currentSearchTerm } = state.searchInfo;

  return {
    currentSearchTerm
  };
};

export default connect(mapStateToProps)(HeroPreview);
