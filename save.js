var save = {};

function resetData() {
  window.localStorage.removeItem('spaceFearSave');
  save = { name: '' };
}

function saveData() {
  window.localStorage.setItem('spaceFearSave', JSON.stringify(save));
}

function loadData() {
  var data = window.localStorage.getItem('spaceFearSave');
  if (data !== null) {
    save = JSON.parse(data);
  }
  else {
    resetData();
  }
}

loadData();
