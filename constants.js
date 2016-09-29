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

var KEYBOARD_KEYS = [
  ['~`', '!1', '@2', '#3', '$4', '%5', '^6', '&7', '*8', '(9', ')0', '_-', '+=', 'Backspace'],
  ['Tab', 'Q', 'W', 'E', 'R', 'T', 'Y', "U", "I", "O", "P", '{[', '}]', "|\\"],
  ['CapsLk', 'A', 'S', 'D', 'F', 'G', 'H', "J", "K", "L", ':;', '"\'', 'Enter'],
  ['Shift', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '<,', '>.', '?/', 'Shift'],
  ['Ctrl', 'Meta', 'Alt', ' ', 'Alt', 'Ctrl'],
];
var CURSOR_KEYS = ['↑', '←', '↓', '→'];

// Declare all classes here
var Key, Keyboard;
