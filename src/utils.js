function displayDialogue(text, onDisplayEnd) {
  const dialogueUI = document.getElementById('textbox-container');
  const dialogue = document.getElementById('dialogue');

  dialogueUI.style.display = 'block';

  let index = 0;

  let currentText = '';

  const intervalRef = setInterval(() => {
    if (index < text.length) {
      currentText += text[index];
      dialogue.innerHTML = currentText;
      index++;
      return;
    }

    clearInterval(intervalRef);
  }, 5);

  const closeBtn = document.getElementById('close');

  function onCloseBtnClick() {
    onDisplayEnd();
    dialogueUI.style.display = 'none';
    dialogue.innerHTML = '';
    clearInterval(intervalRef);
    closeBtn.removeEventListener('click', onCloseBtnClick);
    closeBtn.removeEventListener('keyup', onCloseBtnClick);
  }

  closeBtn.addEventListener('click', onCloseBtnClick);
  document.body.onkeyup = function (e) {
    if (e.key == ' ' || e.code == 'Space') {
      onCloseBtnClick();
    }
  };
}

// Player Movement:
const movePlayer = {
  upStart: function (player) {
    if (player.isInDialogue) return;
    player.move(0, -player.speed);
    if (player.curAnim() === 'walk-up') return;
    player.play('walk-up');
    player.direction = 'up';
  },
  upStop: function (player) {
    if (player.direction !== 'up') return;
    player.play('idle-up');
  },
  downStart: function (player) {
    if (player.isInDialogue) return;
    player.move(0, player.speed);
    if (player.curAnim() === 'walk-down') return;
    player.play('walk-down');
    player.direction = 'down';
  },
  downStop: function (player) {
    if (player.direction !== 'down') return;
    player.play('idle-down');
  },
  leftStart: function (player) {
    if (player.isInDialogue) return;
    player.move(-player.speed, 0);
    player.flipX = true;
    if (player.curAnim() !== 'walk-side') player.play('walk-side');
    player.direction = 'left';
    return;
  },
  leftStop: function (player) {
    if (player.direction !== 'left') return;
    player.play('idle-side');
  },
  rightStart: function (player) {
    if (player.isInDialogue) return;
    player.move(player.speed, 0);
    player.flipX = false;
    if (player.curAnim() !== 'walk-side') player.play('walk-side');
    player.direction = 'right';
    return;
  },
  rightStop: function (player) {
    if (player.direction !== 'right') return;
    player.play('idle-side');
  },
};

const handlePlayerMovement = (k, player) => {
  // keyboard nav
  k.onKeyDown('w', () => movePlayer.upStart(player));
  k.onKeyRelease('w', () => movePlayer.upStop(player));

  k.onKeyDown('s', () => movePlayer.downStart(player));
  k.onKeyRelease('s', () => movePlayer.downStop(player));

  k.onKeyDown('a', () => movePlayer.leftStart(player));
  k.onKeyRelease('a', () => movePlayer.leftStop(player));

  k.onKeyDown('d', () => movePlayer.rightStart(player));
  k.onKeyRelease('d', () => movePlayer.rightStop(player));

  // mouse nav
  k.onMouseDown((mouseBtn) => {
    if (mouseBtn !== 'left' || player.isInDialogue) return;

    const wworldMousePos = k.toWorld(k.mousePos());
    player.moveTo(wworldMousePos, player.speed);

    const mouseAngle = player.pos.angle(wworldMousePos);

    const lowerBound = 50;
    const upperBound = 125;

    if (
      mouseAngle > lowerBound &&
      mouseAngle < upperBound &&
      player.curAnim() !== 'walk-up'
    ) {
      player.play('walk-up');
      player.direction = 'up';
      return;
    }

    if (
      mouseAngle < -lowerBound &&
      mouseAngle > -upperBound &&
      player.curAnim() !== 'walk-down'
    ) {
      player.play('walk-down');
      player.direction = 'down';
      return;
    }

    if (Math.abs(mouseAngle) > upperBound) {
      player.flipX = false;
      if (player.curAnim() !== 'walk-side') player.play('walk-side');
      player.direction = 'right';
      return;
    }

    if (Math.abs(mouseAngle) < lowerBound) {
      player.flipX = true;
      if (player.curAnim() !== 'walk-side') player.play('walk-side');
      player.direction = 'left';
      return;
    }
  });

  k.onMouseRelease(() => {
    if (player.direction === 'up') {
      player.play('idle-up');
      return;
    }
    if (player.direction === 'down') {
      player.play('idle-down');
      return;
    }

    player.play('idle-side');
  });
};

// Manager Camera:
function setCamScale(k) {
  const resizeFactor = k.width() / k.height();
  if (resizeFactor < 1) {
    k.camScale(k.vec2(1));
    return;
  }

  k.camScale(k.vec2(1.5));
}

const handleCameraSetup = (k, player) => {
  setCamScale(k);

  k.onResize(() => {
    setCamScale(k);
  });

  k.onUpdate(() => {
    k.camPos(player.pos.x, player.pos.y - 50);
  });
};

export { displayDialogue, handlePlayerMovement, handleCameraSetup };
