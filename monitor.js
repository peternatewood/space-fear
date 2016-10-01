Monitor = function(canvas) {
  this.canvas = canvas;
  this.context = canvas.getContext('2d');

  return this;
}
Monitor.prototype.render = function() {
  var x = CONSOLE_MARGIN;
  var y = CONSOLE_MARGIN;
  var w = this.canvas.width - (2 * CONSOLE_MARGIN);
  var h = (w * 4) / 3;

  this.context.fillStyle = KEY_COLOR;
  this.context.fillRect(x, y, w, h);
  this.context.clearRect(x + CONSOLE_PADDING, y + CONSOLE_PADDING, w - (2 * CONSOLE_PADDING), h - (2 * CONSOLE_PADDING));

  // this.context.beginPath();
  // this.context.moveTo(CONSOLE_MARGIN, CONSOLE_MARGIN);
  // this.context.lineTo();
  // this.context.closePath();
  // this.context.fill();
};
