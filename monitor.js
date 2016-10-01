Monitor = function(canvas) {
  this.canvas = canvas;
  this.context = canvas.getContext('2d');

  this.x = (this.canvas.width / 2) - (MONITOR_WIDTH / 2);
  this.y = MONITOR_TOP;
  this.w = MONITOR_WIDTH;
  this.h = MONITOR_HEIGHT;

  this.terminal = new Terminal;

  return this;
}
Monitor.prototype.render = function() {
  this.context.fillStyle = MONITOR_COLOR;
  this.context.fillRect(this.x, this.y, this.w, this.h);

  this.context.fillStyle = MONITOR_MEDIUM_COLOR;
  this.context.beginPath();
  this.context.moveTo(this.x, this.y);
  this.context.lineTo(this.x + this.w, this.y);
  this.context.lineTo(this.x + this.w - (2 * MONITOR_MARGIN), this.y + (2 * MONITOR_MARGIN));
  this.context.lineTo(this.x + (2 * MONITOR_MARGIN), this.y + this.h - (2 * MONITOR_MARGIN));
  this.context.lineTo(this.x, this.y + this.h);
  this.context.closePath();
  this.context.fill();

  this.context.fillStyle = MONITOR_DARK_COLOR;
  this.context.beginPath();
  this.context.moveTo(this.x, this.y);
  this.context.lineTo(this.x + this.w, this.y);
  this.context.lineTo(this.x + this.w - (2 * MONITOR_MARGIN), this.y + (2 * MONITOR_MARGIN));
  this.context.lineTo(this.x + (2 * MONITOR_MARGIN), this.y + (2 * MONITOR_MARGIN));
  this.context.closePath();
  this.context.fill();

  this.context.clearRect(this.x + MONITOR_MARGIN, this.y + MONITOR_MARGIN, this.w - (2 * MONITOR_MARGIN), this.h - (2 * MONITOR_MARGIN));

  this.context.fillStyle = MONITOR_TEXT_COLOR;
  this.context.fillText('> ' + this.terminal.buffer, this.x + MONITOR_MARGIN + MONITOR_PADDING, this.y + this.h - (MONITOR_MARGIN + MONITOR_PADDING));

  if (this.terminal.showCursor) {
    var cursor = ' _';
    for (var i = 0; i <= this.terminal.cursor; i++) {
      cursor = ' ' + cursor;
    }
    this.context.fillText(cursor, this.x + MONITOR_MARGIN + MONITOR_PADDING, this.y + this.h - (MONITOR_MARGIN + MONITOR_PADDING));
  }

  if (this.terminal.message.length > 0) {
    for (var i = 0; i < this.terminal.message.length; i++) {
      this.context.fillText(this.terminal.message[this.terminal.message.length - i - 1], this.x + MONITOR_MARGIN + MONITOR_PADDING, this.y + this.h - (MONITOR_MARGIN + MONITOR_PADDING) - ((i + 1) * KEY_TEXT_SIZE));
    }
  }
};
