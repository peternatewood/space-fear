Button = function(x, y) {
  this.x = x;
  this.y = y;
  this.rad = POWER_BUTTON_SIZE;
  this.glowRad = 2;
  this.color = POWER_OFF_COLOR;

  this.pressed = false;
  this.state = 'off';
  this.pulseDir;
  this.pulseInterval;

  this.pulse();

  return this;
}
Button.prototype.destroy = function() {
  clearInterval(this.pulseInterval);
};
Button.prototype.detectMouseOver = function(event) {
  if (event.offsetX < this.x) {
    return false;
  }
  else if (event.offsetX > (this.x + (2 * this.rad))) {
    return false;
  }
  else if (event.offsetY < this.y) {
    return false;
  }
  else if (event.offsetY > (this.y + (2 * this.rad))) {
    return false;
  }
  return true;
};
Button.prototype.press = function(event) {
  this.pressed = true;
};
Button.prototype.release = function(event) {
  this.pressed = false;
  return this.toggle();
};
Button.prototype.toggle = function() {
  switch(this.state) {
    case 'off':
      this.state = 'standby'
      this.color = POWER_COLOR;
      this.pulse();
      break;
    case 'standby':
      this.state = 'on';
      this.pulse();
      this.glowRad = this.rad - 10;
      break;
    case 'on':
      this.state = 'off';
      this.stopPulse();
      this.color = POWER_OFF_COLOR;
      break;
  }
  return this.state;
};
Button.prototype.pulse = function() {
  this.stopPulse();
  this.pulseDir = 'grow';
  var minRad = this.state == 'standby' ? 2 : 9;
  var maxRad = this.rad - (this.state == 'standby' ? 10 : 5);
  this.glowRad = minRad;

  var pulseButton = function(direction) {
    if (this.pulseDir == 'grow') this.glowRad++;
    else this.glowRad--;

    if (this.glowRad <= minRad) this.pulseDir = 'grow';
    else if (this.glowRad >= maxRad) this.pulseDir = 'shrink';
  }

  this.pulseInterval = setInterval(pulseButton.bind(this), BUTTON_PULSE_DELAY);
};
Button.prototype.stopPulse = function() {
  clearInterval(this.pulseInterval);
};
Button.prototype.render = function(context) {
  var x = this.x + this.rad;
  var y = this.y + this.rad;

  context.fillStyle = 'slategray';
  context.beginPath();
  context.arc(x, y, this.rad, 0, 2 * Math.PI, false);
  context.closePath();
  context.fill();

  if (not(this.pressed) && this.state !== 'on') {
    x++;
    y--;
  }

  context.fillStyle = modHexColor(this.color, 0.5);
  context.beginPath();
  context.arc(x, y, this.rad - 2, 0, 2 * Math.PI, false);
  context.closePath();
  context.fill();

  if (not(this.pressed)) {
    x += this.state == 'off' ? 2 : 1;
    y -= this.state == 'off' ? 2 : 1;
  }

  if (this.state == 'off') {
    context.fillStyle = this.color;
  }
  else {
    var gradient = context.createRadialGradient(x, y - 1, this.glowRad, x, y, this.rad - 4);
    gradient.addColorStop(0, 'red');
    gradient.addColorStop(1, this.color);
    context.fillStyle = gradient;
  }

  context.beginPath();
  context.arc(x, y, this.rad - 3, 0, 2 * Math.PI, false);
  context.closePath();
  context.fill();
};
