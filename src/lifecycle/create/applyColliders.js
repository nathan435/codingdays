import instance from '../../instance';
import {
  fallingBlockFinalCollision,
  hitPlatform,
  fallingBlockHit,
  platformBlockHit,
} from './collisionHandlers';

export default function applyColliders () {
  this.physics.add.collider(instance.platforms, instance.fallingBlocks, fallingBlockFinalCollision);
  this.physics.add.collider(instance.player, instance.fallingBlocks);
  this.physics.add.collider(instance.fallingBlocks, instance.fallingBlocks);
  this.physics.add.collider(instance.player, instance.platforms, hitPlatform);
  this.physics.add.collider(instance.bullets, instance.fallingBlocks, fallingBlockHit);
  this.physics.add.collider(instance.bullets, instance.platforms, platformBlockHit);
}