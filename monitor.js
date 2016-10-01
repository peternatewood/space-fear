Monitor = function(canvas) {
  this.canvas = canvas;
  this.context = canvas.getContext('2d');

  return this;
}
Monitor.prototype.render = function() {
  var x = (this.canvas.width / 2) - (MONITOR_WIDTH / 2);
  var y = MONITOR_TOP;
  var w = MONITOR_WIDTH;
  var h = MONITOR_HEIGHT;

  this.context.fillStyle = MONITOR_COLOR;
  this.context.fillRect(x, y, w, h);

  this.context.fillStyle = MONITOR_MEDIUM_COLOR;
  this.context.beginPath();
  this.context.moveTo(x, y);
  this.context.lineTo(x + w, y);
  this.context.lineTo(x + w - (2 * MONITOR_MARGIN), y + (2 * MONITOR_MARGIN));
  this.context.lineTo(x + (2 * MONITOR_MARGIN), y + h - (2 * MONITOR_MARGIN));
  this.context.lineTo(x, y + h);
  this.context.closePath();
  this.context.fill();

  this.context.fillStyle = MONITOR_DARK_COLOR;
  this.context.beginPath();
  this.context.moveTo(x, y);
  this.context.lineTo(x + w, y);
  this.context.lineTo(x + w - (2 * MONITOR_MARGIN), y + (2 * MONITOR_MARGIN));
  this.context.lineTo(x + (2 * MONITOR_MARGIN), y + (2 * MONITOR_MARGIN));
  // this.context.lineTo(x, y);
  this.context.closePath();
  this.context.fill();

  this.context.clearRect(x + MONITOR_MARGIN, y + MONITOR_MARGIN, w - (2 * MONITOR_MARGIN), h - (2 * MONITOR_MARGIN));
};
