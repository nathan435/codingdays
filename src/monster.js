import instance, { ecs } from './instance';

const monsterData = {
    dwarf: {
        sprite: 'dwarf'
    },
    adventurer: {
        sprite: 'adventurer'
    },
}

export function spawnMonster(game) {
  const monsterType = 'adventurer'
  // monsterType = 'dwarf'
  // const monsterId = ecs.entities.length + 1;

  // const monster = game.physics.add.sprite(500, 320, 'adventurer');
  // const monster = game.physics.add.sprite(500, 320, monsterData[monsterType].sprite);
  console.log('REAL INSTANE?', instance);
  const monster = instance.monsters.create(500, 320, 'adventurer')

  // instance.monsters[monsterId] = monster;
  // ecs.entities.push(monsterId)

  monster.setDisplaySize(64, 64);

  monster.setBounce(0);
  monster.setCollideWorldBounds(true);

  monster.direction = 'left';


  // game.physics.add.collider(monster, instance.fallingBlocks);
  // game.physics.add.collider(monster, instance.trampolines, hitTrampoline);
  // game.physics.add.collider(monster, instance.platforms);
}


