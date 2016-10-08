Save = function() {
  this.reset();
  this.load();

  return this;
}
Save.prototype.reset = function() {
  this.data = {
    name: '',
  }
};
Save.prototype.load = function() {
  var data = window.localStorage.getItem('spaceFearSave');
  if (data !== null) {
    this.data = data;
  }
  return this.data;
};
Save.prototype.save = function(data) {
  if (typeof data == 'object') {
    for (var prop in data) {
      if (data.hasOwnProperty(prop) && typeof this.data[prop] !== 'undefined') {
        this.data[prop] = data[prop];
      }
    }
  }

  window.localStorage.setItem('spaceFearSave', this.data);
  return this.data;
};
Save.prototype.clear = function() {
  window.localStorage.removeItem('spaceFearSave');
  this.reset();
};
