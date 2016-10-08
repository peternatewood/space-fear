Monitor = function(canvas) {
  this.canvas = canvas;
  this.context = canvas.getContext('2d');

  this.x = (this.canvas.width / 2) - (MONITOR_WIDTH / 2);
  this.y = MONITOR_TOP;
  this.w = MONITOR_WIDTH;
  this.h = MONITOR_HEIGHT;

  this.terminal = new Terminal;
  this.powerButton = new Button(this.x + this.w + (2 * POWER_BUTTON_SIZE), this.y + this.h - POWER_BUTTON_SIZE);

  return this;
}
Monitor.prototype.render = function() {
  var x, y;
  // Render monitor
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

  this.context.fillStyle = BLACK;
  this.context.fillRect(this.x + MONITOR_MARGIN, this.y + MONITOR_MARGIN, this.w - (2 * MONITOR_MARGIN), this.h - (2 * MONITOR_MARGIN));

  // Render power button
  this.powerButton.render(this.context);

  // Render terminal
  this.context.fillStyle = this.terminal.color;
  this.context.fillText('> ' + this.terminal.buffer, this.x + MONITOR_MARGIN + MONITOR_PADDING, this.y + this.h - (MONITOR_MARGIN + MONITOR_PADDING));

  if (this.terminal.showCursor) {
    var cursor = ' _';
    for (var i = 0; i <= this.terminal.cursor; i++) {
      cursor = ' ' + cursor;
    }
    this.context.fillText(cursor, this.x + MONITOR_MARGIN + MONITOR_PADDING, this.y + this.h - (MONITOR_MARGIN + MONITOR_PADDING));
  }

  if (this.terminal.message.length > 0) {
    var message;
    for (var index = 0, row = 0; index < this.terminal.message.length && row < TERMINAL_MESSAGE_ROWS; index++) {
      var rawMessage = (this.terminal.message[this.terminal.message.length - index - 1]).split("\n");
      message = rawMessage;

      if (this.terminal.messageInterval && index == 0) {
        message = [];
        var charCount = 0;
        for (var line = 0; line < rawMessage.length; line++) {
          if (charCount + rawMessage[line].length > this.terminal.messageEnd) {
            message[line] = rawMessage[line].slice(0, this.terminal.messageEnd - charCount);
            break;
          }
          message[line] = rawMessage[line];
          charCount += rawMessage[line].length;
        }
      }

      for (var i = message.length - 1; i >= 0 && row < TERMINAL_MESSAGE_ROWS; i--) {
        this.context.fillText(message[message.length - 1 - i], this.x + MONITOR_MARGIN + MONITOR_PADDING, this.y + this.h - (MONITOR_MARGIN + MONITOR_PADDING) - ((TERMINAL_MESSAGE_ROWS - row) * KEY_TEXT_SIZE) - 2);
        row++;
      }
    }
  }

  // Render monitor glare
  x = this.x + this.w;
  y = this.y;
  var gradient = this.context.createRadialGradient(x, y, this.w / 3, x++, y--, 2);
  gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0.5)');
  this.context.fillStyle = gradient;
  this.context.fillRect(this.x + MONITOR_MARGIN + 4, this.y + MONITOR_MARGIN + 4, this.w - (2 * MONITOR_MARGIN) - 8, this.h - (2 * MONITOR_MARGIN) - 8);
};
