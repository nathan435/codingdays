import 'phaser';
import instance from '../instance';

const preload = function () {
    this.load.image('brick', 'assets/brick.png');
    this.load.image('brick-bounce', 'assets/brick-bounce.png');
    this.load.spritesheet('adventurer',
        'assets/adventurer.png',
        { frameWidth: 32, frameHeight: 32 }
    );

    this.load.spritesheet('dwarf',
        'assets/dwarf-sprite-sheet.png',
        { frameWidth: 32, frameHeight: 32 }
    );


    instance.cursors = this.input.keyboard.addKeys({
        up:Phaser.Input.Keyboard.KeyCodes.W,
        down:Phaser.Input.Keyboard.KeyCodes.S,
        left:Phaser.Input.Keyboard.KeyCodes.A,
        right:Phaser.Input.Keyboard.KeyCodes.D
    });

}

export default preload;
