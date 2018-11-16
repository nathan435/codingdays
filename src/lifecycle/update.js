import 'phaser';
import instance from '../instance';

export default function () {
    const {
        cursors,
        player,
        fallingBlocks,
    } = instance;

  if (cursors.left.isDown)
  {
      player.setVelocityX(-210);

      player.anims.play('left', true);
      player.direction = 'left';
  }
  else if (cursors.right.isDown)
  {
      player.setVelocityX(210);

      player.anims.play('right', true);
      player.direction = 'right';
  }
  else
  {
      player.setVelocityX(0);
      player.anims.play(`idle-${instance.player.direction}`);
  }

  if (cursors.up.isDown && player.body.touching.down)
  {
      player.setVelocityY(-330);
  }

  fallingBlocks.children.entries.forEach((block) => {
      block.y += 0.5;
  });

  instance.monsters.children.iterate((monster) => {
      monster.x += 0.5;
  });
}
