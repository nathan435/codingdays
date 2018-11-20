import instance from '../../instance';
import { createMonster, spawnMonster } from '../../monster';
import { Tower } from '../../tower';
import createAnimations from './createAnimations';
import applyColliders from './applyColliders';
import setupMap from './setupMap';
import setupGroups from './setupGroups';
import setupEvents from './setupEvents';
import setupPlayer from './setupPlayer';
import setupCamera from './setupCamera';





export default function () {
  this.forceSingleUpdate=true;

  const world = this.physics.world;
  world.bounds.height = 16000;
  const gameWidth =  this.sys.game.canvas.width;
  const gameHeight = this.game.canvas.height;
  const worldHeight = world.bounds.height;

  const background = this.add.image(750, worldHeight - 500, 'background');
  background.scaleX = 2;
  background.scaleY = 2;



  instance.tower = new Tower(this, worldHeight);

  createAnimations.call(this);
  setupPlayer.call(this);
  setupCamera.call(this);
  setupGroups.call(this);
  applyColliders.call(this);
  setupMap.call(this);
  setupEvents.call(this);

  createMonster(this);

  

}


