Keyboard = function(canvas) {
  this.canvas = canvas;
  this.context = canvas.getContext('2d');

  this.x = (this.canvas.width / 2) - (KEYBOARD_WIDTH / 2);
  this.y = this.canvas.height - KEYBOARD_HEIGHT;
  this.h = KEYBOARD_HEIGHT;
  this.w = KEYBOARD_WIDTH;

  this.keys = [];

  var x = this.x + KEY_MARGIN + KEY_LINE_WIDTH;
  var y = this.y + KEY_MARGIN + KEY_LINE_WIDTH;
  var keyWidth;

  KEYBOARD_KEYS.forEach(function(row, index) {
    x = this.x + KEY_MARGIN + KEY_LINE_WIDTH;
    row.forEach(function(key) {
      this.keys.push(new Key(key, x, y));

      x += this.keys[this.keys.length - 1].w + KEY_MARGIN + (2 * KEY_LINE_WIDTH);
    }, this);
    if (index < KEYBOARD_KEYS.length - 1) {
      y += MIN_KEY_SIZE + KEY_MARGIN + (2 * KEY_LINE_WIDTH);
    }
  }, this);

  x += MIN_KEY_SIZE + KEY_MARGIN + (2 * KEY_LINE_WIDTH);
  var w = MIN_KEY_SIZE;
  var h = (MIN_KEY_SIZE - KEY_MARGIN - (KEY_LINE_WIDTH * 2)) / 2;
  for(var index = 0; index < 4; index++) {
    this.keys.push(new Key('', x, y, w, h));
    if (index == 0) {
      y += (MIN_KEY_SIZE + KEY_MARGIN + (2 * KEY_LINE_WIDTH)) / 2;
      x -= MIN_KEY_SIZE + KEY_MARGIN + (2 * KEY_LINE_WIDTH);
    }
    else {
      x += MIN_KEY_SIZE + KEY_MARGIN + (2 * KEY_LINE_WIDTH);
    }
  }

  return this;
}
Keyboard.prototype.render = function() {
  this.context.fillStyle = KEY_DARK_BORDER_COLOR;
  this.context.fillRect(this.x, this.y, this.w, this.h);

  this.context.fillStyle = KEY_LIGHT_BORDER_COLOR;
  this.context.beginPath();
  this.context.moveTo(this.x, this.y);
  this.context.lineTo(this.x + this.w, this.y);
  this.context.lineTo(this.x + this.w - KEY_MARGIN, this.y + KEY_MARGIN);
  this.context.lineTo(this.x + KEY_MARGIN, this.y + this.h - KEY_MARGIN);
  this.context.lineTo(this.x, this.y + this.h);
  this.context.closePath();
  this.context.fill();

  this.context.clearRect(this.x + KEY_MARGIN, this.y + KEY_MARGIN, this.w - (2 * KEY_MARGIN), this.h - (2 * KEY_MARGIN));

  this.keys.forEach(function(key) {
    key.render(this.context);
  }, this);
};