import 'phaser';
import constants from './constants';

import preload from './lifecycle/preload';
import create from './lifecycle/create';
import update from './lifecycle/update';

export default {
  type: Phaser.AUTO,
  backgroundColor: '#c5c5c5',
  parent: 'phaser-example',
  pixelArt: true,
  physics: {
    default: 'arcade',
    arcade: {
        gravity: { y: 2000 },
        debug: false,
    }
  },
  width: constants.gameWidth,
  height: constants.gameHeight,
  scene: {
      preload,
      create,
      update,
  }
};
