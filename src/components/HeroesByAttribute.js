// @flow

import React from 'react';

const HeroesByAttribute = ({ attributeName, heroesList }) => {
  return (
    <div>
      <span>{attributeName}:     </span>
      {heroesList.map(heroName =>
        <HeroPreview key={heroName.toLowerCase()} heroName={heroName} />
      )}
    </div>
  );
};
