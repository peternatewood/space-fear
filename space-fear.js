var ready = function(fun) {
  if (document.readyState != 'loading') {
    fun();
  }
  else {
    document.addEventListener('DOMContentLoaded', fun);
  }
}

ready(function() {
  Game.start();
});
