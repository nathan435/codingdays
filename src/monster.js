import instance from './instance';
import state from './ui/state';

const monsterData = {
  dwarf: {
    sprite: 'dwarf',
    x: 64,
    y: 64,
    speedX: 0.5,
    velocityX: 50,
  },
  adventurer: {
    sprite: 'adventurer',

  },
};

function startWalking(monster, data) {
  monster.setVelocityX(data.velocityX);
  monster.anims.play('dwarf-walk', true);
}

export function spawnMonster(game, x=500, y=15800) {
  const monsterType = 'dwarf';
  const data = monsterData[monsterType];
  const monster = instance.monsters.create(x, y, data.sprite);

  startWalking(monster, data)

  monster.setDisplaySize(data.x, data.y);

  monster.setBounce(0);
  monster.setCollideWorldBounds(true);

  monster.direction = 'left';

  monster.setInteractive();
}

const hitPlayer = (player, monster, game) => {
  monster.anims.play('dwarf-attack-fast', false);
  state.player.health -= 10;
  if (state.player.health <= 0){
    player.setVelocityY(-2000);
    game.physics.pause();
    player.anims.play('die');
    game.add.text(game.physics.world.centerX, 15400, 'Looooooser!!', { fontSize: '200px', fill: '#ff0000' });
  }
};

function hitPlatform(monster, platform) {
  const monsterType = 'dwarf';
  const data = monsterData[monsterType];

  // FIXME this is a hack to keep the collison happening
  monster.setVelocityX(1);
  monster.anims.play('dwarf-attack', true);

  platform.life -= 1;
  // block dead
  if (platform.life <= 0) {
    instance.tower.destroyBrick(platform);
    startWalking(monster, data)
  }
}

// Callback when monster touhes a platform
export function monsterTouchesPlatform(monster, platform) {

  const monsterBottom = monster.body.y + monster.body.height;
  const boxTop = platform.body.y;

  const sameRow = monsterBottom > boxTop;
  // Attack the box
  if (sameRow) {
    hitPlatform(monster, platform);
  }
}

// Called on Game Create
export function createMonster(game) {
  const worldHeight = game.physics.world.bounds.height;
  const gameHeight = game.game.canvas.height;

  game.physics.add.collider(instance.player, instance.monsters, (player, monster) => hitPlayer(player, monster, game));
  game.physics.add.collider(instance.monsters, instance.platforms, monsterTouchesPlatform);
  game.physics.add.collider(instance.monsters, instance.fallingBlocks);

  // Add debug keyboard controls to spawn stuff
  game.input.keyboard.on('keydown', function (event) {
    if (event.key === 'p') {
      spawnMonster(this);
    }
  });

  // Add debug button to spawn monsters
  // const spawnMonsterButton = game.add.text(100, 100, 'Spawn Monster!');
  // spawnMonsterButton.setInteractive();
  // spawnMonsterButton.on('pointerdown', () => { spawnMonster(this, 0, 0) });
}

// Called on every frame Update
export function updateMonster(game) {
}
