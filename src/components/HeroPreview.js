// @flow

import React from 'react';

const HeroPreview = ({ hero, className }) => {
  const heroName = hero.heroName.replace(/\ /g, '_');
  return (
    <img
      className={className}
      width={42}
      height={60}
      alt={heroName}
      title={heroName}
      src={'../public/images/' + heroName + '_vert_small.jpg'} />
  );
};

export default HeroPreview;
