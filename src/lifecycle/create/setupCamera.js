import instance from '../../instance';

export default function () {
  const world = this.physics.world;
  // set bounds so the camera won't go outside the game world
  this.cameras.main.setBounds(0, 0, world.bounds.width, world.bounds.height);
  // make the camera follow the player
  this.cameras.main.startFollow(instance.player);

  // set background color, so the sky is not black    
  this.cameras.main.setBackgroundColor('#ddf8ff');
}