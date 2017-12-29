var monitor = {
  x: (canvas.width / 2) - (MONITOR_WIDTH / 2),
  y: MONITOR_TOP,
  w: MONITOR_WIDTH,
  h: MONITOR_HEIGHT,
  booting: 'none',
  bootStep: MONITOR_BOOT_STEPS,
  bootInterval: 0,
  asciiInterval: 0
};

function renderMonitor() {
  var x, y;
  // Render monitor
  context.fillStyle = MONITOR_COLOR;
  context.fillRect(monitor.x, monitor.y, monitor.w, monitor.h);

  context.fillStyle = MONITOR_MEDIUM_COLOR;
  context.beginPath();
  context.moveTo(monitor.x, monitor.y);
  context.lineTo(monitor.x + monitor.w, monitor.y);
  context.lineTo(monitor.x + monitor.w - (2 * MONITOR_MARGIN), monitor.y + (2 * MONITOR_MARGIN));
  context.lineTo(monitor.x + (2 * MONITOR_MARGIN), monitor.y + monitor.h - (2 * MONITOR_MARGIN));
  context.lineTo(monitor.x, monitor.y + monitor.h);
  context.closePath();
  context.fill();

  context.fillStyle = MONITOR_DARK_COLOR;
  context.beginPath();
  context.moveTo(monitor.x, monitor.y);
  context.lineTo(monitor.x + monitor.w, monitor.y);
  context.lineTo(monitor.x + monitor.w - (2 * MONITOR_MARGIN), monitor.y + (2 * MONITOR_MARGIN));
  context.lineTo(monitor.x + (2 * MONITOR_MARGIN), monitor.y + (2 * MONITOR_MARGIN));
  context.closePath();
  context.fill();

  context.fillStyle = BLACK;
  context.fillRect(monitor.x + MONITOR_MARGIN, monitor.y + MONITOR_MARGIN, monitor.w - (2 * MONITOR_MARGIN), monitor.h - (2 * MONITOR_MARGIN));

  // Render power button
  renderButton(powerButton);

  // Render terminal if monitor is on
  if (powerButton.state === 'on') {
    renderTerminal(monitor);
  }

  // Render boot flash
  if (monitor.booting == 'up'){
    x = monitor.x + MONITOR_MARGIN + 6;
    y = monitor.y + MONITOR_MARGIN + 6;
    w = monitor.w - (2 * MONITOR_MARGIN) - 12;
    h = monitor.h - (2 * MONITOR_MARGIN) - 12;
    var opacity = Math.round((monitor.bootStep / MONITOR_BOOT_STEPS) * 100) / 100;
    context.fillStyle = 'rgba(255, 255, 255, ' + opacity + ')';
    context.fillRect(x, y, w, h);
  }
  else if (monitor.booting == 'down') {
    h = (monitor.bootStep / MONITOR_BOOT_STEPS) * (monitor.h - (2 * MONITOR_MARGIN));

    x = monitor.x + MONITOR_MARGIN + 6;
    y = monitor.y + (monitor.h / 2);
    w = monitor.w - (2 * MONITOR_MARGIN) - 12;

    context.fillStyle = 'white';
    context.fillRect(x, y - (h / 2), w, h);
  }

  // Render monitor glare
  x = monitor.x + monitor.w;
  y = monitor.y;
  var gradient = context.createRadialGradient(x, y, monitor.w / 3, x++, y--, 2);
  gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0.5)');
  context.fillStyle = gradient;
  context.fillRect(monitor.x + MONITOR_MARGIN + 4, monitor.y + MONITOR_MARGIN + 4, monitor.w - (2 * MONITOR_MARGIN) - 8, monitor.h - (2 * MONITOR_MARGIN) - 8);
}

function startAsciiAnimation(name) {
  clearInterval(monitor.asciiInterval);
  monitor.ascii = ASCII[name].split("\n");
  monitor.asciiColor = BLACK;
  monitor.asciiInterval = setInterval(function() {
    var color = monitor.asciiColor.toUpperCase();

    if (color == '#FFFFFF') {
      clearInterval(monitor.asciiInterval);
    }
    monitor.asciiColor = modHexColor(color, 2);
  }, 410);
}

function startBootUp() {
  clearInterval(monitor.bootInterval);
  monitor.booting = 'up';
  monitor.bootStep = MONITOR_BOOT_STEPS;
  monitor.bootInterval = setInterval(function() {
    if (monitor.bootStep > MONITOR_BOOT_STEPS / 2) {
      monitor.bootStep -= 10;
    }
    else {
      monitor.bootStep -= 2;
    }

    if (monitor.bootStep <= 0) {
      monitor.booting = 'none';
      clearInterval(monitor.bootInterval);
    }
  }, 10);
}

function startBootDown() {
  clearInterval(monitor.bootInterval);
  monitor.booting = 'down';
  monitor.bootStep = MONITOR_BOOT_STEPS;
  monitor.bootInterval = setInterval(function() {
    if (monitor.bootStep > MONITOR_BOOT_STEPS / 8) {
      monitor.bootStep -= 40;
    }
    else {
      monitor.bootStep -= 5;
    }

    if (monitor.bootStep <= 0) {
      monitor.booting = 'none';
      clearInterval(monitor.bootInterval);
    }
  }, 10);
}
