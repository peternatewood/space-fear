Timer = function() {
  this.step = 0;
  setInterval(this.progress, 10);
}
Timer.prototype.progress = function() {
  this.step++;
  if (this.step >= 360) {
    this.step = 0;
  }
};
