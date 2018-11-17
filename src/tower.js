import instance from './instance'

const hitTrampoline = (player, trampoline) => {
    const isOnIt = player.x >= trampoline.x - 16 && player.x <= trampoline.x + 16;
    if (!trampoline.bounced && isOnIt) {
      player.setVelocityY(-1100);
      trampoline.bounced = true;
      setTimeout(() => trampoline.bounced = false, 1000);
    }
  }

export class Tower {
    constructor(game, worldHeight) {
        this.game = game;
        this.worldHeight = worldHeight;
        this.blocks = [];
        for (var i=0;i<=20;i++) {
            this.blocks[i] = [];
        }
    }

    onHitPlatform(player, platform) {
        if (platform.onHit !== null) {
            platform.onHit(player, platform);
        }
    }

    getBrick(posx, posy) {
        return this.blocks[posx][posy];
    }

    getBrickPx(x, y) {
        return this.blocks[this.snapX(x)][this.snapY(y)];
    }

    destroyBrick(brick) {
        if (brick.life <= 0) {
            brick.disableBody(true, true);
        }

        this.blocks[brick.posx][brick.posy] = null;
    }

    snapY(y) {
        return Math.floor((this.worldHeight - y - 32) / 64);
    }

    snapX(x) {
        return Math.floor((x - 32) / 64);
    }

    getPxlX(posx) {
        return (posx * 64) + 32;
    }

    getPxlY(posy) {
        return this.worldHeight - ((posy * 64) + 32);
    }

    initBlock(block, type) {
        var posx = block.x / 64;
        var posy = (block.y - 32) / 64;
        block.posx = posx;
        block.posy = posy;
        block.type = 'brick';

        block.type = type;

        block.life = 100;
        block.setInteractive();
        block.on('pointerdown', () => { console.log({"blockleft": block.body.x, blockTop: block.body.y, blockBottom: block.body.y + block.body.height}) });
    }

    addBlockPx(x, y, type) {
        this.addBrick(this.snapX(x), this.snapY(y), type)
    }

    addBlock(posx, posy, type) {
        if (type === 'brick') {
            this.addBrick(posx, posy);
        } else if (type === 'trampoline') {
            this.addTrampoline(posx, posy);
        } else if (type === 'frozen') {
            this.addFrozenBlock(posx, posy);
        }
    }

    addBrick(posx, posy) {
        const block = instance.platforms.create(this.getPxlX(posx), this.getPxlY(posy), 'brick');
        block.onHit = null;
        
        this.initBlock(block, 'brick');
    }

    addTrampoline(posx, posy) {
        const block = instance.platforms.create(this.getPxlX(posx), this.getPxlY(posy), 'brick-bounce');
        block.onHit = hitTrampoline;

        this.initBlock(block, 'trampoline');
    }

    addFrozenBlock(posx, posy) {
        const block = instance.platforms.create(this.getPxlX(posx), this.getPxlY(posy), 'brick');
        block.onHit = null;

        this.initBlock(block, 'frozen');
    }
}

