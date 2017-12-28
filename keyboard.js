Keyboard = function(canvas) {
  this.x = (canvas.width / 2) - (KEYBOARD_WIDTH / 2);
  this.y = canvas.height - KEYBOARD_HEIGHT;
  this.h = KEYBOARD_HEIGHT;
  this.w = KEYBOARD_WIDTH;

  this.capslock = false;
  this.keys = [];

  var x = this.x + KEY_MARGIN + KEYBOARD_EDGE_WIDTH;
  var y = this.y + KEY_MARGIN + KEYBOARD_EDGE_WIDTH;
  var keyWidth;

  var keyCount = 0;
  for (var r = 0; r < KEYBOARD_KEYS.length; r++) {
    for (var c = 0; c < KEYBOARD_KEYS[r].length; c++) {
      keyCount++;
      this.keys.push(new Key(KEYBOARD_KEYS[r][c], x, y));
      x += this.keys[this.keys.length - 1].w + KEY_MARGIN;
    }
    if (r < KEYBOARD_KEYS.length - 1) {
      x = this.x + KEY_MARGIN + KEYBOARD_EDGE_WIDTH;
      y += MIN_KEY_SIZE + KEY_MARGIN;
    }
  }

  x += MIN_KEY_SIZE + KEY_MARGIN;
  var w = MIN_KEY_SIZE;
  var h = (MIN_KEY_SIZE - KEY_MARGIN) / 2;
  var arrows = ['up', 'left', 'down', 'right'];
  for (var i = 0; i < 4; i++) {
    this.keys.push(new Key(arrows[i], x, y, w, h));
    if (i == 0) {
      y += (MIN_KEY_SIZE + KEY_MARGIN) / 2;
      x -= MIN_KEY_SIZE + KEY_MARGIN;
    }
    else {
      x += MIN_KEY_SIZE + KEY_MARGIN;
    }
  }

  this.keyCount = keyCount + 4;

  return this;
}
Keyboard.prototype.render = function() {
  var edge = KEYBOARD_EDGE_WIDTH;

  context.fillStyle = KEY_DARK_BORDER_COLOR;
  context.fillRect(this.x, this.y, this.w, this.h);

  context.fillStyle = KEY_LIGHT_BORDER_COLOR;
  context.beginPath();
  context.moveTo(this.x, this.y);
  context.lineTo(this.x + this.w, this.y);
  context.lineTo(this.x + this.w - edge, this.y + edge);
  context.lineTo(this.x + edge, this.y + this.h - edge);
  context.lineTo(this.x, this.y + this.h);
  context.closePath();
  context.fill();

  context.fillStyle = BLACK;
  context.fillRect(this.x + edge, this.y + edge, this.w - (2 * edge), this.h - (2 * edge));

  context.fillStyle = KEY_TEXT_COLOR;
  context.strokeStyle = KEY_TEXT_COLOR;
  context.lineWidth = 0.5;
  context.font = KEY_FONT;

  var disabledKeys = new Array(this.keyCount);
  for (var i = 0; i < this.keyCount; i++) {
    var key = this.keys[i];
    disabledKeys[i] = !key.onKeyboard;
    if (key.onKeyboard) {
      key.render();
    }
  }

  // Render these later so they overlay the enabled keys
  for (var i = 0; i < this.keyCount; i++) {
    if (disabledKeys[i]) {
      this.keys[i].render();
    }
  }
};
