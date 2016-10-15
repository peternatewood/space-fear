Cursor = function() {
  this.x = 0;
  this.y = 0;
  this.color = WHITE;

  return this;
}
Cursor.prototype.move = function(event) {
  this.x = event.offsetX;
  this.y = event.offsetY;
};
Cursor.prototype.hoverOn = function() {
  this.color = CURSOR_HOVER;
};
Cursor.prototype.hoverOff = function() {
  this.color = WHITE;
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
