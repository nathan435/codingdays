import instance from '../../instance';

export const hitPlatform = (player, platform) => {
  instance.tower.onHitPlatform(player, platform);
}

export const hitTrampoline = (player, trampoline) => {
  const isOnIt = player.x >= trampoline.x - 16 && player.x <= trampoline.x + 16;
  if (!trampoline.bounced && isOnIt) {
    player.setVelocityY(-1100);
    trampoline.bounced = true;
    setTimeout(() => trampoline.bounced = false, 1000);
  }
}

export const convertFallingBlockToPlatform = (fallingBlock, type) => {
  if (!fallingBlock.destroyed) {
    fallingBlock.body.immovable = true;
    fallingBlock.destroyed = true;
    fallingBlock.disableBody(true, true);
    fallingBlock.destroy(true);
    // platform.destroy();

    instance.tower.addBlockPx(fallingBlock.x, fallingBlock.y, type);
  }
}

export const fallingBlockFinalCollision = (platform, fallingBlock) => {
  fallingBlock.y = fallingBlock.y - 20;
  convertFallingBlockToPlatform(fallingBlock, 'brick');
};

export const fallingBlockHit = (bullet, fallingBlock) => {
  convertFallingBlockToPlatform(fallingBlock, 'frozen');

  if (!bullet.destroyed) {
    bullet.body.immovable = true;
    bullet.destroyed = true;
    bullet.disableBody(true, true);
    bullet.destroy(true);
  }
}

export const platformBlockHit = (bullet, block) => {
  convertBlockToStoneBlock(block);

  if (!bullet.destroyed) {
    bullet.body.immovable = true;
    bullet.destroyed = true;
    bullet.disableBody(true, true);
    bullet.destroy(true);
  }
}