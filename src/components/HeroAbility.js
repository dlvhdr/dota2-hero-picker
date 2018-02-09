import React from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { abilitySelected } from '../actions/actions';

import './HeroAbility.css';
// import Abaddon from '../../mock_data/Abaddon';

const HeroAbility = ({ability}) => {
  const traits = Object.keys(ability).filter(key => key.match(/trait\d$/)).map(
    trait => {
      const traitNum = trait.replace("trait", "");
      return {
        name: ability[trait],
        value: ability['value' + traitNum],
      };
    }
  );
  return (
    <div className="HeroAbilityRoot">
      <div className="AbilityName">{ability.name}</div>
      <div>{ability.description}</div>
      <div className="HeroAbilityTraits">
        {traits.map(trait =>
          <div
            className="AbiltyTrait"
            key={`trait_${trait.name}`}>
            <span className="TraitName">{trait.name}: </span>
            <span className="TraitValue">{trait.value}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default HeroAbility;
