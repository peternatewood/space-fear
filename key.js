Key = function(key, x, y, w, h) {
  this.key = key;
  this.x = x;
  this.y = y;
  this.w = w ? w : MIN_KEY_SIZE;
  this.h = h ? h : MIN_KEY_SIZE;

  var getKeyWidth = function(chars) {
    add = 0;

    switch(chars.split("\n")[0]) {
      case 'Backspace': add = 72; break;
      case 'Tab': add = 26; break;
      case '|': add = 46; break;
      case 'CapsLk': add = 48; break;
      case 'Enter': add = 76; break;
      case 'Shift': add = 88; break;
      case 'Ctrl': add = 24; break;
      case 'Meta': add = 24; break;
      case 'Alt': add = 24; break;
      case 'Space': add = 212; break;
      default: break;
    }

    return MIN_KEY_SIZE + add;
  };
  this.w = getKeyWidth(key);

  return this;
}
Key.prototype.render = function(context) {
  context.fillStyle = KEY_DARK_BORDER_COLOR;
  context.fillRect(this.x, this.y, this.w + (2 * KEY_LINE_WIDTH), this.h + (2 * KEY_LINE_WIDTH));

  context.fillStyle = KEY_LIGHT_BORDER_COLOR;
  context.beginPath();
  context.moveTo(this.x, this.y);
  context.lineTo(this.x + this.w + (2 * KEY_LINE_WIDTH), this.y);
  context.lineTo(this.x + this.w + KEY_LINE_WIDTH, this.y + KEY_LINE_WIDTH);
  context.lineTo(this.x + KEY_LINE_WIDTH, this.y + this.h + KEY_LINE_WIDTH);
  context.lineTo(this.x, this.y + this.h + (2 * KEY_LINE_WIDTH));
  context.closePath();
  context.fill();

  context.fillStyle = KEY_COLOR;
  context.fillRect(this.x + KEY_LINE_WIDTH, this.y + KEY_LINE_WIDTH, this.w, this.h);

  var keyLetter = this.key.length > 0 ? this.key : this.key.toUpperCase();
  context.fillStyle = KEY_TEXT_COLOR;
  context.font = KEY_TEXT_SIZE + "px " + KEY_FONT;
  context.fillText(keyLetter, this.x + (MIN_KEY_SIZE / 4), this.y + (MIN_KEY_SIZE / 2) + (KEY_TEXT_SIZE / 2));
};
