Terminal = function() {
  this.buffer = '';
  this.cursor = 0;
  this.showCursor = true;
  this.bufferLog = [];
  this.logOffset = 0;
  this.blinkInterval = 0;
  this.message = [];
  this.color = DEFAULT_TERMINAL_COLOR;

  this.restartCursorBlink();

  document.addEventListener('keydown', function(event) {
    this.restartCursorBlink();
    // Only allow printable characters
    if (/^.$/.test(event.key) && this.cursor < TERMINAL_MESSAGE_CHARS) {
      this.buffer += event.key;
      this.cursor += 1;
    }
    else if (event.key == 'Backspace' && this.cursor > 0) {
      var before = this.buffer.slice(0, this.cursor - 1);
      var after = this.buffer.slice(this.cursor, this.buffer.length);

      this.buffer = before + after;
      this.cursor -= 1;
    }
    else if (event.key == 'Delete' && this.cursor < this.buffer.length) {
      var before = this.buffer.slice(0, this.cursor);
      var after = this.buffer.slice(this.cursor + 1, this.buffer.length);

      this.buffer = before + after;
    }
    else if (event.key == 'Enter' && this.buffer) {
      this.readBuffer();
    }
    else if (event.key == 'ArrowLeft' && this.cursor > 0) {
      this.cursor -= 1;
    }
    else if (event.key == 'ArrowRight' && this.cursor < this.buffer.length) {
      this.cursor += 1;
    }
    else if (event.key == 'ArrowDown' && this.logOffset > 0) {
      this.logOffset -= 1;
      if (this.logOffset > 0) {
        this.buffer = this.bufferLog[this.logOffset - 1];
        this.cursor = this.buffer.length;
      }
      else {
        this.clearBuffer();
      }
    }
    else if (event.key == 'ArrowUp' && this.logOffset < this.bufferLog.length) {
      this.logOffset += 1;
      this.buffer = this.bufferLog[this.logOffset - 1];
      this.cursor = this.buffer.length;
    }
  }.bind(this));

  return this;
}
Terminal.prototype.clearBuffer = function() {
  this.buffer = '';
  this.cursor = 0;
};
Terminal.prototype.readBuffer = function() {
  this.bufferLog.unshift(this.buffer);
  this.processCommands();
  this.clearBuffer();
};
Terminal.prototype.restartCursorBlink = function() {
  this.showCursor = true;
  clearInterval(this.blinkInterval);
  this.blinkInterval = setInterval(function() {this.showCursor = ! this.showCursor}.bind(this), CURSOR_BLINK_DELAY);
};
Terminal.prototype.processCommands = function() {
  var commands = this.bufferLog[0].split(' ');

  switch(commands[0]) {
    case 'help':
      if (commands[1] && VALID_COMMANDS[commands[1].toLowerCase()]) {
        this.message.push(commands[1].toLowerCase() + ': ' + VALID_COMMANDS[commands[1].toLowerCase()]);
      }
      else {
        var commands = [];
        for (var prop in VALID_COMMANDS) {
          if (VALID_COMMANDS.hasOwnProperty(prop)) {
            commands.push(prop);
          }
        }
        this.message = this.message.concat(commands);
      }
      break;
    case 'history':
      if (! isNaN(commands[1])) {
        for (var i = commands[1] < TERMINAL_MESSAGE_ROWS ? commands[1] : TERMINAL_MESSAGE_ROWS; i >= 0; i--) {
          if (this.bufferLog[i]) {
            this.message.push(this.bufferLog[i]);
          }
        }
      }
      else {
        this.message.push('Please enter a number: E.G. history 2');
      }
      break;
    case 'color':
      var message = 'Valid options include: default, red, green, blue';
      if (/[a-zA-Z]+/.test(commands[1])) {
        this.color = commands[1] == 'default' || commands[1] == 'black' ? DEFAULT_TERMINAL_COLOR : commands[1];
        message = 'Color: ' + commands[1];
      }
      this.message.push(message);
      break;
    default:
      this.message.push(DEFAULT_MESSAGE);
      break;
  }
};
