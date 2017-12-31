// @flow

import React from 'react';
import HeroesByAttribute from './HeroesByAttribute';
import heroes from '../../mock_data/heroes';
import './HeroPicker.css';

const HeroPicker = () => {
  return (
    <div className='HeroPicker'>
      {['Strength', 'Agility', 'Intelligence'].map(attriute =>
        <HeroesByAttribute
          key={attriute}
          attributeName={attriute}
          heroesList={heroes.filter(hero => hero.mainAttribute === attriute)} />
      )}
    </div>
  );
};

export default HeroPicker;
