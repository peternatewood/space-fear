var Game = new Object();
Game.start = function() {
  this.canvas = document.getElementById('canvas'),
  this.cursor = new Cursor(),
  this.showCursor = true,
  this.animationFrame = 0,
  this.context = this.canvas.getContext('2d');
  this.keyboard = new Keyboard(this.canvas);
  this.monitor = new Monitor(this.canvas);

  document.addEventListener('keydown', this.handleKeyDown.bind(this));
  document.addEventListener('keyup', this.handleKeyUp.bind(this));

  this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
  this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
  this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
  this.canvas.addEventListener('mouseout', function() {this.showCursor = false}.bind(this));
  this.canvas.addEventListener('mouseover', function() {this.showCursor = true}.bind(this));
  this.keyboard.keys[0].disabled = true;

  function step(timestamp) {
    if (! start) var start = timestamp;
    var progress = timestamp - start;

    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    var disabledKeys = this.keyboard.render(this.context);
    this.monitor.render(this.context);
    disabledKeys.forEach(function(key) {
      key.render(this.context);
    }, this);
    if (this.showCursor) {
      this.cursor.render(this.context);
    }

    if (progress < 2000) {
      this.animationFrame = window.requestAnimationFrame(step.bind(this));
    }
  }
  this.animationFrame = window.requestAnimationFrame(step.bind(this));
};
Game.destroy = function () {
  document.removeEventListener('keydown', this.handleKeyDown);
  document.removeEventListener('keyup', this.handleKeyUp);

  this.canvas.removeEventListener('mousedown', this.handleMouseDown);
  this.canvas.removeEventListener('mousemove', this.handleMouseMove);
  this.canvas.removeEventListener('mouseup', this.handleMouseUp);

  this.monitor.destroy();

  window.cancelAnimationFrame(this.animationFrame);

  this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
};
Game.handleKeyDown = function(event) {
  // Handle only keys that are displayed on the keyboard
  var index = convertKeyToIndex(crossGetKey(event).toUpperCase());
  if (index !== false) {
    // Don't prevent default if ctrl or alt are held down, to allow this.keyboard
    // shortcuts
    if (! event.ctrlKey && ! event.altKey) event.preventDefault();

    this.monitor.terminal.handleInput(event);

    if (index.length > 1)
      index.forEach(function(i) {
        this.keyboard.keys[i].activate();
      }, this);
    else {
      this.keyboard.keys[index].activate();
    }
  }
};
Game.handleKeyUp = function(event) {
  var index = convertKeyToIndex(crossGetKey(event).toUpperCase());
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
Game.handleMouseDown = function(event) {
  if (event.buttons == 1) {
    if (this.cursor.key) {
      var keyName = this.cursor.pressKey();
      if (not(this.cursor.isHoldingKey)) {
        this.monitor.terminal.handleInput({key: keyName});
      }
    }
    else if (this.monitor.powerButton.detectMouseOver(event)) {
      this.monitor.powerButton.press(event);
    }
  }
};
Game.handleMouseMove = function(event) {
  this.cursor.move(event);

  if (not(this.cursor.isHoldingKey)) {
    var cursorNotOverKey = true;
    var key;
    for (var index = 0; index < this.keyboard.keys.length; index++) {
      key = this.keyboard.keys[index];
      if (key.detectMouseOver(event)) {
        window.crossGetKey(event);
        if (this.cursor.key != key) {
          if (event.buttons == 1) {
            this.cursor.releaseKey();
          }
          else {
            this.cursor.key = key;
          }
        }
        cursorNotOverKey = false;
        break;
      }
    }
    if (cursorNotOverKey) {
      this.cursor.releaseKey();
      this.cursor.key = null;
    }
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
Game.handleMouseUp = function(event) {
  if (this.cursor.key && this.cursor.key.disabled) {
    this.cursor.releaseKey();
  }
  else if (this.monitor.powerButton.pressed && this.monitor.powerButton.detectMouseOver(event)) {
    this.monitor.releaseButton(event);
    this.monitor.allowInput();
  }
  else {
    this.cursor.releaseKey();
  }
};

Game.start();
