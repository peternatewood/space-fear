Monitor = function(canvas) {
  this.x = (canvas.width / 2) - (MONITOR_WIDTH / 2);
  this.y = MONITOR_TOP;
  this.w = MONITOR_WIDTH;
  this.h = MONITOR_HEIGHT;

  this.terminal = new Terminal;
  this.powerButton = new Button(this.x + this.w + (2 * POWER_BUTTON_SIZE), this.y + this.h - POWER_BUTTON_SIZE);
  this.booting = 'none';
  this.bootStep = MONITOR_BOOT_STEPS;
  this.bootInterval;

  this.asciiInterval;

  return this;
}
Monitor.prototype.destroy = function() {
  this.powerButton.destroy();
  this.terminal.destroy();

  clearInterval(this.bootInterval);
  clearInterval(this.asciiInterval);
};
Monitor.prototype.allowInput = function() {
  return this.powerButton.state == 'on';
};
Monitor.prototype.releaseButton = function(event) {
  switch(this.powerButton.release(event)) {
    case 'on':
      this.renderBoot();
      break;
    case 'off':
      this.renderBootDown();
      break;
  }
};
Monitor.prototype.render = function(context) {
  var x, y;
  // Render monitor
  context.fillStyle = MONITOR_COLOR;
  context.fillRect(this.x, this.y, this.w, this.h);

  context.fillStyle = MONITOR_MEDIUM_COLOR;
  context.beginPath();
  context.moveTo(this.x, this.y);
  context.lineTo(this.x + this.w, this.y);
  context.lineTo(this.x + this.w - (2 * MONITOR_MARGIN), this.y + (2 * MONITOR_MARGIN));
  context.lineTo(this.x + (2 * MONITOR_MARGIN), this.y + this.h - (2 * MONITOR_MARGIN));
  context.lineTo(this.x, this.y + this.h);
  context.closePath();
  context.fill();

  context.fillStyle = MONITOR_DARK_COLOR;
  context.beginPath();
  context.moveTo(this.x, this.y);
  context.lineTo(this.x + this.w, this.y);
  context.lineTo(this.x + this.w - (2 * MONITOR_MARGIN), this.y + (2 * MONITOR_MARGIN));
  context.lineTo(this.x + (2 * MONITOR_MARGIN), this.y + (2 * MONITOR_MARGIN));
  context.closePath();
  context.fill();

  context.fillStyle = BLACK;
  context.fillRect(this.x + MONITOR_MARGIN, this.y + MONITOR_MARGIN, this.w - (2 * MONITOR_MARGIN), this.h - (2 * MONITOR_MARGIN));

  // Render power button
  this.powerButton.render(context);

  // Render terminal if monitor is on
  if (this.powerButton.state == 'on') {
    this.renderTerminal(context);
  }

  // Render boot flash
  if (this.booting == 'up'){
    x = this.x + MONITOR_MARGIN + 6;
    y = this.y + MONITOR_MARGIN + 6;
    w = this.w - (2 * MONITOR_MARGIN) - 12;
    h = this.h - (2 * MONITOR_MARGIN) - 12;
    var opacity = Math.round((this.bootStep / MONITOR_BOOT_STEPS) * 100) / 100;
    context.fillStyle = 'rgba(255, 255, 255, ' + opacity + ')';
    context.fillRect(x, y, w, h);
  }
  else if (this.booting == 'down') {
    h = (this.bootStep / MONITOR_BOOT_STEPS) * (this.h - (2 * MONITOR_MARGIN));

    x = this.x + MONITOR_MARGIN + 6;
    y = this.y + (this.h / 2);
    w = this.w - (2 * MONITOR_MARGIN) - 12;

    context.fillStyle = 'white';
    context.fillRect(x, y - (h / 2), w, h);
  }

  // Render monitor glare
  x = this.x + this.w;
  y = this.y;
  var gradient = context.createRadialGradient(x, y, this.w / 3, x++, y--, 2);
  gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0.5)');
  context.fillStyle = gradient;
  context.fillRect(this.x + MONITOR_MARGIN + 4, this.y + MONITOR_MARGIN + 4, this.w - (2 * MONITOR_MARGIN) - 8, this.h - (2 * MONITOR_MARGIN) - 8);
};
Monitor.prototype.renderTerminal = function(context) {
  context.fillStyle = this.terminal.color;
  context.fillText('> ' + this.terminal.buffer, this.x + MONITOR_MARGIN + MONITOR_PADDING, this.y + this.h - (MONITOR_MARGIN + MONITOR_PADDING));

  if (this.terminal.showCursor) {
    var cursor = ' _';
    for (var i = 0; i <= this.terminal.cursor; i++) {
      cursor = ' ' + cursor;
    }
    context.fillText(cursor, this.x + MONITOR_MARGIN + MONITOR_PADDING, this.y + this.h - (MONITOR_MARGIN + MONITOR_PADDING));
  }

  if (this.terminal.ascii.length > 0) {
    this.renderAscii(context);
  }
  else if (this.terminal.message.length > 0) {
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
        context.fillText(message[message.length - 1 - i], this.x + MONITOR_MARGIN + MONITOR_PADDING, this.y + this.h - (MONITOR_MARGIN + MONITOR_PADDING) - ((TERMINAL_MESSAGE_ROWS - row) * KEY_TEXT_SIZE) - 2);
        row++;
      }
    }
  }
};
Monitor.prototype.renderAscii = function(context) {
  context.fillStyle = this.terminal.color;
  var x = this.x + MONITOR_MARGIN + MONITOR_PADDING;
  var y = this.y + MONITOR_MARGIN + MONITOR_PADDING + 8;
  if (this.terminal.ascii instanceof Array) {
    this.terminal.ascii.forEach(function(line, index) {
      context.fillText(line, x, y);
      y += KEY_TEXT_SIZE;
    }, this);
  }
};
Monitor.prototype.startAsciiAnimation = function(name) {
  clearInterval(this.asciiInterval);
  this.ascii = ASCII[name].split("\n");
  this.asciiColor = BLACK;
  this.asciiInterval = setInterval(stepAscii.bind(this), 410);

  function stepAscii() {
    var color = this.asciiColor.toUpperCase();

    if (color == '#FFFFFF') {
      clearInterval(this.asciiInterval);
    }
    this.asciiColor = modHexColor(color, 2);
  }
};
Monitor.prototype.renderBoot = function() {
  clearInterval(this.bootInterval);
  this.booting = 'up';
  this.bootStep = MONITOR_BOOT_STEPS;
  this.bootInterval = setInterval(stepBootSequence.bind(this), 10);

  function stepBootSequence() {
    if (this.bootStep > MONITOR_BOOT_STEPS / 2) {
      this.bootStep -= 10;
    }
    else {
      this.bootStep -= 2;
    }

    if (this.bootStep <= 0) {
      this.booting = 'none';
      clearInterval(this.bootInterval);
    }
  }
};
Monitor.prototype.renderBootDown = function() {
  clearInterval(this.bootInterval);
  this.booting = 'down';
  this.bootStep = MONITOR_BOOT_STEPS;
  this.bootInterval = setInterval(stepBootDown.bind(this), 10);

  function stepBootDown() {
    if (this.bootStep > MONITOR_BOOT_STEPS / 8) {
      this.bootStep -= 40;
    }
    else {
      this.bootStep -= 5;
    }

    if (this.bootStep <= 0) {
      this.booting = 'none';
      clearInterval(this.bootInterval);
    }
  }
};
