import {
  displayDialogue,
  handleCameraSetup,
  handlePlayerMovement,
} from './utils';
import { dialogueData, scaleFactor } from './constants';

function home_scene(k) {
  k.scene('home', async () => {
    const mapData = await (await fetch('./map.json')).json();
    const layers = mapData.layers;

    const map = k.add([k.sprite('map'), k.pos(0), k.scale(scaleFactor)]);

    const player = k.make([
      k.sprite('spritesheet', { anim: 'idle-down' }),
      k.area({ shape: new k.Rect(k.vec2(0, 3), 10, 10) }),
      k.body(),
      k.anchor('center'),
      k.pos(),
      k.scale(scaleFactor),
      {
        speed: 250,
        direction: 'down',
        isInDialogue: false,
      },
      'player',
    ]);

    for (const layer of layers) {
      if (layer.name === 'boundaries') {
        for (const boundary of layer.objects) {
          map.add([
            k.area({
              shape: new k.Rect(k.vec2(0), boundary.width, boundary.height),
            }),
            k.body({ isStatic: true }),
            k.pos(boundary.x, boundary.y),
            boundary.name,
          ]);

          if (boundary.name) {
            player.onCollide(boundary.name, () => {
              if (boundary.name === 'radio') {
                spotify.style.display = 'block';
              } else if (spotify.style.display !== 'none') {
                spotify.style.display = 'none';
              }
              player.isInDialogue = true;
              displayDialogue(dialogueData[boundary.name], () => {
                game.focus();
                player.isInDialogue = false;
              });
            });
          }
        }
        continue;
      }

      if (layer.name === 'spawnpoints') {
        for (const entity of layer.objects) {
          if (entity.name === 'player') {
            player.pos = k.vec2(
              (map.pos.x + entity.x) * scaleFactor,
              (map.pos.y + entity.y) * scaleFactor
            );
            k.add(player);
            continue;
          }
        }
      }
    }

    handleCameraSetup(k, player);
    handlePlayerMovement(k, player);
  });
}

export const createScenes = {
  home: home_scene,
};
