import instance from '../../instance';
import { Weapon } from '../../weapon';

export default function () {
  const world = this.physics.world;
  const worldHeight = world.bounds.height;

  instance.player = this.physics.add.sprite(320, worldHeight - 200, 'adventurer');
  instance.player.alpha = 0;
  instance.player.visualBody = this.physics.add.sprite(320, worldHeight - 200 - 16, 'adventurer');
  instance.player.visualBody.body.allowGravity = false;
  instance.player.visualBody.setDisplaySize(64, 64);
  instance.player.setDisplaySize(32, 32);

  instance.player.setBounce(0);
  instance.player.setCollideWorldBounds(true);

  instance.player.weapon = new Weapon('ice', 'ice-up', 1000, 60, 200, this, instance.player);

  instance.player.direction = 'left';

  instance.player.setInteractive();
}