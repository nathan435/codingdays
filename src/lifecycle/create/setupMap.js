import instance from '../../instance';

export default function () {
  for (let i = 2; i < 18; i++) {
    instance.tower.addBlock(i, 0, 'brick');
  }

  instance.tower.addBlock(2, 1, 'brick');
  instance.tower.addBlock(3, 1, 'trampoline');
  instance.tower.addBlock(4, 1, 'brick');

  instance.tower.addBlock(5, 1, 'brick');
  instance.tower.addBlock(5, 2, 'brick');
  instance.tower.addBlock(5, 3, 'brick');
  instance.tower.addBlock(5, 4, 'brick');
  instance.tower.addBlock(5, 5, 'brick');
}