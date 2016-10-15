Computer = function() {
  return this;
}
Computer.prototype.answerQuestion = function(rawQuestion) {
  var question = rawQuestion.toLowerCase();
  var types = question.match(QUESTION_TYPES);
  if (! types) {
    if (/\?/.test(question)) {
      return this.handleYesNo(question);
    }
    else {
      return 'Ask a who, how, what, when, why, or where question.';
    }
  }
  else if (types.length > 1) {
    return 'Please ask only one type of question at a time';
  }
  else {
    return this['handle' + capitalize(types[0])](question.replace(types[0], "").trim());
  }
};
Computer.prototype.handleWho = function(question) {
  return 'Who question: ' + question;
};
Computer.prototype.handleHow = function(question) {
  return 'How question: ' + question;
};
Computer.prototype.handleWhat = function(question) {
  for (var prop in DESCRIPTIONS) {
    if (DESCRIPTIONS.hasOwnProperty(prop) && question.includes(prop)) {
      return DESCRIPTIONS[prop];
    }
  }
  return "I'm afraid don't know anything about that";
};
Computer.prototype.handleWhen = function(question) {
  return 'When question: ' + question;
};
Computer.prototype.handleWhy = function(question) {
  return 'Why question: ' + question;
};
Computer.prototype.handleWhere = function(question) {
  return 'Where question: ' + question;
};
Computer.prototype.handleYesNo = function(question) {
  return 'Yes/no question: ' + question;
};

var QUESTION_TYPES = /who|how|what|when|why|where/;
function capitalize(word) {
  return word[0].toUpperCase() + word.slice(1);
}
var DESCRIPTIONS = {
  'station': 'The deep space research station',
}
