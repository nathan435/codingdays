import 'phaser';
import instance from '../instance';

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
    player.setVelocityY(-800);
  }

  fallingBlocks.children.entries.forEach((block) => {
      if (block.fallFast) {
          block.y += 6;
      } else if (block.y > gameHeight / 3) {
        block.y += 3;
      } else {
        block.y += 0.5;
      }
  })

  instance.monsters.children.iterate((monster) => {
    monster.x += 0.5;
});
};
