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

  window.keyboard = new Keyboard(canvas);
  keyboard.render();
});
