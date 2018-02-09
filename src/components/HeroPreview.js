// @flow

import React from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { heroSelected } from '../actions/actions';
import './HeroPreview.css';

class HeroPreview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isHovered: false
    };
  }

  render() {
    const {
      hero,
      currentSearchTerm,
      className,
      heroSelected,
      selectedRoles
    } = this.props;
    const heroName = hero.info.title;
    const heroRoles = hero.roles.slice().concat([hero.info['range type']]);
    const heroMatches = selectedRoles.length === 0
      ? heroName.toUpperCase().startsWith(
        currentSearchTerm)
      : selectedRoles.every(selectedRole => heroRoles.includes(selectedRole));

    const { isHovered } = this.state;
    return (
      <div
        className={classNames(
          'HeroPreviewRoot',
          className,
          { HoveredOverHero: isHovered }
        )}
        onClick={() => heroSelected(hero)}>
        <div
          className="SmallContainer"
          onMouseEnter={() => this.setState({ isHovered: true })}
          onMouseLeave={() => this.setState({ isHovered: false })}>
          <img className={classNames({
              MatchingHero: currentSearchTerm !== '' && heroMatches,
              NonMatchingHero: !heroMatches,
              LargePicture: isHovered === true
            })}
            width={!isHovered ? 42 : 94.5}
            height={!isHovered ? 60 : 133.5}
            src={'../public/images/' + hero.valveName + '_vert.jpg'} />
        </div>
        <div className="LargeContainer">
          <div className="HeroName">{heroName}</div>
        </div>
      </div>
    );
  }
};

const mapStateToProps = (state) => {
  const { currentSearchTerm } = state.searchInfo;
  const { selectedRoles } = state;

  return {
    currentSearchTerm,
    selectedRoles
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({heroSelected}, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(HeroPreview);
