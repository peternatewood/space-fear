var powerButton = {
  x: canvas.width / 2 - MONITOR_WIDTH / 2 + MONITOR_WIDTH + 2 * POWER_BUTTON_SIZE,
  y: MONITOR_TOP + MONITOR_HEIGHT - POWER_BUTTON_SIZE,
  rad: POWER_BUTTON_SIZE,
  glowRad: 2,
  color: POWER_OFF_COLOR,
  pressed: false,
  state: 'off',
  pulseDir: 'grow',
  pulseInterval: 0
};

function isMouseOverButton(event, button) {
  if (event.offsetX < button.x) {
    return false;
  }
  else if (event.offsetX > (button.x + (2 * button.rad))) {
    return false;
  }
  else if (event.offsetY < button.y) {
    return false;
  }
  else if (event.offsetY > (button.y + (2 * button.rad))) {
    return false;
  }
  return true;
}

function cycleButtonState(button) {
  button.pressed = false;
  switch (button.state) {
    case 'off':
      button.state = 'standby'
      button.color = POWER_COLOR;
      startButtonPulse(button);
      break;
    case 'standby':
      button.state = 'on';
      startButtonPulse(button);
      button.glowRad = button.rad - 10;
      break;
    case 'on':
      button.state = 'off';
      stopButtonPulse(button);
      button.color = POWER_OFF_COLOR;
      break;
  }
  return button.state;
}

function startButtonPulse(button) {
  stopButtonPulse(button);
  button.pulseDir = 'grow';
  var minRad = button.state == 'standby' ? 2 : 9;
  var maxRad = button.rad - (button.state == 'standby' ? 10 : 5);
  button.glowRad = minRad;

  button.pulseInterval = setInterval(function() {
    if (button.pulseDir == 'grow') button.glowRad++;
    else button.glowRad--;

    if (button.glowRad <= minRad) button.pulseDir = 'grow';
    else if (button.glowRad >= maxRad) button.pulseDir = 'shrink';
  }, BUTTON_PULSE_DELAY);
}
function stopButtonPulse(button) {
  clearInterval(button.pulseInterval);
}

function renderButton(button) {
  var x = button.x + button.rad;
  var y = button.y + button.rad;

  context.fillStyle = 'slategray';
  context.beginPath();
  context.arc(x, y, button.rad, 0, 2 * Math.PI, false);
  context.closePath();
  context.fill();

  if (not(button.pressed) && button.state !== 'on') {
    x++;
    y--;
  }

  context.fillStyle = modHexColor(button.color, 0.5);
  context.beginPath();
  context.arc(x, y, button.rad - 2, 0, 2 * Math.PI, false);
  context.closePath();
  context.fill();

  if (not(button.pressed)) {
    x += button.state == 'off' ? 2 : 1;
    y -= button.state == 'off' ? 2 : 1;
  }

  if (button.state == 'off') {
    context.fillStyle = button.color;
  }
  else {
    var gradient = context.createRadialGradient(x, y - 1, button.glowRad, x, y, button.rad - 4);
    gradient.addColorStop(0, 'red');
    gradient.addColorStop(1, button.color);
    context.fillStyle = gradient;
  }

  context.beginPath();
  context.arc(x, y, button.rad - 3, 0, 2 * Math.PI, false);
  context.closePath();
  context.fill();
};

startButtonPulse(powerButton);
