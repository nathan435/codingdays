import instance from '../../instance';

export default function () {
  instance.platforms = this.physics.add.staticGroup();
  instance.trampolines = this.physics.add.staticGroup();
  instance.fallingBlocks = this.physics.add.group();
  instance.monsters = this.physics.add.group()
  instance.bullets = this.physics.add.group();
}