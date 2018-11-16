import instance from './instance';

export class Weapon {
    constructor(spriteName, animation, cooldown, velocity, distance, game, player) {
        this.cooldown = cooldown;
        this.spriteName = spriteName;
        this.animation = animation;
        this.velocity = velocity;
        this.distance = distance;
        this.game = game;
        this.player = player;

        this.lastShot = 0;
    }

    canShoot() {
        return (this.game.time.now - this.lastShot) > this.cooldown;
    }

    shoot() {
        this.lastShot = this.game.time.now;
        
        let x = Math.round(Math.random() * 15) + 3;
        let bullet = instance.bullets.create(this.player.x, this.player.y, this.spriteName);
        bullet.body.allowGravity = false;
        bullet.body.immovable = false;
        bullet.body.moves = true;
        bullet.setVelocityY(-this.velocity);
        bullet.setDisplaySize(90, 90);
        bullet.angle = -90;
        bullet.anims.play(this.animation, true);

        if (this.distance > 0) {
            this.game.time.delayedCall(1000 * this.distance / this.velocity, this.maxDistanceHit, [bullet], this);
        }
    }

    maxDistanceHit(bullet) {
        if (!bullet.destroyed) {
            bullet.body.immovable = true;
            bullet.destroyed = true;
            bullet.disableBody(true, true);
            bullet.destroy(true);
        }
    }
}