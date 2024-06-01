import { k } from './kaboomCtx';
import { createScenes } from './scenes';

const spotify = document.getElementById('spotify');
const game = document.getElementById('game');

k.loadSprite('spritesheet', './spritesheet.png', {
  sliceX: 39,
  sliceY: 31,
  anims: {
    'idle-down': 936,
    'walk-down': { from: 936, to: 939, loop: true, speed: 8 },
    'idle-side': 975,
    'walk-side': { from: 975, to: 978, loop: true, speed: 8 },
    'idle-up': 1014,
    'walk-up': { from: 1014, to: 1017, loop: true, speed: 8 },
  },
});

k.loadSprite('map', './map.png');

k.setBackground(k.Color.fromHex('#222222'));

createScenes.home(k);

k.go('home');
