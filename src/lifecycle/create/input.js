import instance from '../../instance';

export default function input() {
  // Add debug keyboard controls
  this.input.keyboard.on('keydown', function (event) {
    if (event.key === 'f') {
      if (instance.player.flying) {
        instance.player.visualBody.setTexture('adventurer');
      } else {
        instance.player.visualBody.setTexture('ufo');
      }
      instance.player.flying = !instance.player.flying;
    }
  });

  this.input.on('gameobjectdown', (pointer, gameObject) => {
    if (instance.fallingBlocks.children.entries.indexOf(gameObject) > -1) {
      if (gameObject.clicked) gameObject.fallFast = true;
      gameObject.clicked = true;
      this.time.addEvent({ delay: 400, callback: () => {
          gameObject.clicked = false;
        }, callbackScope: this});
    }
    // gameObject.disableBody(true, true);
  });
}