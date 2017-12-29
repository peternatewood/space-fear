var terminal = {
  buffer: '',
  cursor: 0,
  showCursor: true,
  allowInput: false,
  bufferLog: [],
  logOffset: 0,
  blinkInterval: 0,
  scene: 0,

  message: [SCENE_MESSAGES[0]],
  messageLog: [SCENE_MESSAGES[0]],
  messageEnd: 0,
  messageInterval: false,
  color: WHITE,
  ascii: [],
  inventory: [],

  computer: new Computer(),
  player: new Actor(),
  rooms: new Array(ROOMS.length),
};

terminal.rooms = {};
for (var i = 0; i < ROOMS.length; i++) {
  var room = ROOMS[i];
  terminal.rooms[room.name] = new Room(room.messages, room.items, room.adjacents);
}

function getSceneMessage() {
  return SCENE_MESSAGES[terminal.scene];
}

function restartCursorBlink() {
  terminal.showCursor = true;
  clearInterval(terminal.blinkInterval);

  terminal.blinkInterval = setInterval(function() {
    terminal.showCursor = ! terminal.showCursor
  }, CURSOR_BLINK_DELAY);
}

function clearTerminalBuffer() {
  terminal.buffer = '';
  terminal.cursor = 0;
}
function readTerminalBuffer() {
  terminal.bufferLog.unshift(terminal.buffer);
  processCommands();
  clearTerminalBuffer();
}

function disableTerminalCursor() {
  terminal.showCursor = false;
  clearInterval(terminal.blinkInterval);
}
function disableTerminalInput() {
  terminal.allowInput = false;
  disableTerminalCursor();
}
function enableTerminalInput() {
  terminal.allowInput = true;
  terminal.restartCursorBlink();
}

function skipMessage() {
  clearInterval(terminal.messageInterval);
  terminal.messageInterval = false;
}

function startMessage() {
  terminal.messageEnd = 0;
  var messageLength = 0;
  var splitMessage = terminal.message[terminal.message.length - 1].split("\n");
  for (var i = 0; i < splitMessage.length; i++) {
    messageLength += splitMessage[i].length;
  }

  terminal.messageInterval = setInterval(function() {
    terminal.messageEnd++;
    if (terminal.messageEnd > messageLength) {
      skipMessage();
    }
  }, MESSAGE_DELAY);
}

function pushMessage(rawMessage) {
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

  if (terminal.message.length > TERMINAL_MESSAGE_ROWS) {
    terminal.message = terminal.message.slice(1);
  }

  terminal.message.push(message);
  terminal.messageLog.push(message);
  startMessage();
}

function processCommands() {
  switch(terminal.scene) {
    case 0:
      var name = terminal.bufferLog[0].trim();
      if (/\S+/.test(name)) {
        save.name = name;
        saveData();
        terminal.scene = 1;
        terminal.rooms.hibernation.items['bed 3'] = terminal.rooms.hibernation.items['bed 3'].replace('{{name}}', name);
        pushMessage('Welcome to Space Fear, ' + name + '. ' + getSceneMessage());
      }
      else {
        pushMessage(getSceneMessage());
      }
      break;

    default:
      var commands = terminal.bufferLog[0].split(' ');
      switch(getCommand(commands[0])) {
        case 'clear':
          terminal.message = [];
          break;

        case 'close':
          var name = commands.slice(1).join(' ');
          if (terminal.rooms[name]) {
            terminal.rooms[name].closeDoor(terminal.player.room);
          }
          pushMessage(terminal.rooms[terminal.player.room].closeDoor(name));
          // console.log(terminal.rooms);
          break;

        case 'color':
          var message = 'Valid options include: default, crimson, lime, slateblue';
          if (VALID_COLORS.includes(commands[1])) {
            terminal.color = commands[1] == 'default' ? DEFAULT_TERMINAL_COLOR : commands[1];
            message = 'Color: ' + commands[1];
          }
          pushMessage(message);
          break;

        case 'computer':
          var question = commands.slice(1).join(' ');
          pushMessage(terminal.computer.answerQuestion(question));
          break;

        case 'help':
          var commandName = getCommand(commands[1]);
          if (commands[1] && VALID_COMMANDS[commandName]) {
            pushMessage(VALID_COMMANDS[commandName]);
          }
          else {
            var commands = [];
            for (var prop in VALID_COMMANDS) {
              if (VALID_COMMANDS.hasOwnProperty(prop)) {
                commands.push(prop);
              }
            }
            pushMessage(commands.join(', '));
          }
          break;

        case 'history':
          if (! isNaN(commands[1])) {
            var history = [];
            for (var i = commands[1] < TERMINAL_MESSAGE_ROWS ? commands[1] : TERMINAL_MESSAGE_ROWS; i >= 0; i--) {
              if (terminal.bufferLog[i]) {
                history.push(terminal.bufferLog[i])
              }
            }
            pushMessage(history);
          }
          else {
            pushMessage('Please enter a number: E.G. history 2');
          }
          break;

        case 'look':
          var room = terminal.rooms[terminal.player.room];
          var item = room.items[commands.slice(1).join(' ')];
          if (item) {
            pushMessage(item);
          }
          else {
            pushMessage(room.message());
          }
          break;

        case 'map':
          var map = ASCII['map' + commands[1]];
          if (map) {
            terminal.ascii = map;
          }
          else {
            terminal.ascii = ASCII['map' + terminal.player.floor];
          }
          break;

        case 'open':
          var name = commands.slice(1).join(' ');
          if (terminal.rooms[name]) {
            terminal.rooms[name].openDoor(terminal.player.room);
          }
          pushMessage(terminal.rooms[terminal.player.room].openDoor(name));
          // console.log(terminal.rooms);
          break;

        default:
          pushMessage(DEFAULT_MESSAGE);
          break;
      }
      break;
  }
};

function handleTerminalInput(e) {
  if (terminal.allowInput) {
    var key = crossGetKey(e);
    restartCursorBlink();
    // Only allow printable characters
    if (/^.$/.test(key) && terminal.cursor < TERMINAL_MESSAGE_CHARS) {
      terminal.buffer = terminal.buffer.slice(0, terminal.cursor) + key + terminal.buffer.slice(terminal.cursor);
      terminal.cursor += 1;
    }
    else if (key == 'Backspace' && terminal.cursor > 0) {
      var before = terminal.buffer.slice(0, terminal.cursor - 1);
      var after = terminal.buffer.slice(terminal.cursor, terminal.buffer.length);

      terminal.buffer = before + after;
      terminal.cursor -= 1;
    }
    else if (key == 'Delete' && terminal.cursor < terminal.buffer.length) {
      var before = terminal.buffer.slice(0, terminal.cursor);
      var after = terminal.buffer.slice(terminal.cursor + 1, terminal.buffer.length);

      terminal.buffer = before + after;
    }
    else if (key == 'Enter') {
      if (terminal.messageInterval) {
        skipMessage();
      }

      if (terminal.ascii.length > 0) {
        terminal.ascii = [];
      }
      if (terminal.buffer) {
        readTerminalBuffer();
      }
    }
    else if (key == 'ArrowLeft' && terminal.cursor > 0) {
      terminal.cursor -= 1;
    }
    else if (key == 'ArrowRight' && terminal.cursor < terminal.buffer.length) {
      terminal.cursor += 1;
    }
    else if (key == 'ArrowDown' && terminal.logOffset > 0) {
      terminal.logOffset -= 1;
      if (terminal.logOffset > 0) {
        terminal.buffer = terminal.bufferLog[terminal.logOffset - 1];
        terminal.cursor = terminal.buffer.length;
      }
      else {
        clearTerminalBuffer();
      }
    }
    else if (key == 'ArrowUp' && terminal.logOffset < terminal.bufferLog.length) {
      terminal.logOffset += 1;
      terminal.buffer = terminal.bufferLog[terminal.logOffset - 1];
      terminal.cursor = terminal.buffer.length;
    }
    return key;
  }
}

function renderTerminal(monitor) {
  context.font = TERMINAL_FONT;
  context.fillStyle = terminal.color;
  context.fillText('> ' + terminal.buffer, monitor.x + MONITOR_MARGIN + MONITOR_PADDING, monitor.y + monitor.h - (MONITOR_MARGIN + MONITOR_PADDING));

  if (terminal.showCursor) {
    var cursor = ' _';
    for (var i = 0; i <= terminal.cursor; i++) {
      cursor = ' ' + cursor;
    }
    context.fillText(cursor, monitor.x + MONITOR_MARGIN + MONITOR_PADDING, monitor.y + monitor.h - (MONITOR_MARGIN + MONITOR_PADDING));
  }

  if (terminal.ascii.length > 0) {
    context.fillStyle = terminal.color;
    var x = monitor.x + MONITOR_MARGIN + MONITOR_PADDING;
    var y = monitor.y + MONITOR_MARGIN + MONITOR_PADDING + 8;
    if (terminal.ascii instanceof Array) {
      for (var row = 0; row < terminal.ascii.length; row++) {
        context.fillText(terminal.ascii[row], x, y);
        y += KEY_TEXT_SIZE;
      }
    }
  }
  else if (terminal.message.length > 0) {
    var message;
    for (var index = 0, row = 0; index < terminal.message.length && row < TERMINAL_MESSAGE_ROWS; index++) {
      var rawMessage = (terminal.message[terminal.message.length - index - 1]).split("\n");
      message = rawMessage;

      if (terminal.messageInterval && index == 0) {
        message = [];
        var charCount = 0;
        for (var line = 0; line < rawMessage.length; line++) {
          if (charCount + rawMessage[line].length > terminal.messageEnd) {
            message[line] = rawMessage[line].slice(0, terminal.messageEnd - charCount);
            break;
          }
          message[line] = rawMessage[line];
          charCount += rawMessage[line].length;
        }
      }

      for (var i = message.length - 1; i >= 0 && row < TERMINAL_MESSAGE_ROWS; i--) {
        context.fillText(message[message.length - 1 - i], monitor.x + MONITOR_MARGIN + MONITOR_PADDING, monitor.y + monitor.h - (MONITOR_MARGIN + MONITOR_PADDING) - ((TERMINAL_MESSAGE_ROWS - row) * KEY_TEXT_SIZE) - 2);
        row++;
      }
    }
  }
}

restartCursorBlink();
