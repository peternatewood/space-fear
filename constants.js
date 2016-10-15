// Declare all classes here
var Actor, Button, Computer, Cursor, Game, Key, Keyboard, Monitor, Room, Save, Terminal;

var MONITOR_TOP = 24;
var MONITOR_MARGIN = 24;
var MONITOR_PADDING = 12;
var MONITOR_HEIGHT = 320;
var MONITOR_WIDTH = 480;
var MONITOR_BOOT_STEPS = 360;

var POWER_BUTTON_SIZE = 16;
var BUTTON_PULSE_DELAY = 270;

var BLACK = '#060606';
var WHITE = '#E7E7E7';

var CURSOR_OUTLINE = '#062606';
var CURSOR_HOVER = '#08E708';

var MONITOR_COLOR = '#553';
var MONITOR_MEDIUM_COLOR = '#332';
var MONITOR_DARK_COLOR = '#26261A';
var POWER_COLOR = '#811';
var POWER_PRESSED_COLOR = '#F00';
var POWER_OFF_COLOR = '#441010';

var CURSOR_BLINK_DELAY = 680;
var TERMINAL_MESSAGE_ROWS = 17;
var TERMINAL_MESSAGE_CHARS = 49;
var MESSAGE_DELAY = 50;

var SCENE_MESSAGES = [
  'Please enter your name',
  'Interact solely through the keyboard. Your progress is automatically preserved and will be restored on future sessions. You are an engineer working onboard a deep space research station. You begin in the hibernation center. You have awoken after a normal eight hours of sleep.',
];
var DEFAULT_MESSAGE = "I don't understand. Type help for a list of commands";
var VALID_COMMANDS = {
  clear: 'clear: Clear terminal messages from the monitor.',
  close: 'close [room name]: Close a door to an adjacent room.',
  color: 'color [color name]: Change the color of the terminal text.',
  computer: "comp/computer [question]: Ask the computer a question. E.G. \"computer where am I?\"",
  help: "help [command]: Display all valid terminal commands. Specify a command to learn more about it. E.G. \"help computer\".",
  history: 'history [number]: List a number of previously entered commands.',
  look: 'look [object]: Look at the current room, or a specific object in the room.',
  map: "map [floor number]: Display the map of current floor. Specify a floor to see its map instead. E.G. \"map 2\".",
  open: 'open [room name]: Open a door to an adjacent room.',
}
var getCommand = function(input) {
  if (typeof input == 'undefined') {
    return 'invalid';
  }
  switch(input.toLowerCase()) {
    case 'clear':
      return 'clear';
    case 'close':
      return 'close';
    case 'color':
      return 'color';
    case 'computer': case 'comp':
      return 'computer';
    case 'help':
      return 'help';
    case 'history':
      return 'history';
    case 'look':
      return 'look';
    case 'map': case 'm':
      return 'map';
    case 'open':
      return 'open';
    default: return 'invalid';
  }
}

var KEY_LINE_WIDTH = 4;
var KEY_MARGIN = 2;
var MIN_KEY_SIZE = 36;
var KEY_TEXT_SIZE = 14;
var KEY_MOVE_DELAY = 10;

var KEYBOARD_HEIGHT = 216;
var KEYBOARD_WIDTH = 630;
var KEYBOARD_EDGE_WIDTH = 12;

var KEY_COLOR = "#994"
var KEY_TEXT_COLOR = "#000";
var KEY_LIGHT_BORDER_COLOR = "#AA5";
var KEY_DARK_BORDER_COLOR = "#663";

var KEY_FONT = "Courier";

var KEYBOARD_KEYS = [
  ['~`', '!1', '@2', '#3', '$4', '%5', '^6', '&7', '*8', '(9', ')0', '_-', '+=', 'Backspace'],
  ['Tab', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '{[', '}]', '|\\'],
  ['CapsLk', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ':;', '"\'', 'Enter'],
  ['Shift', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '<,', '>.', '?/', 'Shift'],
  ['Ctrl', 'Meta', 'Alt', ' ', 'Alt', 'Ctrl'],
];

var not = function(boolean) {
  if (boolean === true || boolean === false) {
    return ! boolean;
  }
  else {
    throw new TypeError('function not() expects a boolean, got ' + typeof boolean);
  }
}
var convertDecToHex = function(decimal) {
  var first = Math.floor(decimal / 16);
  if (first > 9) {
    first = String.fromCharCode(first + 55);
  }

  var last = decimal % 16;
  if (last > 9) {
    last = String.fromCharCode(last + 55);
  }

  return first.toString() + last.toString();
}
var modHexColor = function(hex, mod) {
  var newHex = '#000';
  var colors = [];
  var mod = typeof mod == "number" ? mod : 2;

  if (/^#[\dA-F]{3}$/.test(hex)) {
    hex.toUpperCase().slice(1).split('').forEach(function(val) {
      var color = Math.round(parseInt('0x' + val + val, 16) * mod);
      colors.push(convertDecToHex(color < 255 ? color : 255));
    });
    newHex = '#' + colors.join('');
  }
  else if (/^#[\dA-F]{6}$/.test(hex)) {
    hex.toUpperCase().slice(1).match(/.{2}/g).forEach(function(val) {
      var color = Math.round(parseInt('0x' + val, 16) * mod);
      colors.push(convertDecToHex(color < 255 ? color : 255));
    });
    newHex = '#' + colors.join('');
  }

  return newHex;
}
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

var VALID_COLORS = [
  'default',
  'silver',
  'gray',
  'white',
  'maroon',
  'red',
  'purple',
  'fuchsia',
  'green',
  'lime',
  'olive',
  'yellow',
  'navy',
  'blue',
  'teal',
  'aqua',
  'orange',
  'aliceblue',
  'antiquewhite',
  'aquamarine',
  'azure',
  'beige',
  'bisque',
  'blanchedalmond',
  'blueviolet',
  'brown',
  'burlywood',
  'cadetblue',
  'chartreuse',
  'chocolate',
  'coral',
  'cornflowerblue',
  'cornsilk',
  'crimson',
  'darkblue',
  'darkcyan',
  'darkgoldenrod',
  'darkgray',
  'darkgreen',
  'darkgrey',
  'darkkhaki',
  'darkmagenta',
  'darkolivegreen',
  'darkorange',
  'darkorchid',
  'darkred',
  'darksalmon',
  'darkseagreen',
  'darkslateblue',
  'darkslategray',
  'darkslategrey',
  'darkturquoise',
  'darkviolet',
  'deeppink',
  'deepskyblue',
  'dimgray',
  'dimgrey',
  'dodgerblue',
  'firebrick',
  'floralwhite',
  'forestgreen',
  'gainsboro',
  'ghostwhite',
  'gold',
  'goldenrod',
  'greenyellow',
  'grey',
  'honeydew',
  'hotpink',
  'indianred',
  'indigo',
  'ivory',
  'khaki',
  'lavender',
  'lavenderblush',
  'lawngreen',
  'lemonchiffon',
  'lightblue',
  'lightcoral',
  'lightcyan',
  'lightgoldenrodyellow',
  'lightgray',
  'lightgreen',
  'lightgrey',
  'lightpink',
  'lightsalmon',
  'lightseagreen',
  'lightskyblue',
  'lightslategray',
  'lightslategrey',
  'lightsteelblue',
  'lightyellow',
  'limegreen',
  'linen',
  'mediumaquamarine',
  'mediumblue',
  'mediumorchid',
  'mediumpurple',
  'mediumseagreen',
  'mediumslateblue',
  'mediumspringgreen',
  'mediumturquoise',
  'mediumvioletred',
  'midnightblue',
  'mintcream',
  'mistyrose',
  'moccasin',
  'navajowhite',
  'oldlace',
  'olivedrab',
  'orangered',
  'orchid',
  'palegoldenrod',
  'palegreen',
  'paleturquoise',
  'palevioletred',
  'papayawhip',
  'peachpuff',
  'peru',
  'pink',
  'plum',
  'powderblue',
  'rosybrown',
  'royalblue',
  'saddlebrown',
  'salmon',
  'sandybrown',
  'seagreen',
  'seashell',
  'sienna',
  'skyblue',
  'slateblue',
  'slategray',
  'slategrey',
  'snow',
  'springgreen',
  'steelblue',
  'tan',
  'thistle',
  'tomato',
  'turquoise',
  'violet',
  'wheat',
  'whitesmoke',
  'yellowgreen',
  'rebeccapurple',
];

var ASCII = {
  end: centerAscii("\n\n\n\n*         *\n\n\n**\\/^^^^^\\/**\n^^/\\_/\\^^\n\n\n\nYOU'RE DEAD"),
  map5: [
    "5",
    " /--------\\                            /-------\\",
    " |::::::::|       /---\\               /::::::::|",
    " |::L:::::|       |::L|               |:::::L::|",
    " |::::::::|       \\---/               |::::::::|",
    " \\--------/                           \\--------/",
    "                   /--------\\",
    "                  /::::::::::\\",
    "                 /:::/-0--\\:::\\",
    "                 |:::|::::|:::|",
    "                 |:::|:L::|:::|",
    "                 \\:::\\----/:::/",
    " /-------\\        \\::::::::::/        /--------\\",
    " |:::::::|         \\--------/         |::::::::|",
    " |::L::::|                            |:::::L::|",
    " |:::::::|                            |::::::::|",
    " \\-------/                            \\--------/",
  ],
  map4: [
    "4",
    " /--------\\                            /-------\\",
    " |::::::::|        /----------\\   /---/::::::::|",
    " |::L:::::|        |:L::::::::|   |:::0:::::L::|",
    " |::::::::|        |::::::::::\\---|:::|::::::::|",
    " \\---0----/--------\\:::::L:::::\\::|:::|----0---/",
    "  |::::::0::::::::::0::::::::::/\\:|:::|:::::::|",
    "  \\:::::/:::::::::::|-----0---|::\\|:::|::|-|::|",
    "   |::::|:::::::::::0:::::::::0:::\\-0-/::|:|::/",
    "   |::::|::::::::::/:::::::::/:::::::::::|:/:|",
    "  /:::::|::::/-----|:::L::::/------------|/:::\\",
    "  |:::::|:::/::::::|::::::::0::::::::::::0::::|",
    " /---0---\\::0::::::|::::::::|:::::::::/--|-0---\\",
    " |:::::::|::/::::::/--------\\:::::::::|::::::::|",
    " |::L::::|:/::::::/          \\::::::::|:::::L::|",
    " |:::::::|/------/            \\------\\|::::::::|",
    " \\-------/                            \\--------/",
  ],
  map3: [
    "3",
    " /--------\\                               /----\\",
    " |::::::::|        /----------\\      /---/:::::|",
    " |::::::::|        |::::::::::|      |:::::::::|",
    " \\---0----|        |::::::::::|------|:::::::::|",
    "  |::::::::\\-------/:::::L::::|::::::\\----0----/",
    "  |:::::::::::::::/::::::::::::\\:::::|::::::::|",
    "   \\---\\:::::::::|---0------0---\\----/:::|-|0-|",
    "        |:::::::0:::::::::::::::0::::::::|:|::|",
    "        |---0--/:::::::/--------\\------0-|:/::|",
    "        0::::::|------/::B:::B:::\\:::::::|/:::|",
    "        |---0--\\:B::::::::::::::::0:::::/:::::|",
    "        |:::::::\\::::B:::B:::B:::/-----/|:::::/",
    "       /:::::::::|--------------/:::::::0:/--/",
    "       |:::::::::0::::::::::::::::L:::::|/",
    "       \\---------\\::::::::::::::::/-----/",
    "                  \\--------------/",
  ],
  map2: [
    "2",
    "",
    "   /-----\                            /-----\\",
    "   |:::::|          /-------\\        /:::::::\\",
    "   |:::::|         /:::::::::\\-------|:::::::|",
    "   \\--\\:::\\-------/:::/-0-\\:::\\::::::0:::::::|",
    "       \\::0::::::/:::/:::::\\:::\\:::::|:::::::|",
    "        |-/::::::|::/:::::::\\::|-----|-0-|-|0|",
    "        |:::::L::|::|:::+:::|::|:::::|:::|:|:|",
    "        |::::::::0::|::+o+::|::0:::::|-0-|:|:|",
    "        |---0--\\:|::|:::+:::|::|::|::/:::|/::/",
    "        |:::::::\\|::\\:::::::/::|::|-/::::|::/",
    "        |::::::::\\:::\\:::::/:::/::::::::/::/",
    "        \\:::::::::\\:::\\-0-/:::/--------|::/",
    "         \\---------\\:::::::::/::::L::::0:/",
    "                    \\-------/----------|/",
  ],
  map1: [
    "1",
    "",
    "",
    "",
    "                   /---------\\",
    "                  /:::::[][][]\\",
    "          /------/[][]:[][]::[]\\------\\",
    "         /:::::::\\[]:::[][]::[]/:::::::\\",
    "         |::::L:::\\--0-----0--/::::::::|",
    "         |:::::::::0:::::::::0:::::::::|",
    "         |:::::::::|/---0---\\|:::::::::|",
    "         |:::::::::/[][][]:[]\\:::::::::|",
    "         \\::::::::/[][][]:::[]\\::::::::/",
    "          \\-------\\:::::::[][]/-------/",
    "                   \\---------/",
  ],
}
function centerAscii(ascii) {
  return ascii.split("\n").map(function(line) {
    var centered = line;
    if (line.length > 0) {
      for (var i = 0; i < Math.floor((TERMINAL_MESSAGE_CHARS - line.length) / 2); i++) {
        centered = ' ' + centered;
      }
    }
    return centered;
  });
}
