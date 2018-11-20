import { observable } from 'mobx';

export default observable({
  player: {
    health: 100,
  },
  ressources: {
    stone: 0,
  }
})