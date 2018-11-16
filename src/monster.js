import instance from './instance';

const monsterData = {
    dwarf: {
        sprite: 'dwarf',
        x: 100,
        y: 100,
    },
    adventurer: {
        sprite: 'adventurer',

    },
};

export function spawnMonster(game, x=500, y=320) {
  const monsterType = 'dwarf';
  const data = monsterData[monsterType];
  const monster = instance.monsters.create(x, y, data.sprite);

  monster.setDisplaySize(data.x, data.y);

  monster.setBounce(0);
  monster.setCollideWorldBounds(true);

  monster.direction = 'left';
}

export function monsterTouchesPlatform(monster, platform) {
  platform.disableBody(true, true);
  // const isOnIt = monster.x >= mons.x - 16 && player.x <= trampoline.x + 16;
  // if (!trampoline.bounced && isOnIt) {
    // player.setVelocityY(-500);
    // trampoline.bounced = true;
    // setTimeout(() => trampoline.bounced = false, 1000);
  // }
}

export function createMonster(game) {
  const worldHeight = game.physics.world.bounds.height;
  const gameHeight = game.game.canvas.height;
  game.physics.add.collider(instance.monsters, instance.platforms, monsterTouchesPlatform);
  game.physics.add.collider(instance.monsters, instance.fallingBlocks);

  // Add debug keyboard controls to spawn stuff
  game.input.keyboard.on('keydown', function (event) {
    if (event.key === 'p') {
      spawnMonster(this);
    }
  });

  // when the player overlaps with a tile with index 17, monsterTouchesPlatform
  // will be called
  // instance.platforms.setTileIndexCallback(17, monsterTouchesPlatform, this);
  // this.physics.add.overlap(monster, instance.platforms);
}
