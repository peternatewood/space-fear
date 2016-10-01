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

  document.addEventListener('keydown', function(event) {
    var index = convertKeyToIndex(event.key.toUpperCase());
    if (! event.repeat && index !== false) {
      // Don't prevent default if ctrl or alt are held down, to allow keyboard
      // shortcuts
      if (! event.ctrlKey && ! event.altKey) event.preventDefault();

      if (index.length > 1)
        index.forEach(function(i) {
          keyboard.keys[i].pressed = true;
        }, this);
      else {
        keyboard.keys[index].pressed = true;
      }
    }
  });
  document.addEventListener('keyup', function(event) {
    var index = convertKeyToIndex(event.key.toUpperCase());
    if (index !== false) {
      if (index.length > 1)
        index.forEach(function(i) {
          keyboard.keys[i].pressed = false;
        }, this);
      else {
        keyboard.keys[index].pressed = false;
      }
    }
  });

  var step = function(timestamp) {
    if (! start) var start = timestamp;
    var progress = timestamp - start;
    keyboard.render();
    if (progress < 2000) {
      window.requestAnimationFrame(step);
    }
  }
  window.requestAnimationFrame(step);
});
