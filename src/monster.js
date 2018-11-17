import instance from './instance';

const monsterData = {
    dwarf: {
        sprite: 'dwarf',
        x: 50,
        y: 50,
        velocityX: 50,
    },
    adventurer: {
        sprite: 'adventurer',

    },
};

export function spawnMonster(game, x=500, y=15800) {
  const monsterType = 'dwarf';
  const data = monsterData[monsterType];
  const monster = instance.monsters.create(x, y, data.sprite);

  monster.setVelocityX(data.velocityX);
  monster.setDisplaySize(data.x, data.y);

  monster.setBounce(0);
  monster.setCollideWorldBounds(true);

  monster.direction = 'left';

  monster.setInteractive();

  monster.on('pointerdown', () => { console.log("monster data", {
   monsterRight: monster.body.x + monster.body.width,
   monsterBottom: monster.body.y + monster.body.height,
  })});
}

const hitPlayer = (monster, player) => {
  player.life -= 10;
  lifeText.setText('Life :' + player.life)
  if (player.life <= 0){
    player.setTint(0xff0000);
    player.anims.play('die');
    
    gameOver = true;
  }
}

export function monsterTouchesPlatform(monster, platform) {

  const monsterBottom = monster.body.y + monster.body.height;
  const boxTop = platform.body.y;

  const sameRow = monsterBottom > boxTop;
  if (!sameRow) {
    return false;
  }
  //platform.disableBody(true, true);
  monster.setVelocityX(0);
  platform.life -= 1;
  if (platform.life <= 0){
    platform.disableBody(true, true);
    
  }
  monster.setVelocityX(50);
}

export function createMonster(game) {
  const worldHeight = game.physics.world.bounds.height;
  const gameHeight = game.game.canvas.height;
  
  game.physics.add.collider(instance.monsters, instance.player, hitPlayer);
  game.physics.add.collider(instance.monsters, instance.platforms, monsterTouchesPlatform);
  game.physics.add.collider(instance.monsters, instance.fallingBlocks);

  // Add debug keyboard controls to spawn stuff
  game.input.keyboard.on('keydown', function (event) {
    if (event.key === 'p') {
      spawnMonster(this);
    }
  });

  // Add debug button to spawn monsters
  const spawnMonsterButton = game.add.text(100, 100, 'Spawn Monster!');
  spawnMonsterButton.setInteractive();
  spawnMonsterButton.on('pointerdown', () => { spawnMonster(this, 0, 0) });
}
