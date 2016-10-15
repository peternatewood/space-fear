Room = function(messages, items, adjacents) {
  this.state = 0;
  this.messages = messages;
  this.items = items;
  this.adjacents = adjacents;

  return this;
}
Room.prototype.message = function() {
  return this.messages[this.state];
};
Room.prototype.itemMessage = function(name) {
  var item = this.items[name.toLowerCase()];
  if (item) {
    return items;
  }
  return "There is no " + name + " here";
};
Room.prototype.openDoor = function(name) {
  if (name) {
    var roomName = name.toLowerCase();
    var doorState = this.adjacents[roomName];
    if (doorState) {
      switch(doorState) {
        case 'open':
          return 'The door to ' + roomName + ' is already open';
        case 'closed':
          this.adjacents[roomName] = 'open';
          return 'You opened the door to ' + roomName;
        case 'locked':
          return 'The door to ' + roomName + ' is locked';
      }
    }
    return 'There is no door to ' + roomName;
  }
  return 'Please name the room whose door you want to open';
};
Room.prototype.closeDoor = function(name) {
  if (name) {
    var roomName = name.toLowerCase();
    var doorState = this.adjacents[roomName];
    if (doorState) {
      switch(doorState) {
        case 'open':
          this.adjacents[roomName] = 'closed';
          return 'You closed the door to ' + roomName;
        case 'closed': case 'locked':
          return 'The door to ' + roomName + ' is already closed';
      }
    }
    return 'There is no door to ' + roomName;
  }
  return 'Please name the room whose door you want to close';
};
Room.prototype.setState = function(state) {
  if (state < this.messages.length && state >= 0) {
    this.state = state;
  }
};

var ROOMS = [
  {
    name: 'hibernation',
    messages: [
      'Hibernation: The collective bedroom for all staff onboard the station. There are six beds, and one exit.',
    ],
    items: {
      'bed 1': 'Bed 1: The lone bed at the far end of hibernation. The name "Captain Jaswinder Perun" is written on the footboard.',
      'bed 2': 'Bed 2: One of two beds along the short wall of hibernation. The name "Astrophysicist Arkaitz Stanford" is written on the footboard.',
      'bed 3': 'Bed 3: One of two beds along the short wall of hibernation. The name "Engineer {{name}}" is written on the footboard.',
      'bed 4': 'Bed 4: One of three beds along the long wall of hibernation. The name "Chemist Melania Bhumi" is written on the footboard.',
      'bed 5': 'Bed 5: One of three beds along the long wall of hibernation. The name "Doctor Gustav Tanith" is written on the footboard.',
      'bed 6': 'Bed 6: One of three beds along the long wall of hibernation. The name "Biologist Asha Cansu" is written on the footboard.',
    },
    adjacents: {
      'hibernation access': 'closed'
    },
  },
  {
    name: 'hibernation access',
    messages: [
      'Hibernation Access: Hallway connecting hibernation to the rest of the station',
    ],
    items: {
    },
    adjacents: {
      'hibernation': 'closed'
    },
  },
];
