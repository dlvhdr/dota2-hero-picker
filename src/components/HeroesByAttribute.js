// @flow

import React from 'react';
import HeroPreview from './HeroPreview';

import './HeroesByAttribute.css';

const HeroesByAttribute = ({ attributeName, heroesList }) => {
  return (
    <div className='HeroesByAttributeList'>
      <div className='AttributeName'>
        <span className='Rotate'>
          {attributeName}
        </span>
    </div>
      <div className='HeroesList'>
        {heroesList.map(hero =>
          <HeroPreview
            className='HeroPreview'
            key={hero.heroName.toLowerCase()}
            hero={hero} />
        )}
      </div>
    </div>
  );
};

export default HeroesByAttribute;
