Game = function() {
  this.canvas = document.getElementById('main-viewport');
  this.context = this.canvas.getContext('2d');

  this.keyboard = new Keyboard(this.canvas);
  this.monitor = new Monitor(this.canvas);
  this.cursor = new Cursor();
  this.animationFrame;

  document.addEventListener('keydown', this.handleKeyDown.bind(this));
  document.addEventListener('keyup', this.handleKeyUp.bind(this));

  this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
  this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
  this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
}
Game.prototype.start = function() {
  function step(timestamp) {
    if (! start) var start = timestamp;
    var progress = timestamp - start;

    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.keyboard.render(this.context);
    this.monitor.render(this.context);
    this.cursor.render(this.context);

    if (progress < 2000) {
      this.animationFrame = window.requestAnimationFrame(step.bind(this));
    }
  }
  this.animationFrame = window.requestAnimationFrame(step.bind(this));
};
Game.prototype.destroy = function () {
  document.removeEventListener('keydown', this.handleKeyDown);
  document.removeEventListener('keyup', this.handleKeyUp);

  this.canvas.removeEventListener('mousedown', this.handleMouseDown);
  this.canvas.removeEventListener('mousemove', this.handleMouseMove);
  this.canvas.removeEventListener('mouseup', this.handleMouseUp);

  this.monitor.destroy();

  window.cancelAnimationFrame(this.animationFrame);

  this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
};
Game.prototype.handleKeyDown = function(event) {
  var index = convertKeyToIndex(event.key.toUpperCase());
  if (index !== false) {
    // Don't prevent default if ctrl or alt are held down, to allow this.keyboard
    // shortcuts
    if (! event.ctrlKey && ! event.altKey) event.preventDefault();

    if (this.monitor.allowInput()) this.monitor.terminal.handleInput(event);

    if (index.length > 1)
      index.forEach(function(i) {
        this.keyboard.keys[i].activate();
      }, this);
    else {
      this.keyboard.keys[index].activate();
    }
  }
};
Game.prototype.handleKeyUp = function(event) {
  var index = convertKeyToIndex(event.key.toUpperCase());
  if (index !== false) {
    if (index.length > 1)
      index.forEach(function(i) {
        this.keyboard.keys[i].deactivate();
      }, this);
    else {
      this.keyboard.keys[index].deactivate();
    }
  }
};
Game.prototype.handleMouseDown = function(event) {
  if (event.buttons == 1) {
    if (this.monitor.powerButton.detectMouseOver(event)) {
      this.monitor.powerButton.press(event);
    }
    else {
      var key;
      for (var index = 0; index < this.keyboard.keys.length; index++) {
        key = this.keyboard.keys[index];
        if (key.disabled && key.detectMouseOver(event)) {
          key.grab(event);
          this.keyboard.grabbedKey = key;
          return;
        }
      }
    }
  }
};
Game.prototype.handleMouseMove = function(event) {
  this.cursor.move(event);

  if (this.keyboard.grabbedKey) {
    this.keyboard.grabbedKey.updateMousePos(event);
  }

  if (this.monitor.powerButton.detectMouseOver(event)) {
    this.cursor.hoverOn();
  }
  else {
    this.cursor.hoverOff();

    if (this.monitor.powerButton.pressed) {
      this.monitor.powerButton.pressed = false;
    }
  }
};
Game.prototype.handleMouseUp = function(event) {
  if (this.keyboard.grabbedKey) {
    this.keyboard.grabbedKey.release(event);
    this.keyboard.grabbedKey = false;
  }
  else if (this.monitor.powerButton.pressed && this.monitor.powerButton.detectMouseOver(event)) {
    this.monitor.releaseButton(event);
  }
};
