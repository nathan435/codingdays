import instance from '../instance';

const hitTrampoline = (player, trampoline) => {
  const isOnIt = player.x >= trampoline.x - 16 && player.x <= trampoline.x + 16;
  if (!trampoline.bounced && isOnIt) {
    player.setVelocityY(-500);
    trampoline.bounced = true;
    setTimeout(() => trampoline.bounced = false, 1000);
  }
}

const fallingBlockFinalCollision = (platform, fallingBlock) => {
  // let block = instance.platforms.create(480, 864 - 128, 'brick');
  // console.log('block', block)
  if (!fallingBlock.destroyed) {
    fallingBlock.body.immovable = true;
    fallingBlock.destroyed = true;
    fallingBlock.disableBody(true, true);
    fallingBlock.destroy(true);
    // platform.destroy();
    instance.platforms.create(fallingBlock.x, fallingBlock.y, 'brick');
    console.log(fallingBlock)
  }
}

function createAnimations() {
  this.anims.create({
    key: 'idle-right',
    frames: this.anims.generateFrameNumbers('adventurer', { start: 0, end: 12 }),
    frameRate: 10,
  });

  this.anims.create({
    key: 'idle-left',
    frames: this.anims.generateFrameNumbers('adventurer', { start: 104, end: 109 }),
    frameRate: 10,
  });

  this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('adventurer', { start: 117, end: 124 }),
      frameRate: 10,
      repeat: -1
  });
  
  this.anims.create({
      key: 'turn',
      frames: [ { key: 'adventurer', frame: 4 } ],
      frameRate: 20
  });
  
  this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('adventurer', { start: 13, end: 20 }),
      frameRate: 10,
      repeat: -1
  });
}

export default function () {
  const gameWidth =  this.sys.game.canvas.width;
  const gameHeight = this.game.canvas.height;

  instance.player = this.physics.add.sprite(320, 320, 'adventurer');
  const { player } = instance;
  player.setDisplaySize(64, 64);

  player.setBounce(0);
  player.setCollideWorldBounds(true);

  createAnimations.call(this);

  instance.platforms = this.physics.add.staticGroup();
  instance.trampolines = this.physics.add.staticGroup();
  instance.fallingBlocks = this.physics.add.group();
  console.log(this.input)

  player.direction = 'left';

  player.setInteractive();
  player.on('pointerdown', (test, test2) => {
    console.log(test, test2)
  })

  /*
  this.input.on('gameobjectdown', function (pointer, gameObject) {
    console.log(pointer, gameObject);
    gameObject.disableBody(true, true);
  });
  */

  this.forceSingleUpdate=true;

  this.physics.add.collider(instance.platforms, instance.fallingBlocks, fallingBlockFinalCollision);
  this.physics.add.collider(instance.player, instance.fallingBlocks);
  this.physics.add.collider(instance.fallingBlocks, instance.fallingBlocks);
  this.physics.add.collider(instance.player, instance.trampolines, hitTrampoline);
  this.physics.add.collider(instance.player, instance.platforms);
  this.physics.add.collider(instance.fallingBlocks, instance.fallingBlocks);

  this.add.text(100, 100, 'Best Game Ever!')
  
  setInterval(() => {
    let x = Math.round(Math.random() * 15) + 3;
    let block = instance.fallingBlocks.create(64 * x + 32, -32, 'brick');
    block.body.allowGravity = false;
    block.body.immovable = true;
    block.body.moves = false;
    block.setInteractive();
    this.input.setDraggable(block);
    this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
      gameObject.x = Math.round(dragX / 64) * 64 +32;

  });
  }, 2000)

  for (let i = 2; i < 18; i++) {
    instance.platforms.create(i * 64 + 32, gameHeight - 32, 'brick');
  }
  instance.platforms.create(64 * 2 + 32, gameHeight - 64 -32, 'brick');
  instance.trampolines.create(64 * 3 + 32, gameHeight - 64 -32, 'brick-bounce');
  instance.platforms.create(64 * 4 + 32, gameHeight - 64 -32, 'brick');

}