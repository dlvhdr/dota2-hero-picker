import React from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import HeroAbilityPreview from './HeroAbilityPreview';
import HeroAbility from './HeroAbility';

import './SelectedHero.css';
// import Abaddon from '../../mock_data/Abaddon';

class SelectedHero extends React.Component {
  render() {
    const { selectedHero, selectedAbility, className } = this.props;
    return (
      <div className={classNames(className,
        {
          SelectedHero: true,
          NoSelectedHero: selectedHero === null
        }
      )}>
        { selectedHero !== null
          ? this.renderHero()
          : this.renderUnselectedHero()
        }
      </div>
    );
  }

  renderHero() {
    const { selectedHero, selectedAbility } = this.props;
    const heroName = selectedHero.info.title;
    return (
      <div>
        <div className="SelectedHeroName">
          {heroName}
        </div>
        <div className="selectedHeroImage">
          <img
            width={126}
            height={161}
            src={
              '../public/images/' +
              selectedHero.valveName +
              '_vert.jpg'
            } />
            <div className="HeroMainAttribute">
              <div>{selectedHero.info['range type']}</div>
            </div>
        </div>
        <div className="SelectedHeroAbilities">
          {selectedHero.abilities.map(ability =>
            <HeroAbilityPreview
              className="HeroAbilityPreview"
              key={`ability_${ability.name}`}
              ability={ability} />
          )}
        </div>
        {this.renderSelectedAbility()}
      </div>
    );
  }

  renderSelectedAbility() {
    const { selectedAbility, selectedHero } = this.props;
    console.log("selected ability", selectedAbility, "selectedHero", selectedHero);

    return (
      <div className="SelectedAbility">
        <HeroAbility ability={selectedHero.abilities.find(
          ability => ability.name === selectedAbility,
        )}
        />
      </div>
    );
  }

  renderUnselectedHero() {
    return (
      <div>
        <div className="SelectedHeroName">
          Choose Your Hero
        </div>
        <div
          className="selectedHeroImage"
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { selectedHero, selectedAbility } = state;

  return {
    selectedHero,
    selectedAbility
  };
};

export default connect(mapStateToProps)(SelectedHero);
