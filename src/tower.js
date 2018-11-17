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
        this.revision = 1;

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
        if (posx < 0 || posy < 0) {
            return null;
        }

        var blockColumn = this.blocks[posx];
        if (blockColumn[posy] === undefined) {
            return null;
        }
        
        return this.blocks[posx][posy];
    }

    getBrickPx(x, y) {
        return getBrick(this.snapX(x), this.snapY(y));
    }

    destroyBrick(brick) {
        brick.disableBody(true, true);
        brick.removed = true;
        this.blocks[brick.posx][brick.posy] = null;

        var r = this.revision + 1;
        this.revision = r;

        var bricksToCheck = [];
        var allBlocks = instance.platforms.children.entries;

        for (var i = 0; i < allBlocks.length; i++) {
            var block = allBlocks[i];
            if (block.removed) {
                continue;
            }

            if (block.type === 'frozen') {
                bricksToCheck.push(block);
                block.revision = r;
            } else if (block.posy === 0) {
                bricksToCheck.push(block);
                block.revision = r;
            }
        }

        while (bricksToCheck.length > 0) {
            var brickToCheck = bricksToCheck.pop();

            var nextBrick = this.getBrick(brickToCheck.posx + 1, brickToCheck.posy);
            if (nextBrick !== null && nextBrick.revision !== r) {
                nextBrick.revision = r;
                bricksToCheck.push(nextBrick);
            }

            var nextBrick = this.getBrick(brickToCheck.posx - 1, brickToCheck.posy);
            if (nextBrick !== null && nextBrick.revision !== r) {
                nextBrick.revision = r;
                bricksToCheck.push(nextBrick);
            }

            var nextBrick = this.getBrick(brickToCheck.posx, brickToCheck.posy + 1);
            if (nextBrick !== null && nextBrick.revision !== r) {
                nextBrick.revision = r;
                bricksToCheck.push(nextBrick);
            }

            var nextBrick = this.getBrick(brickToCheck.posx, brickToCheck.posy - 1);
            if (nextBrick !== null && nextBrick.revision !== r) {
                nextBrick.revision = r;
                bricksToCheck.push(nextBrick);
            }
        }
        
        
        for (var i = 0; i < allBlocks.length; i++) {
            var block = allBlocks[i];
            if (!block.removed && block.revision !== r) {
               this.convertBlockToFallingBlock(block);
            }
        }
    }

    convertBlockToFallingBlock(block) {
        block.disableBody(true, true);
        block.removed = true;
        this.addFallingBlock(block.x, block.y);
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
        var posx = this.snapX(block.x);
        var posy = this.snapY(block.y);
        block.posx = posx;
        block.posy = posy;
        block.type = type;
        block.revision = 0;
        block.removed = false;

        block.life = 100;
        block.setInteractive();
        block.on('pointerdown', () => { console.log({"blockleft": block.body.x, blockTop: block.body.y, blockBottom: block.body.y + block.body.height}) });
    }

    addFallingBlock (x, y) {
        let block = instance.fallingBlocks.create(x, y, 'brick');
        block.alpha = 0.3;
        block.tint = 0x000000;
        block.body.allowGravity = false;
        block.body.immovable = true;
        block.body.moves = false;
        block.setInteractive();
        this.game.input.setDraggable(block);
        this.game.input.on('drag', function (pointer, gameObject, dragX, dragY) {
          gameObject.x = Math.round(dragX / 64) * 64 +32;
        });
    }

    addBlockPx(x, y, type) {
        this.addBlock(this.snapX(x), this.snapY(y), type)
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
        const block = instance.platforms.create(this.getPxlX(posx), this.getPxlY(posy), 'brick-frozen');
        block.onHit = null;

        this.initBlock(block, 'frozen');
    }
}

