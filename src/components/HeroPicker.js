// @flow

import React from 'react';
import HeroesByAttribute from './HeroesByAttribute';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { bindActionCreators } from 'redux';
import { selectRole } from '../actions/actions';
// import heroes from '../../mock_data/heroes';
import './HeroPicker.css';

const HeroPicker = ({ heroes, selectRole, selectedRoles }) => {
  return (
    <div className='HeroPicker'>
      {['Strength', 'Agility', 'Intelligence'].map(attriute =>
        <HeroesByAttribute
          key={attriute}
          attributeName={attriute}
          heroesList={heroes.filter(hero => hero.mainAttribute === attriute)} />
      )}
      <div>
        <div className="HeroPickerRoles HeroPickerUpperRoles">
          {['Nuker', 'Disabler', 'Jungler', 'Durable',
            'Escape', 'Pusher', 'Initiator']
          .map(role =>
            <div className={classNames("Role", {
              SelectedRole: selectedRoles.includes(role)
            })} onClick={selectRole.bind(null, role)}>
              {role}
              <div className="RoleBorder" />
            </div>
          )}
        </div>
        <div className="HeroPickerRoles HeroPickerBottomRoles">
          {['Carry', 'Support', 'Complexity', 'Melee', 'Ranged'].map(role =>
          <div
            className={classNames("Role", {
              ComplexityRole: role === 'Complexity',
              SelectedRole: selectedRoles.includes(role)
            })}
            onClick={selectRole.bind(null, role)}>
            {role}
            <div className="RoleBorder" />
          </div>)}
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  const { heroes, selectedRoles } = state;

  return {
    heroes,
    selectedRoles
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    selectRole
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(HeroPicker);
