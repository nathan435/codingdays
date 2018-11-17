import instance from '../instance';
import { createMonster, spawnMonster } from '../monster';

export var lifeText;

import { Weapon } from '../weapon.js';
import { Tower } from '../tower';

const hitPlatform = (player, platform) => {
  instance.tower.onHitPlatform(player, platform);
}

const hitTrampoline = (player, trampoline) => {
  const isOnIt = player.x >= trampoline.x - 16 && player.x <= trampoline.x + 16;
  if (!trampoline.bounced && isOnIt) {
    player.setVelocityY(-1100);
    trampoline.bounced = true;
    setTimeout(() => trampoline.bounced = false, 1000);
  }
}

function convertFallingBlockToPlatform(fallingBlock, type) {
  if (!fallingBlock.destroyed) {
    fallingBlock.body.immovable = true;
    fallingBlock.destroyed = true;
    fallingBlock.disableBody(true, true);
    fallingBlock.destroy(true);
    // platform.destroy();

    instance.tower.addBlockPx(fallingBlock.x, fallingBlock.y, type);
  }
}

const fallingBlockFinalCollision = (platform, fallingBlock) => {
  fallingBlock.y = fallingBlock.y - 20;
  convertFallingBlockToPlatform(fallingBlock, 'brick');
};

const fallingBlockHit = (bullet, fallingBlock) => {
  convertFallingBlockToPlatform(fallingBlock, 'frozen');

  if (!bullet.destroyed) {
    bullet.body.immovable = true;
    bullet.destroyed = true;
    bullet.disableBody(true, true);
    bullet.destroy(true);
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
    key: 'fly',
    frames: [ { key: 'ufo', frame: 0 } ],
  });

  this.anims.create({
    key: 'right',
    frames: this.anims.generateFrameNumbers('adventurer', { start: 13, end: 20 }),
    frameRate: 10,
    repeat: -1
  });

  this.anims.create({
    key: 'blood-up',
    frames: this.anims.generateFrameNumbers('blood'),
    frameRate: 10,
    yoyo: true,
    repeat: -1
  });

  this.anims.create({
    key: 'ice-up',
    frames: this.anims.generateFrameNumbers('ice'),
    frameRate: 10,
    yoyo: true,
    repeat: -1
  });

  this.anims.create({
    key: 'die',
    frames: [ { key:'adventurer', frame: 80} ],
    frameRate: 10,
  });

  this.anims.create({
    key: 'dwarf-attack',
    frames: this.anims.generateFrameNumbers('dwarf', {start: 20, end: 26}),
    frameRate: 13,
    repeat: 0
  });

  this.anims.create({
    key: 'dwarf-attack-fast',
    frames: this.anims.generateFrameNumbers('dwarf', {start: 20, end: 26}),
    frameRate: 25,
    repeat: 5
  });

  this.anims.create({
    key: 'dwarf-walk',
    frames: this.anims.generateFrameNames('dwarf', {start: 10, end: 17}),
    // frames: this.anims.generateFrameNames('dwarf', {start: 28, end: 31}),
    frameRate: 20,
    repeat: -1
  });

  // idle with only one frame, so repeat is not neaded
  // this.anims.create({
  // key: 'idle',
  // frames: [{key: 'player', frame: 'p1_stand'}],
  // frameRate: 10,
  // });
}

export default function () {
  const world = this.physics.world;
  world.bounds.height = 16000;
  const gameWidth =  this.sys.game.canvas.width;
  const gameHeight = this.game.canvas.height;
  const worldHeight = world.bounds.height;

  const background = this.add.image(750, worldHeight - 500, 'background');
  console.log(background)
  background.scaleX = 2;
  background.scaleY = 2;

  instance.player = this.physics.add.sprite(320, worldHeight - 200, 'adventurer');
  instance.player.alpha = 0;
  instance.player.visualBody = this.physics.add.sprite(320, worldHeight - 200 - 16, 'adventurer');
  instance.player.visualBody.body.allowGravity = false;
  const { player } = instance;
  instance.player.visualBody.setDisplaySize(64, 64);
  player.setDisplaySize(32, 32);

  player.setBounce(0);
  player.setCollideWorldBounds(true);

  player.weapon = new Weapon('ice', 'ice-up', 1000, 60, 200, this, player);

  player.life = 100;
  lifeText = this.add.text(16, 15200, 'Life: 100', { fontSize: '32px', fill: '#000' });

  instance.tower = new Tower(this, worldHeight);

  createAnimations.call(this);

  console.log(this.physics.world)
  // set bounds so the camera won't go outside the game world
  this.cameras.main.setBounds(0, 0, world.bounds.width, world.bounds.height);
  // make the camera follow the player
  this.cameras.main.startFollow(player);

  // set background color, so the sky is not black    
  this.cameras.main.setBackgroundColor('#ddf8ff');

  instance.platforms = this.physics.add.staticGroup();
  instance.trampolines = this.physics.add.staticGroup();
  instance.fallingBlocks = this.physics.add.group();
  instance.monsters = this.physics.add.group()
  instance.bullets = this.physics.add.group();
  console.log(this.input)

  player.direction = 'left';

  player.setInteractive();

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

  //createTower(this);

  this.physics.add.collider(instance.platforms, instance.fallingBlocks, fallingBlockFinalCollision);
  this.physics.add.collider(instance.player, instance.fallingBlocks);
  this.physics.add.collider(instance.fallingBlocks, instance.fallingBlocks);
  this.physics.add.collider(instance.player, instance.platforms, hitPlatform);
  this.physics.add.collider(instance.bullets, instance.fallingBlocks, fallingBlockHit);

  createMonster(this);
  //this.physics.add.collider(instance.monsters, instance.player, hitPlayer);
  //this.physics.add.collider(instance.monsters, instance.platforms, monsterTouchesPlatform);
  //this.physics.add.collider(instance.monsters, instance.fallingBlocks);

  this.add.text(100, 100, 'Best Game Ever!')

  this.time.addEvent({ delay: 2400, callback: spawnBlock, callbackScope: this, repeat: 1000});
  this.time.addEvent({ delay: 1400, callback: monstersFromSky , callbackScope: this, repeat: 1000});

  for (let i = 2; i < 18; i++) {
    instance.tower.addBlock(i, 0, 'brick');
  }

  instance.tower.addBlock(2, 1, 'brick');
  instance.tower.addBlock(3, 1, 'trampoline');
  instance.tower.addBlock(4, 1, 'brick');

  instance.tower.addBlock(5, 1, 'brick');
  instance.tower.addBlock(5, 2, 'brick');
  instance.tower.addBlock(5, 3, 'brick');
  instance.tower.addBlock(5, 4, 'brick');
  instance.tower.addBlock(5, 5, 'brick');

  // Add debug keyboard controls
  this.input.keyboard.on('keydown', function (event) {
    if (event.key === 'f') {
      if (instance.player.flying) {
        instance.player.visualBody.setTexture('adventurer');
      } else {
        instance.player.visualBody.setTexture('ufo');
      }
      instance.player.flying = !instance.player.flying;
    }
  });

}

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
    console.log('NO SPAWN MONStER')
    return false;
  }
  const gameHeight = this.game.canvas.height;
  const y = instance.player.y - gameHeight

  let x = Math.round(Math.random() * 15) + 3;
  let x2 = 64 * x + 32;
  spawnMonster(this, x2, y)
}
