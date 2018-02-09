import React from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { abilitySelected } from '../actions/actions';

import './HeroAbilityPreview.css';
import Abaddon from '../../mock_data/Abaddon';

const HeroAbilityPreview = ({ ability, selectedAbility, abilitySelected, className}) => (
  <div
    className={classNames(className, 'HeroAbilityPreviewRoot', {
      SelectedHeroAbilityPreview: ability.name === selectedAbility,
    })}
    onClick={() => abilitySelected(ability.name)}>
    <img
      src={'../public/images/' + ability.image}
      width={55}
      height={55}
    />
  </div>
);

const mapStateToProps = (state) => {
  const { selectedAbility } = state;
  return {
    selectedAbility
  }
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({abilitySelected}, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(HeroAbilityPreview);
