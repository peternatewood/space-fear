var canvas = document.getElementById('canvas');
var showCursor = true;
var context = canvas.getContext('2d');
var keyboard = new Keyboard(canvas);

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
      var keyName = pressCursorKey();
      if (not(cursor.isHoldingKey)) {
        monitor.terminal.handleInput({key: keyName});
      }
    }
    else if (isMouseOverButton(event, powerButton)) {
      powerButton.pressed = true;
    }
  }
};
function handleMouseMove(event) {
  setCursorPosition(event);

  if (not(cursor.isHoldingKey)) {
    var cursorNotOverKey = true;
    var key;
    for (var index = 0; index < keyboard.keys.length; index++) {
      key = keyboard.keys[index];
      if (key.detectMouseOver(event)) {
        window.crossGetKey(event);
        if (cursor.key != key) {
          if (event.buttons == 1) {
            releaseCursorKey();
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
      releaseCursorKey();
      cursor.key = null;
    }
  }

  if (isMouseOverButton(event, powerButton)) {
    toggleCursorHover(true);
  }
  else {
    toggleCursorHover(false);

    if (powerButton.pressed) {
      powerButton.pressed = false;
    }
  }
};
function handleMouseUp(event) {
  if (cursor.key && cursor.key.disabled) {
    releaseCursorKey()
  }
  else if (powerButton.pressed && isMouseOverButton(event, powerButton)) {
    cycleButtonState(powerButton);
    switch (powerButton.state) {
      case 'on' : startBootUp(); break;
      case 'off': startBootDown(); break;
      // Render standby?
    }
    allowInput(monitor.terminal);
  }
  else {
    releaseCursorKey()
  }
};

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
  keyboard.render();
  renderMonitor();

  if (showCursor) {
    renderCursor();
  }

  if (!start) { var start = timestamp; }
  if (timestamp - start < 2000) { window.requestAnimationFrame(step); }
  else {
    // Release keys, and other stuff?
  }
}
window.requestAnimationFrame(step);
