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
      case 'CapsLock': add = 46; break;
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
};
Key.prototype.getKey = function(isKeyUp) {
  if (not(this.disabled)) {
    if (this.key == 'CapsLock' && isKeyUp) {
      window.legacyModKeys.capslock = not(window.legacyModKeys.capslock);
      this.pressed = window.legacyModKeys.capslock;
    }
    else if (this.key != 'CapsLock') {
      this.pressed = not(isKeyUp);
    }
  }

  if (this.key.length == 1) {
    return window.legacyModKeys.capslock ? this.key : this.key.toLowerCase();
  }
  else if (this.key.length == 2) {
    return window.legacyModKeys.capslock ? this.key[0] : this.key[1];
  }
  else {
    return this.key;
  }
};
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
};
Key.prototype.updateMousePos = function(cursor) {
  this.mousex = cursor.x;
  this.mousey = cursor.y;
};
Key.prototype.grab = function(cursor) {
  this.updateMousePos(cursor);
  this.onKeyboard = false;
  this.moveInterval = setInterval(function() {
    var diffx = this.mousex - this.x - (this.w / 2);
    var diffy = this.mousey - this.y - (this.h / 2);
    this.x += (diffx / 4);
    this.y += (diffy / 4);
  }.bind(this), KEY_MOVE_DELAY);
};
Key.prototype.release = function(cursor) {
  clearInterval(this.moveInterval);
  if (this.detectMouseOver({offsetX: cursor.x, offsetY: cursor.y}, true)) {
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
  context.strokeStyle = KEY_TEXT_COLOR;
  context.lineWidth = 2;
  var x, y;
  if (this.key == 'left') {
    x = this.x + KEY_LINE_WIDTH + (MIN_KEY_SIZE / 2) - 4;
    y = this.y + KEY_LINE_WIDTH + 0.5;
    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(x -= 4, y += 4);
    context.lineTo(x += 4, y += 4);
    context.stroke();
  }
  else if (this.key == 'up') {
    x = this.x + KEY_LINE_WIDTH + (MIN_KEY_SIZE / 2) - 8;
    y = this.y + KEY_LINE_WIDTH + 5.5;
    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(x += 4, y -= 4);
    context.lineTo(x += 4, y += 4);
    context.stroke();
  }
  else if (this.key == 'right') {
    x = this.x + KEY_LINE_WIDTH + (MIN_KEY_SIZE / 2) - 4;
    y = this.y + KEY_LINE_WIDTH + 0.5;
    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(x += 4, y += 4);
    context.lineTo(x -= 4, y += 4);
    context.stroke();
  }
  else if (this.key == 'down') {
    x = this.x + KEY_LINE_WIDTH + (MIN_KEY_SIZE / 2) - 8;
    y = this.y + KEY_LINE_WIDTH + 3.5;
    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(x += 4, y += 4);
    context.lineTo(x += 4, y -= 4);
    context.stroke();
  }
  else if (this.key.length == 2) {
    context.lineWidth = 1;
    this.key.split('').forEach(function(char, index) {
      context.fillText(char, this.x + (MIN_KEY_SIZE / 4), this.y + ((index + 1) * KEY_TEXT_SIZE));
      context.strokeText(char, this.x + (MIN_KEY_SIZE / 4), this.y + ((index + 1) * KEY_TEXT_SIZE));
    }, this);
  }
  else {
    context.lineWidth = 1;
    context.fillText(this.key, this.x + (MIN_KEY_SIZE / 4), this.y + (MIN_KEY_SIZE / 2));
    context.strokeText(this.key, this.x + (MIN_KEY_SIZE / 4), this.y + (MIN_KEY_SIZE / 2));
  }
};
