var KEY_LINE_WIDTH = 4;
var KEY_MARGIN = 2;
var MIN_KEY_SIZE = 28;
var KEY_TEXT_SIZE = 14;

var KEYBOARD_HEIGHT = 216;
var KEYBOARD_WIDTH = 630;
var KEYBOARD_EDGE_WIDTH = 12;

var KEY_COLOR = "#994"
var KEY_TEXT_COLOR = "#111";
var KEY_LIGHT_BORDER_COLOR = "#AA5";
var KEY_DARK_BORDER_COLOR = "#663";

var KEY_FONT = "Courier";

// Declare all classes here
var Key, Keyboard;

var KEYBOARD_KEYS = [
  ['~`', '!1', '@2', '#3', '$4', '%5', '^6', '&7', '*8', '(9', ')0', '_-', '+=', 'Backspace'],
  ['Tab', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '{[', '}]', '|\\'],
  ['CapsLk', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ':;', '"\'', 'Enter'],
  ['Shift', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '<,', '>.', '?/', 'Shift'],
  ['Ctrl', 'Meta', 'Alt', ' ', 'Alt', 'Ctrl'],
];
var KEY_INDEXES = {
  '~': 0,
  '`': 0,
  '!': 1,
  '1': 1,
  '@': 2,
  '2': 2,
  '#': 3,
  '3': 3,
  '$': 4,
  '4': 4,
  '%': 5,
  '5': 5,
  '^': 6,
  '6': 6,
  '&': 7,
  '7': 7,
  '*': 8,
  '8': 8,
  '(': 9,
  '9': 9,
  ')': 10,
  '0': 10,
  '_': 11,
  '-': 11,
  '+': 12,
  '=': 12,
  'BACKSPACE': 13,
  'TAB': 14,
  'Q': 15,
  'W': 16,
  'E': 17,
  'R': 18,
  'T': 19,
  'Y': 20,
  'U': 21,
  'I': 22,
  'O': 23,
  'P': 24,
  '{': 25,
  '[': 25,
  '}': 26,
  ']': 26,
  '|': 27,
  '\\': 27,
  'CAPSLK': 28,
  'A': 29,
  'S': 30,
  'D': 31,
  'F': 32,
  'G': 33,
  'H': 34,
  'J': 35,
  'K': 36,
  'L': 37,
  ':': 38,
  ';': 38,
  '"': 39,
  '\'': 39,
  'ENTER': 40,
  'SHIFT': [41, 52],
  'Z': 42,
  'X': 43,
  'C': 44,
  'V': 45,
  'B': 46,
  'N': 47,
  'M': 48,
  '<': 49,
  ',': 49,
  '>': 50,
  '.': 50,
  '?': 51,
  '/': 51,
  'CONTROL': [53, 58],
  'META': 54,
  'ALT': [55, 57],
  ' ': 56,
}
