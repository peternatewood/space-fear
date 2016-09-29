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
