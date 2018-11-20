import React from 'react';
import ReactDom from 'react-dom';
import { observer } from 'mobx-react';
import uiState from './state';
import constants from '../constants';

const styles = {
  ui: {
    position: 'absolute',
    left: 0,
    width: constants.gameWidth,
    fontFamily: 'sans-serif',
  },
  left: {
    position: 'absolute',
    left: 16,
    top: 16,
    width: constants.gameWidth / 4,
    height: 60,
    borderRadius: 16,
    background: 'white',
    padding: 8,
    boxSizing: 'border-box',
  },
  icon: {
    height: 24,
  },
  healthIcon: {
    position: 'absolute',
    left: 0,
  },
  healthBar: {
    position: 'relative',
    height: 24,
    display: 'flex',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10,
  },
  ressourceValue: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  valueText: {
    marginLeft: 4,
    marginRight: 4,
  }
}

const Player = observer(({ uiState }) => {
  const healthPercentage = uiState.player.health / constants.playerInitialHealth * 100;
  return (
    <div style={styles.left}>
      <div style={styles.healthBar}>
       <img style={{ ...styles.icon, ...styles.healthIcon}} src={require('../../assets/heart.png')}></img>
        <div style={{ background: 'red', height: 8, width: healthPercentage + '%'}}></div>
      </div>
      <div style={styles.ressourceValue}>
        <img style={styles.icon} src={require('../../assets/stone.png')}></img>
        <span style={styles.valueText}>{uiState.ressources.stone}</span>
      </div>
    </div>
  )
})

const Ui = observer(({ uiState }) => (
  <div style={styles.ui}>
    <Player uiState={uiState} />
  </div>
));


export default () => {
  ReactDom.render(
    <Ui uiState={uiState}></Ui>,
    document.getElementById('react-target')
  );
};
