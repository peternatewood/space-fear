var canvas = document.getElementById('canvas');
var cursor = new Cursor();
var showCursor = true;
var context = canvas.getContext('2d');
var keyboard = new Keyboard(canvas);
var monitor = new Monitor(canvas);

function handleKeyDown(event) {
  // Handle only keys that are displayed on the keyboard
  var index = convertKeyToIndex(crossGetKey(event).toUpperCase());
  if (index !== false) {
    // Don't prevent default if ctrl or alt are held down, to allow this.keyboard
    // shortcuts
    if (! event.altKey && ! event.ctrlKey && ! event.metaKey) event.preventDefault();

    monitor.terminal.handleInput(event);

    if (index.length > 1)
      index.forEach(function(i) {
        keyboard.keys[i].activate();
      });
    else {
      keyboard.keys[index].activate();
    }
  }
};
function handleKeyUp(event) {
  var index = convertKeyToIndex(crossGetKey(event).toUpperCase());
  if (index !== false) {
    if (index.length > 1)
      index.forEach(function(i) {
        keyboard.keys[i].deactivate();
      });
    else {
      keyboard.keys[index].deactivate();
    }
  }
};
function handleMouseDown(event) {
  if (event.buttons == 1) {
    if (cursor.key) {
      var keyName = cursor.pressKey();
      if (not(cursor.isHoldingKey)) {
        monitor.terminal.handleInput({key: keyName});
      }
    }
    else if (monitor.powerButton.detectMouseOver(event)) {
      monitor.powerButton.press(event);
    }
  }
};
function handleMouseMove(event) {
  cursor.move(event);

  if (not(cursor.isHoldingKey)) {
    var cursorNotOverKey = true;
    var key;
    for (var index = 0; index < keyboard.keys.length; index++) {
      key = keyboard.keys[index];
      if (key.detectMouseOver(event)) {
        window.crossGetKey(event);
        if (cursor.key != key) {
          if (event.buttons == 1) {
            cursor.releaseKey();
          }
          else {
            cursor.key = key;
          }
        }
        cursorNotOverKey = false;
        break;
      }
    }
    if (cursorNotOverKey) {
      cursor.releaseKey();
      cursor.key = null;
    }
  }

  if (monitor.powerButton.detectMouseOver(event)) {
    cursor.hoverOn();
  }
  else {
    cursor.hoverOff();

    if (monitor.powerButton.pressed) {
      monitor.powerButton.pressed = false;
    }
  }
};
function handleMouseUp(event) {
  if (cursor.key && cursor.key.disabled) {
    cursor.releaseKey();
  }
  else if (monitor.powerButton.pressed && monitor.powerButton.detectMouseOver(event)) {
    monitor.releaseButton(event);
    monitor.allowInput();
  }
  else {
    cursor.releaseKey();
  }
};

// Game.start();
document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);

canvas.addEventListener('mousedown', handleMouseDown);
canvas.addEventListener('mousemove', handleMouseMove);
canvas.addEventListener('mouseup', handleMouseUp);
canvas.addEventListener('mouseout', function() {
  showCursor = false;
});
canvas.addEventListener('mouseover', function() {
  showCursor = true;
});
// keyboard.keys[0].disabled = true;

function step(timestamp) {
  context.clearRect(0, 0, SCREEN_W, SCREEN_H);
  var disabledKeys = keyboard.render();
  monitor.render();
  disabledKeys.forEach(function(key) {
    key.render();
  });
  if (showCursor) {
    cursor.render();
  }

  if (!start) { var start = timestamp; }
  if (timestamp - start < 2000) { window.requestAnimationFrame(step); }
  else {
    // Release keys, and other stuff?
  }
}
window.requestAnimationFrame(step);
