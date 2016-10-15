Actor = function() {
  this.room = 'hibernation';
  this.floor = 3;

  return this;
}
Actor.prototype.move = function(roomName) {
  this.room = roomName;
  switch(roomName) {
    case 'hibernation':
      this.floor = 3;
      break;
    default: break;
  }
};
