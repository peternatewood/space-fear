Key = function(key, x, y, w, h) {
  this.key = key;
  this.x = x;
  this.y = y;
  this.w = w ? w : MIN_KEY_SIZE;
  this.h = h ? h : MIN_KEY_SIZE;

  this.keyboardx = x;
  this.keyboardy = y;
  this.mousex;
  this.mousey;

  this.pressed = false;
  this.disabled = false;
  this.onKeyboard = true;
  this.moveInterval;

  var getKeyWidth = function(chars) {
    add = 0;

    switch(chars) {
      case 'Backspace': add = 72; break;
      case 'Tab': add = 26; break;
      case '|\\': add = 46; break;
      case 'CapsLk': add = 46; break;
      case 'Enter': add = 64; break;
      case 'Shift': add = 74; break;
      case 'Ctrl': add = 18; break;
      case 'Meta': add = 18; break;
      case 'Alt': add = 18; break;
      case ' ': add = 172; break;
      default: break;
    }

    return MIN_KEY_SIZE + add;
  };
  this.w = getKeyWidth(key);

  return this;
}
Key.prototype.destroy = function() {
  clearInterval(this.moveInterval);
};
Key.prototype.activate = function() {
  if (this.disabled === false) {
    this.pressed = true;
  }
};
Key.prototype.deactivate = function() {
  this.pressed = false;
}
Key.prototype.detectMouseOver = function(event, isKeyboard) {
  var prefix = isKeyboard ? 'keyboard' : '';
  if (event.offsetX < this[prefix + 'x']) {
    return false;
  }
  else if (event.offsetX > (this[prefix + 'x'] + this.w)) {
    return false;
  }
  else if (event.offsetY < this[prefix + 'y']) {
    return false;
  }
  else if (event.offsetY > (this[prefix + 'y'] + this.h)) {
    return false;
  }
  return true;
}
Key.prototype.updateMousePos = function(event) {
  this.mousex = event.offsetX;
  this.mousey = event.offsetY;
};
Key.prototype.grab = function(event) {
  this.updateMousePos(event);
  this.onKeyboard = false;
  this.moveInterval = setInterval(function() {
    var diffx = this.mousex - this.x - (this.w / 2);
    var diffy = this.mousey - this.y - (this.h / 2);
    this.x += (diffx / 4);
    this.y += (diffy / 4);
  }.bind(this), KEY_MOVE_DELAY);
};
Key.prototype.release = function(event) {
  clearInterval(this.moveInterval);
  if (this.detectMouseOver(event, true)) {
    this.x = this.keyboardx;
    this.y = this.keyboardy;
    this.onKeyboard = true;
  }
  else {
    this.moveInterval = setInterval(function() {
      if (this.y + this.w >= 600) {
        clearInterval(this.moveInterval);
        this.y = 600 - this.h;
        return;
      }
      this.y += 4;
    }.bind(this), KEY_MOVE_DELAY);
  }
};
Key.prototype.render = function(context) {
  context.fillStyle = this.pressed ? KEY_LIGHT_BORDER_COLOR : KEY_DARK_BORDER_COLOR;
  context.fillRect(this.x, this.y, this.w, this.h);

  context.fillStyle = this.pressed ? KEY_DARK_BORDER_COLOR : KEY_LIGHT_BORDER_COLOR;
  context.beginPath();
  context.moveTo(this.x, this.y);
  context.lineTo(this.x + this.w, this.y);
  context.lineTo(this.x + this.w - KEY_LINE_WIDTH, this.y + KEY_LINE_WIDTH);
  context.lineTo(this.x + KEY_LINE_WIDTH, this.y + this.h - KEY_LINE_WIDTH);
  context.lineTo(this.x, this.y + this.h);
  context.closePath();
  context.fill();

  context.fillStyle = KEY_COLOR;
  context.fillRect(this.x + KEY_LINE_WIDTH, this.y + KEY_LINE_WIDTH, this.w - (2 * KEY_LINE_WIDTH), this.h - (2 * KEY_LINE_WIDTH));

  context.fillStyle = KEY_TEXT_COLOR;
  if (this.key.length == 2) {
    this.key.split('').forEach(function(char, index) {
      context.fillText(char, this.x + (MIN_KEY_SIZE / 4), this.y + ((index + 1) * KEY_TEXT_SIZE));
      context.strokeText(char, this.x + (MIN_KEY_SIZE / 4), this.y + ((index + 1) * KEY_TEXT_SIZE));
    }, this);
  }
  else {
    context.fillText(this.key, this.x + (MIN_KEY_SIZE / 4), this.y + (MIN_KEY_SIZE / 2));
    context.strokeText(this.key, this.x + (MIN_KEY_SIZE / 4), this.y + (MIN_KEY_SIZE / 2));
  }
};
