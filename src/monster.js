import instance from './instance';

const monsterData = {
    dwarf: {
        sprite: 'dwarf'
    },
    adventurer: {
        sprite: 'adventurer'
    },
}

export function spawnMonster(game) {
  const monsterType = 'dwarf'
  const monster = instance.monsters.create(500, 320, monsterData[monsterType].sprite)

  monster.setDisplaySize(64, 64);

  monster.setBounce(0);
  monster.setCollideWorldBounds(true);

  monster.direction = 'left';
}


