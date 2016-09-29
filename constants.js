var KEY_LINE_WIDTH = 6;
var KEY_MARGIN = 8;
var MIN_KEY_SIZE = 32;
var KEY_TEXT_SIZE = 18;

var KEYBOARD_HEIGHT = 280;
var KEYBOARD_WIDTH = 820;

var KEY_COLOR = "#CC9"
var KEY_TEXT_COLOR = "#111";
var KEY_LIGHT_BORDER_COLOR = "#EEB";
var KEY_DARK_BORDER_COLOR = "#885";

var KEY_FONT = "Courier";

var KEYBOARD_KEYS = [
  ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
  ['Tab', 'q', 'w', 'e', 'r', 't', 'y', "u", "i", "o", "p", '[', ']', "|\n\\"],
  ['CapsLk', 'a', 's', 'd', 'f', 'g', 'h', "j", "k", "l", ';', "'", 'Enter'],
  ['Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'Shift'],
  ['Ctrl', 'Meta', 'Alt', 'Space', 'Alt', 'Ctrl'],
];
var CURSOR_KEYS = ['↑', '←', '↓', '→'];

// Declare all classes here
var Key, Keyboard;
