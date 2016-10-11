Keyboard = function(canvas) {
  this.x = (canvas.width / 2) - (KEYBOARD_WIDTH / 2);
  this.y = canvas.height - KEYBOARD_HEIGHT;
  this.h = KEYBOARD_HEIGHT;
  this.w = KEYBOARD_WIDTH;

  this.keys = [];

  var x = this.x + KEY_MARGIN + KEYBOARD_EDGE_WIDTH;
  var y = this.y + KEY_MARGIN + KEYBOARD_EDGE_WIDTH;
  var keyWidth;

  KEYBOARD_KEYS.forEach(function(row, index) {
    x = this.x + KEY_MARGIN + KEYBOARD_EDGE_WIDTH;
    row.forEach(function(key) {
      this.keys.push(new Key(key, x, y));

      x += this.keys[this.keys.length - 1].w + KEY_MARGIN;
    }, this);
    if (index < KEYBOARD_KEYS.length - 1) {
      y += MIN_KEY_SIZE + KEY_MARGIN;
    }
  }, this);

  x += MIN_KEY_SIZE + KEY_MARGIN;
  var w = MIN_KEY_SIZE;
  var h = (MIN_KEY_SIZE - KEY_MARGIN) / 2;
  for(var index = 0; index < 4; index++) {
    this.keys.push(new Key('', x, y, w, h));
    if (index == 0) {
      y += (MIN_KEY_SIZE + KEY_MARGIN) / 2;
      x -= MIN_KEY_SIZE + KEY_MARGIN;
    }
    else {
      x += MIN_KEY_SIZE + KEY_MARGIN;
    }
  }
  return this;
}
Keyboard.prototype.render = function(context) {
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
  context.font = KEY_TEXT_SIZE + "px " + KEY_FONT;

  var grabbedKeys = [];
  this.keys.forEach(function(key) {
    if (key.onKeyboard) {
      key.render(context);
    }
    else {
      grabbedKeys.push(key);
    }
  }, this);

  grabbedKeys.forEach(function(key) {
    key.render(context);
  }, this);
};
