import 'phaser';
import instance from '../instance';
import { updateMonster } from '../monster';

export default function () {
  const gameHeight = this.game.canvas.height;
  const {
    cursors,
    player,
    fallingBlocks,
  } = instance;

  if (cursors.left.isDown)
  {
    player.setVelocityX(-210);

    player.visualBody.anims.play('left', true);
    player.direction = 'left';
  }
  else if (cursors.right.isDown)
  {
    player.setVelocityX(210);

    player.visualBody.anims.play('right', true);
    player.direction = 'right';
  }
  else
  {
    player.setVelocityX(0);
    player.visualBody.anims.play(`idle-${instance.player.direction}`);
  }

  if (cursors.space.isDown) {
    if (player.weapon.canShoot()) {
      player.weapon.shoot();
    }
  }

  if (cursors.up.isDown && player.body.touching.down)
  {
    player.setVelocityY(-800);
  } else if (player.flying) {
    player.setVelocityY(-400)
  }


  fallingBlocks.children.entries.forEach((block) => {
    if (block.fallFast) {
      block.y += 6;
    } else if (block.y > gameHeight / 3) {
      block.y += 3;
    } else {
      block.y += 0.5;
    }
  });

  updateMonster()

  instance.player.visualBody.x = instance.player.x;
  instance.player.visualBody.y = instance.player.y - 16;
  if (instance.player.flying) player.visualBody.anims.play('fly');
};
      
