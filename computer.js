var QUESTION_TYPES = /who|how|what|when|why|where/;

Computer = function() {
  return this;
}
Computer.prototype.answerQuestion = function(question) {
  var types = question.match(QUESTION_TYPES);
  if (! types) {
    if (/\?/.test(question)) {
      return 'This is a yes/no question.';
    }
    else {
      return 'Ask a who, how, what, when, why, or where question.';
    }
  }
  else if (types.length > 1) {
    return 'Please ask only one type of question at a time';
  }
  else {
    return 'You asked a ' + types[0] + ' question.';
  }
};
