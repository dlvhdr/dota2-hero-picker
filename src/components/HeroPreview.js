// @flow

import React from 'react';

const HeroPreview = ({ heroName }) => {
  return (
    <img
      width={60}
      height={87}
      alt={heroName}
      title={heroName}
      src={'../public/images/' + heroName + '_vert_small.jpg'} />
  );
};

export default HeroPreview;
