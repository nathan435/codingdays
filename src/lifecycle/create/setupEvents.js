
import instance from '../../instance';
import { spawnMonster } from '../../monster';

function spawnBlock() {
  let x = Math.round(Math.random() * 15) + 3;
  const gameHeight = this.game.canvas.height;
  let block = instance.fallingBlocks.create(64 * x + 32, instance.player.y - gameHeight, 'brick');
  block.alpha = 0.3;
  block.tint = 0x000000;
  block.body.allowGravity = false;
  block.body.immovable = true;
  block.body.moves = false;
  block.setInteractive();
  this.input.setDraggable(block);
  this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
    gameObject.x = Math.round(dragX / 64) * 64 +32;
  });
}

function monstersFromSky () {
  let spawn = Math.random() < 0.7;
  if (!spawn) {
    return false;
  }
  const gameHeight = this.game.canvas.height;
  const y = instance.player.y - gameHeight

  let x = Math.round(Math.random() * 15) + 3;
  let x2 = 64 * x + 32;
  spawnMonster(this, x2, y)
}

export default function () {
  this.time.addEvent({ delay: 2400, callback: spawnBlock, callbackScope: this, repeat: 1000});
  this.time.addEvent({ delay: 1400, callback: monstersFromSky , callbackScope: this, repeat: 1000});
}

