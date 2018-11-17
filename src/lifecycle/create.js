import instance from '../instance';
import { createMonster } from '../monster';

export var lifeText;

import { Weapon } from '../weapon.js';

const hitTrampoline = (player, trampoline) => {
  const isOnIt = player.x >= trampoline.x - 16 && player.x <= trampoline.x + 16;
  if (!trampoline.bounced && isOnIt) {
    player.setVelocityY(-1100);
    trampoline.bounced = true;
    setTimeout(() => trampoline.bounced = false, 1000);
  }
}

function convertFallingBlockToPlatform(fallingBlock) {
  if (!fallingBlock.destroyed) {
    fallingBlock.body.immovable = true;
    fallingBlock.destroyed = true;
    fallingBlock.disableBody(true, true);
    fallingBlock.destroy(true);
    // platform.destroy();

    const block = instance.platforms.create(fallingBlock.x, Math.floor(fallingBlock.y / 64) * 64 +32, 'brick');
    block.life = 100;

    block.setInteractive();
    block.on('pointerdown', () => { console.log({"blockleft": block.body.x, blockTop: block.body.y, blockBottom: block.body.y + block.body.height}) });
    // console.log(fallingBlock)
  }
}

const fallingBlockFinalCollision = (platform, fallingBlock) => {
  convertFallingBlockToPlatform(fallingBlock);
};

const fallingBlockHit = (bullet, fallingBlock) => {
  convertFallingBlockToPlatform(fallingBlock);

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

  player.weapon = new Weapon('blood', 'blood-up', 1000, 60, 200, this, player);

  player.life = 100;
  lifeText = this.add.text(16, 15200, 'Life: 100', { fontSize: '32px', fill: '#000' });

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

  //spawnMonster(this)

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

  this.physics.add.collider(instance.platforms, instance.fallingBlocks, fallingBlockFinalCollision);
  this.physics.add.collider(instance.player, instance.fallingBlocks);
  this.physics.add.collider(instance.fallingBlocks, instance.fallingBlocks);
  this.physics.add.collider(instance.player, instance.trampolines, hitTrampoline);
  this.physics.add.collider(instance.player, instance.platforms);
  this.physics.add.collider(instance.bullets, instance.fallingBlocks, fallingBlockHit);

  createMonster(this);
  //this.physics.add.collider(instance.monsters, instance.player, hitPlayer);
  //this.physics.add.collider(instance.monsters, instance.platforms, monsterTouchesPlatform);
  //this.physics.add.collider(instance.monsters, instance.fallingBlocks);

  this.add.text(100, 100, 'Best Game Ever!')

  this.time.addEvent({ delay: 2400, callback: spawnBlock, callbackScope: this, repeat: 1000});

  for (let i = 2; i < 18; i++) {
    const bl = instance.platforms.create(i * 64 + 32, (worldHeight - 32), 'brick');
    bl.setInteractive();
    bl.on('pointerdown', () => { console.log({"blockleft": bl.body.x, blockTop: bl.body.y}) });
  }
  instance.platforms.create(64 * 2 + 32, (worldHeight - 64 -32), 'brick');
  instance.trampolines.create(64 * 3 + 32, (worldHeight - 64 -32), 'brick-bounce');
  instance.platforms.create(64 * 4 + 32, (worldHeight - 64 -32), 'brick');

  instance.platforms.create(64 * 4 + 32, worldHeight - (64 * 1 -32), 'brick');
  instance.platforms.create(64 * 4 + 32, worldHeight - (64 * 2 -32), 'brick');
  instance.platforms.create(64 * 4 + 32, worldHeight - (64 * 3 -32), 'brick');
  instance.platforms.create(64 * 4 + 32, worldHeight - (64 * 4 -32), 'brick');
  instance.platforms.create(64 * 4 + 32, worldHeight - (64 * 5 -32), 'brick');

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
