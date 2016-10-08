var ready = function(fun) {
  if (document.readyState != 'loading') {
    fun();
  }
  else if (document.addEventListener) {
    document.addEventListener('DOMContentLoaded', fun);
  }
  else {
    document.attachEvent('onreadystatechange', function() {
      if (document.readyState != 'loading') {
        fun();
      }
    });
  }
}

ready(function() {
  var canvas = document.getElementById('main-viewport');
  var context = canvas.getContext('2d');

  var keyboard = new Keyboard(canvas);
  var monitor = new Monitor(canvas);

  document.addEventListener('keydown', function(event) {
    var index = convertKeyToIndex(event.key.toUpperCase());
    if (monitor.allowInput() && index !== false) {
      // Don't prevent default if ctrl or alt are held down, to allow keyboard
      // shortcuts
      if (! event.ctrlKey && ! event.altKey) event.preventDefault();

      monitor.terminal.handleInput(event);
      if (index.length > 1)
        index.forEach(function(i) {
          keyboard.keys[i].activate();
        }, this);
      else {
        keyboard.keys[index].activate();
      }
    }
  });
  document.addEventListener('keyup', function(event) {
    var index = convertKeyToIndex(event.key.toUpperCase());
    if (index !== false) {
      if (index.length > 1)
        index.forEach(function(i) {
          keyboard.keys[i].deactivate();
        }, this);
      else {
        keyboard.keys[index].deactivate();
      }
    }
  });
  canvas.addEventListener('mousedown', function(event) {
    if (event.buttons == 1) {
      if (monitor.powerButton.detectMouseOver(event)) {
        monitor.powerButton.press(event);
      }
      else {
        var key;
        for (var index = 0; index < keyboard.keys.length; index++) {
          key = keyboard.keys[index];
          if (key.disabled && key.detectMouseOver(event)) {
            key.grab(event);
            keyboard.grabbedKey = key;
            return;
          }
        }
      }
    }
  });
  canvas.addEventListener('mousemove', function(event) {
    if (keyboard.grabbedKey) {
      keyboard.grabbedKey.updateMousePos(event);
    }
    else if (monitor.powerButton.pressed && not(monitor.powerButton.detectMouseOver(event))) {
      monitor.powerButton.pressed = false;
    }
  });
  canvas.addEventListener('mouseup', function(event) {
    if (keyboard.grabbedKey) {
      keyboard.grabbedKey.release(event);
      keyboard.grabbedKey = false;
    }
    else if (monitor.powerButton.pressed && monitor.powerButton.detectMouseOver(event)) {
      monitor.powerButton.release(event);
    }
  });

  var step = function(timestamp) {
    if (! start) var start = timestamp;
    var progress = timestamp - start;

    context.clearRect(0, 0, canvas.width, canvas.height);
    keyboard.render();
    monitor.render();

    if (progress < 2000) {
      window.requestAnimationFrame(step);
    }
  }
  window.requestAnimationFrame(step);
});
