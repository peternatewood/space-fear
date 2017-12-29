var cursor = {
  x: 0,
  y: 0,
  color: WHITE,
  key: null,
  isHoldingKey: false
};

function setCursorPosition(e) {
  var rect = e.target.getBoundingClientRect();
  cursor.x = e.clientX - rect.x;
  cursor.y = e.clientY - rect.y;

  if (cursor.key && cursor.isHoldingKey) {
    cursor.key.updateMousePos(cursor);
  }
}

function toggleCursorHover(hoverOn) {
  if (typeof hoverOn === 'boolean') {
    cursor.color = hoverOn ? CURSOR_HOVER : WHITE;
  }
}

function pressCursorKey() {
  if (cursor.key) {
    if (cursor.key.disabled && not(cursor.isHoldingKey)) {
      cursor.key.grab(cursor);
      cursor.isHoldingKey = true;
    }
    else {
      cursor.key.activate();
    }
    return cursor.key.getKey(false);
  }
};

function releaseCursorKey() {
  if (cursor.key) {
    if (cursor.key.disabled && cursor.isHoldingKey) {
      cursor.key.release(cursor);
      cursor.isHoldingKey = false;
    }
    else {
      cursor.key.deactivate();
    }
    return cursor.key.getKey(true);
  }
}

function renderCursor() {
  context.fillStyle = cursor.color;

  var x = cursor.x;
  var y = cursor.y;

  context.beginPath();
  context.moveTo(x, y);
  context.lineTo(x += 13, y += 13);
  context.lineTo(x -= 8, y);
  context.lineTo(cursor.x, cursor.y + 19);
  context.closePath();

  context.fill();

  context.strokeStyle = BLACK;
  context.lineWidth = 2;
  context.stroke();
  context.strokeStyle = CURSOR_OUTLINE;
  context.lineWidth = 1;
  context.stroke();
};
