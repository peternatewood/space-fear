Cursor = function() {
  this.x = 0;
  this.y = 0;
  this.color = WHITE;
  this.key;
  this.isHoldingKey = false;

  return this;
}
Cursor.prototype.move = function(event) {
  this.x = event.offsetX;
  this.y = event.offsetY;

  if (this.key && this.isHoldingKey) {
    this.key.updateMousePos(this);
  }
};
Cursor.prototype.hoverOn = function() {
  this.color = CURSOR_HOVER;
};
Cursor.prototype.hoverOff = function() {
  this.color = WHITE;
};
Cursor.prototype.pressKey = function() {
  if (this.key) {
    if (this.key.disabled && not(this.isHoldingKey)) {
      this.key.grab(this);
      this.isHoldingKey = true;
    }
    else {
      this.key.activate();
    }
    return this.key.getKey(false);
  }
};
Cursor.prototype.releaseKey = function() {
  if (this.key) {
    if (this.key.disabled && this.isHoldingKey) {
      this.key.release(this);
      this.isHoldingKey = false;
    }
    else {
      this.key.deactivate();
    }
    return this.key.getKey(true);
  }
};
Cursor.prototype.render = function(context) {
  context.fillStyle = this.color;

  var x = this.x;
  var y = this.y;

  context.beginPath();
  context.moveTo(x, y);
  context.lineTo(x += 13, y += 13);
  context.lineTo(x -= 8, y);
  context.lineTo(this.x, this.y + 19);
  context.closePath();

  context.fill();

  context.strokeStyle = BLACK;
  context.lineWidth = 2;
  context.stroke();
  context.strokeStyle = CURSOR_OUTLINE;
  context.lineWidth = 1;
  context.stroke();
};
