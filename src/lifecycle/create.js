import instance from '../instance';
import { createMonster } from '../monster';

const hitTrampoline = (player, trampoline) => {
  const isOnIt = player.x >= trampoline.x - 16 && player.x <= trampoline.x + 16;
  if (!trampoline.bounced && isOnIt) {
    player.setVelocityY(-1100);
    trampoline.bounced = true;
    setTimeout(() => trampoline.bounced = false, 1000);
  }
};

const fallingBlockFinalCollision = (platform, fallingBlock) => {
  // let block = instance.platforms.create(480, 864 - 128, 'brick');
  // console.log('block', block)
  if (!fallingBlock.destroyed) {
    fallingBlock.body.immovable = true;
    fallingBlock.destroyed = true;
    fallingBlock.disableBody(true, true);
    fallingBlock.destroy(true);
    // platform.destroy();
    instance.platforms.create(fallingBlock.x, Math.floor(fallingBlock.y / 64) * 64 +32, 'brick');
    console.log(fallingBlock)
  }
};

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
  const world = this.physics.world;
  world.bounds.height = 16000;
  const gameWidth =  this.sys.game.canvas.width;
  const gameHeight = this.game.canvas.height;
  const worldHeight = world.bounds.height;

  instance.player = this.physics.add.sprite(320, worldHeight - 200, 'adventurer');
  const { player } = instance;
  player.setDisplaySize(64, 64);

  player.setBounce(0);
  player.setCollideWorldBounds(true);
  player.body.maxVelocity.x = 400;


  createAnimations.call(this);
  
  console.log(this.physics.world)
  // set bounds so the camera won't go outside the game world
  this.cameras.main.setBounds(0, 0, world.bounds.width, world.bounds.height);
  // make the camera follow the player
  this.cameras.main.startFollow(player);
  
  // set background color, so the sky is not black    
  this.cameras.main.setBackgroundColor('#ccccff');

  instance.platforms = this.physics.add.staticGroup();
  instance.trampolines = this.physics.add.staticGroup();
  instance.fallingBlocks = this.physics.add.group();
  instance.monsters = this.physics.add.group()

  player.direction = 'left';

  player.setInteractive();
  player.on('pointerdown', (test, test2) => {
    console.log(test, test2)
  });

  this.input.on('gameobjectdown', (pointer, gameObject) => {
    if (instance.fallingBlocks.children.entries.indexOf(gameObject) > -1) {
      if (gameObject.clicked) gameObject.fallFast = true;
      gameObject.clicked = true;
      this.time.addEvent({ delay: 400, callback: () => {
        gameObject.clicked = false;
      }, callbackScope: this});
    }
    // gameObject.disableBody(true, true);
  });

  this.forceSingleUpdate=true;

  this.physics.add.collider(instance.platforms, instance.fallingBlocks, fallingBlockFinalCollision);
  this.physics.add.collider(instance.player, instance.fallingBlocks);
  this.physics.add.collider(instance.fallingBlocks, instance.fallingBlocks);
  this.physics.add.collider(instance.player, instance.trampolines, hitTrampoline);
  this.physics.add.collider(instance.player, instance.platforms);
  this.physics.add.collider(instance.fallingBlocks, instance.fallingBlocks);

  createMonster(this);

  
  this.time.addEvent({ delay: 2400, callback: spawnBlock, callbackScope: this, repeat: 1000});

  for (let i = 2; i < 18; i++) {
    instance.platforms.create(i * 64 + 32, (worldHeight - 32), 'brick');
  }
  instance.platforms.create(64 * 2 + 32, (worldHeight - 64 -32), 'brick');
  instance.trampolines.create(64 * 3 + 32, (worldHeight - 64 -32), 'brick-bounce');
  instance.platforms.create(64 * 4 + 32, (worldHeight - 64 -32), 'brick');

  instance.platforms.create(64 * 4 + 32, worldHeight - (64 * 1 -32), 'brick');
  instance.platforms.create(64 * 4 + 32, worldHeight - (64 * 2 -32), 'brick');
  instance.platforms.create(64 * 4 + 32, worldHeight - (64 * 3 -32), 'brick');
  instance.platforms.create(64 * 4 + 32, worldHeight - (64 * 4 -32), 'brick');
  instance.platforms.create(64 * 4 + 32, worldHeight - (64 * 5 -32), 'brick');



}

function spawnBlock () {
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