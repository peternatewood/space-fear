var CONSOLE_MARGIN = 24;
var CONSOLE_PADDING = 24;

var KEY_LINE_WIDTH = 4;
var KEY_MARGIN = 2;
var MIN_KEY_SIZE = 28;
var KEY_TEXT_SIZE = 14;

var KEYBOARD_HEIGHT = 216;
var KEYBOARD_WIDTH = 630;
var KEYBOARD_EDGE_WIDTH = 12;

var KEY_COLOR = "#994"
var KEY_TEXT_COLOR = "#000";
var KEY_LIGHT_BORDER_COLOR = "#AA5";
var KEY_DARK_BORDER_COLOR = "#663";

var KEY_FONT = "Courier";

// Declare all classes here
var Monitor, Key, Keyboard;

var KEYBOARD_KEYS = [
  ['~`', '!1', '@2', '#3', '$4', '%5', '^6', '&7', '*8', '(9', ')0', '_-', '+=', 'Backspace'],
  ['Tab', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '{[', '}]', '|\\'],
  ['CapsLk', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ':;', '"\'', 'Enter'],
  ['Shift', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '<,', '>.', '?/', 'Shift'],
  ['Ctrl', 'Meta', 'Alt', ' ', 'Alt', 'Ctrl'],
];
var convertKeyToIndex = function(key) {
  switch(key) {
    case '~': return 0;
    case '`': return 0;
    case '!': return 1;
    case '1': return 1;
    case '@': return 2;
    case '2': return 2;
    case '#': return 3;
    case '3': return 3;
    case '$': return 4;
    case '4': return 4;
    case '%': return 5;
    case '5': return 5;
    case '^': return 6;
    case '6': return 6;
    case '&': return 7;
    case '7': return 7;
    case '*': return 8;
    case '8': return 8;
    case '(': return 9;
    case '9': return 9;
    case ')': return 10;
    case '0': return 10;
    case '_': return 11;
    case '-': return 11;
    case '+': return 12;
    case '=': return 12;
    case 'BACKSPACE': return 13;
    case 'TAB': return 14;
    case 'Q': return 15;
    case 'W': return 16;
    case 'E': return 17;
    case 'R': return 18;
    case 'T': return 19;
    case 'Y': return 20;
    case 'U': return 21;
    case 'I': return 22;
    case 'O': return 23;
    case 'P': return 24;
    case '{': return 25;
    case '[': return 25;
    case '}': return 26;
    case ']': return 26;
    case '|': return 27;
    case '\\': return 27;
    case 'CAPSLOCK': return 28;
    case 'A': return 29;
    case 'S': return 30;
    case 'D': return 31;
    case 'F': return 32;
    case 'G': return 33;
    case 'H': return 34;
    case 'J': return 35;
    case 'K': return 36;
    case 'L': return 37;
    case ':': return 38;
    case ';': return 38;
    case '"': return 39;
    case '\'': return 39;
    case 'ENTER': return 40;
    case 'SHIFT': return [41, 52];
    case 'Z': return 42;
    case 'X': return 43;
    case 'C': return 44;
    case 'V': return 45;
    case 'B': return 46;
    case 'N': return 47;
    case 'M': return 48;
    case '<': return 49;
    case ',': return 49;
    case '>': return 50;
    case '.': return 50;
    case '?': return 51;
    case '/': return 51;
    case 'CONTROL': return [53, 58];
    case 'META': return 54;
    case 'ALT': return [55, 57];
    case ' ': return 56;
    case 'ARROWUP': return 59;
    case 'ARROWLEFT': return 60;
    case 'ARROWDOWN': return 61;
    case 'ARROWRIGHT': return 62;
    default: return false;
  }
}
