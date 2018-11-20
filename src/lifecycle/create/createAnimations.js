export default function createAnimations() {
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