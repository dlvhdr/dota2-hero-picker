// @flow

import React from 'react';
import HeroPreview from './HeroPreview';

import './HeroesByAttribute.css';

const compareHeroNames = (heroA, heroB) => {
  if (heroA.info.title < heroB.info.title) {
    return -1;
  } else if (heroA.info.title > heroB.info.title) {
    return 1;
  }

  return 0;
}

const HeroesByAttribute = ({ attributeName, heroesList }) => {
  return (
    <div className='HeroesByAttributeList'>
      <div className='AttributeName'>
        <span className='Rotate'>
          {attributeName}
        </span>
    </div>
      <div className='HeroesList'>
        {heroesList.sort(compareHeroNames)
          .map(hero =>
            <HeroPreview
              className='HeroPreview'
              key={hero.valveName}
              hero={hero} />
          )
        }
      </div>
    </div>
  );
};

export default HeroesByAttribute;
