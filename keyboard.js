var keyboard = {
  x: (canvas.width / 2) - (KEYBOARD_WIDTH / 2),
  y: canvas.height - KEYBOARD_HEIGHT,
  h: KEYBOARD_HEIGHT,
  w: KEYBOARD_WIDTH,
  capslock: false,
  keyCount: KEYBOARD_KEYS.length,
};

keyboard.keys = new Array(keyboard.keyCount);
for (var i = 0; i < keyboard.keyCount; i++) {
  keyboard.keys[i] = new Key(KEYBOARD_KEYS[i]);
}

function renderKeyboard() {
  var edge = KEYBOARD_EDGE_WIDTH;

  context.fillStyle = KEY_DARK_BORDER_COLOR;
  context.fillRect(keyboard.x, keyboard.y, keyboard.w, keyboard.h);

  context.fillStyle = KEY_LIGHT_BORDER_COLOR;
  context.beginPath();
  context.moveTo(keyboard.x, keyboard.y);
  context.lineTo(keyboard.x + keyboard.w, keyboard.y);
  context.lineTo(keyboard.x + keyboard.w - edge, keyboard.y + edge);
  context.lineTo(keyboard.x + edge, keyboard.y + keyboard.h - edge);
  context.lineTo(keyboard.x, keyboard.y + keyboard.h);
  context.closePath();
  context.fill();

  context.fillStyle = BLACK;
  context.fillRect(keyboard.x + edge, keyboard.y + edge, keyboard.w - (2 * edge), keyboard.h - (2 * edge));

  context.fillStyle = KEY_TEXT_COLOR;
  context.strokeStyle = KEY_TEXT_COLOR;
  context.lineWidth = 0.5;
  context.font = KEY_FONT;

  var disabledKeys = new Array(keyboard.keyCount);
  for (var i = 0; i < keyboard.keyCount; i++) {
    var key = keyboard.keys[i];
    disabledKeys[i] = !key.onKeyboard;
    if (key.onKeyboard) {
      key.render();
    }
  }

  // Render these later so they overlay the enabled keys
  for (var i = 0; i < keyboard.keyCount; i++) {
    if (disabledKeys[i]) {
      keyboard.keys[i].render();
    }
  }
};
