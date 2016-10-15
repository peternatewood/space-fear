Terminal = function() {
  this.buffer = '';
  this.cursor = 0;
  this.showCursor = true;
  this.allowInput = true;
  this.bufferLog = [];
  this.logOffset = 0;
  this.blinkInterval = 0;
  this.scene = 0;

  this.message = [SCENE_MESSAGES[0]];
  this.messageLog = [SCENE_MESSAGES[0]];
  this.messageEnd = 0;
  this.messageInterval = false;
  this.color = WHITE;
  this.ascii = [];
  this.inventory = [];

  this.computer = new Computer();
  this.save = new Save();
  this.player = new Actor();

  this.restartCursorBlink();

  this.rooms = {}
  ROOMS.forEach(function(room) {
    this.rooms[room.name] = new Room(room.messages, room.items, room.adjacents);
  }, this);

  return this;
}
Terminal.prototype.destroy = function() {
  clearInterval(this.blinkInterval);
  clearInterval(this.messageInterval);
};
Terminal.prototype.sceneMessage = function() {
  return SCENE_MESSAGES[this.scene];
};
Terminal.prototype.handleInput = function(event) {
  if (this.allowInput) {
    this.restartCursorBlink();
    // Only allow printable characters
    if (/^.$/.test(event.key) && this.cursor < TERMINAL_MESSAGE_CHARS) {
      this.buffer = this.buffer.slice(0, this.cursor) + event.key + this.buffer.slice(this.cursor);
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
    else if (event.key == 'Enter') {
      if (this.messageInterval) {
        this.skipMessage();
      }

      if (this.ascii.length > 0) this.ascii = [];
      if (this.buffer) this.readBuffer();
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
  }
};
Terminal.prototype.disableInput = function() {
  this.allowInput = false;
  this.disableCursor();
};
Terminal.prototype.enableInput = function() {
  this.allowInput = true;
  this.restartCursorBlink();
};
Terminal.prototype.clearBuffer = function() {
  this.buffer = '';
  this.cursor = 0;
};
Terminal.prototype.readBuffer = function() {
  this.bufferLog.unshift(this.buffer);
  this.processCommands();
  this.clearBuffer();
};
Terminal.prototype.startMessage = function() {
  this.messageEnd = 0;
  var messageLength = 0;
  this.message[this.message.length - 1].split("\n").forEach(function(msg) {
    messageLength += msg.length;
  });

  this.messageInterval = setInterval(function() {
    this.messageEnd++;
    if (this.messageEnd > messageLength) {
      this.skipMessage();
    }
  }.bind(this), MESSAGE_DELAY);
};
Terminal.prototype.skipMessage = function() {
  clearInterval(this.messageInterval);
  this.messageInterval = false;
};
Terminal.prototype.disableCursor = function() {
  this.showCursor = false;
  clearInterval(this.blinkInterval);
};
Terminal.prototype.restartCursorBlink = function() {
  this.showCursor = true;
  clearInterval(this.blinkInterval);
  this.blinkInterval = setInterval(function() {this.showCursor = ! this.showCursor}.bind(this), CURSOR_BLINK_DELAY);
};
Terminal.prototype.pushMessage = function(rawMessage) {
  var message = rawMessage;
  if (message instanceof Array) {
    message = rawMessage.join("\n");
  }
  else if (rawMessage.length > TERMINAL_MESSAGE_CHARS) {
    var words = rawMessage.split(' ');
    rawMessage = [words[0]];
    for (var i = 1, j = 0; i < words.length; i++) {
      if ((rawMessage[j] + ' ' + words[i]).length > TERMINAL_MESSAGE_CHARS) {
        rawMessage[++j] = words[i];
      }
      else {
        rawMessage[j] += ' ' + words[i];
      }
    }
    message = rawMessage.join("\n");
  }

  if (this.message.length > TERMINAL_MESSAGE_ROWS) {
    this.message = this.message.slice(1);
  }

  this.message.push(message);
  this.messageLog.push(message);
  this.startMessage();
};
Terminal.prototype.processCommands = function() {
  switch(this.scene) {
    case 0:
      var name = this.bufferLog[0].trim();
      if (/\S+/.test(name)) {
        this.save.save({name: name});
        this.scene = 1;
        this.rooms.hibernation.items['bed 3'] = this.rooms.hibernation.items['bed 3'].replace('{{name}}', name);
        this.pushMessage('Welcome to Space Fear, ' + name + '. ' + this.sceneMessage());
      }
      else {
        this.pushMessage(this.sceneMessage());
      }
      break;

    default:
      var commands = this.bufferLog[0].split(' ');
      switch(getCommand(commands[0])) {
        case 'clear':
          this.message = [];
          break;

        case 'close':
          var name = commands.slice(1).join(' ');
          if (this.rooms[name]) {
            this.rooms[name].closeDoor(this.player.room);
          }
          this.pushMessage(this.rooms[this.player.room].closeDoor(name));
          console.log(this.rooms);
          break;

        case 'color':
          var message = 'Valid options include: default, crimson, lime, slateblue';
          if (VALID_COLORS.includes(commands[1])) {
            this.color = commands[1] == 'default' ? DEFAULT_TERMINAL_COLOR : commands[1];
            message = 'Color: ' + commands[1];
          }
          this.pushMessage(message);
          break;

        case 'computer':
          var question = commands.slice(1).join(' ');
          this.pushMessage(this.computer.answerQuestion(question));
          break;

        case 'help':
          var commandName = getCommand(commands[1]);
          if (commands[1] && VALID_COMMANDS[commandName]) {
            this.pushMessage(VALID_COMMANDS[commandName]);
          }
          else {
            var commands = [];
            for (var prop in VALID_COMMANDS) {
              if (VALID_COMMANDS.hasOwnProperty(prop)) {
                commands.push(prop);
              }
            }
            this.pushMessage(commands.join(', '));
          }
          break;

        case 'history':
          if (! isNaN(commands[1])) {
            var history = [];
            for (var i = commands[1] < TERMINAL_MESSAGE_ROWS ? commands[1] : TERMINAL_MESSAGE_ROWS; i >= 0; i--) {
              if (this.bufferLog[i]) {
                history.push(this.bufferLog[i])
              }
            }
            this.pushMessage(history);
          }
          else {
            this.pushMessage('Please enter a number: E.G. history 2');
          }
          break;

        case 'look':
          var room = this.rooms[this.player.room];
          var item = room.items[commands.slice(1).join(' ')];
          if (item) {
            this.pushMessage(item);
          }
          else {
            this.pushMessage(room.message());
          }
          break;

        case 'map':
          var map = ASCII['map' + commands[1]];
          if (map) {
            this.ascii = map;
          }
          else {
            this.ascii = ASCII['map' + this.player.floor];
          }
          break;

        case 'open':
          var name = commands.slice(1).join(' ');
          if (this.rooms[name]) {
            this.rooms[name].openDoor(this.player.room);
          }
          this.pushMessage(this.rooms[this.player.room].openDoor(name));
          console.log(this.rooms);
          break;

        default:
          this.pushMessage(DEFAULT_MESSAGE);
          break;
      }
      break;
  }
};
