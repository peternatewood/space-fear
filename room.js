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
  if (this.items[name]) {
    return this.items[name];
  }
  return "There is no " + name + " here";
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
      bed1: 'Bed 1: The lone bed at the far end of hibernation. The name "Captain Jaswinder Perun" is written on the footboard.',
      bed2: 'Bed 2: One of two beds along the short wall of hibernation. The name "Astrophysicist Arkaitz Stanford" is written on the footboard.',
      bed3: 'Bed 3: One of two beds along the short wall of hibernation. The name "Engineer {{name}}" is written on the footboard.',
      bed4: 'Bed 4: One of three beds along the long wall of hibernation. The name "Chemist Melania Bhumi" is written on the footboard.',
      bed5: 'Bed 5: One of three beds along the long wall of hibernation. The name "Doctor Gustav Tanith" is written on the footboard.',
      bed6: 'Bed 6: One of three beds along the long wall of hibernation. The name "Biologist Asha Cansu" is written on the footboard.',
    },
    adjacents: ['hibernation_hall'],
  }
];
