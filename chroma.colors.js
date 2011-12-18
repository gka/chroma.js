(function() {

  /**
  	ColorBrewer colors for chroma.js
  
  	Copyright (c) 2002 Cynthia Brewer, Mark Harrower, and The 
  	Pennsylvania State University.
  
  	Licensed under the Apache License, Version 2.0 (the "License"); 
  	you may not use this file except in compliance with the License.
  	You may obtain a copy of the License at	
  	http://www.apache.org/licenses/LICENSE-2.0
  
  	Unless required by applicable law or agreed to in writing, software distributed
  	under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
  	CONDITIONS OF ANY KIND, either express or implied. See the License for the
  	specific language governing permissions and limitations under the License.
  */

  var brewer, chroma, colors, root, _ref, _ref2;

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  chroma = (_ref = root.chroma) != null ? _ref : root.chroma = {};

  chroma.brewer = brewer = {};

  brewer.OrRd = ['#fef0d9', '#fdd49e', '#fdbb84', '#fc8d59', '#ef6548', '#d7301f', '#990000'];

  brewer.PuBu = ['#f1eef6', '#d0d1e6', '#a6bddb', '#74a9cf', '#3690c0', '#0570b0', '#034e7b'];

  brewer.BuPu = ['#edf8fb', '#bfd3e6', '#9ebcda', '#8c96c6', '#8c6bb1', '#88419d', '#6e016b'];

  brewer.Oranges = ['#feedde', '#fdd0a2', '#fdae6b', '#fd8d3c', '#f16913', '#d94801', '#8c2d04'];

  brewer.BuGn = ['#edf8fb', '#ccece6', '#99d8c9', '#66c2a4', '#41ae76', '#238b45', '#005824'];

  brewer.YlOrBr = ['#ffffd4', '#fee391', '#fec44f', '#fe9929', '#ec7014', '#cc4c02', '#8c2d04'];

  brewer.YlGn = ['#ffffcc', '#d9f0a3', '#addd8e', '#78c679', '#41ab5d', '#238443', '#005a32'];

  brewer.Reds = ['#fee5d9', '#fcbba1', '#fc9272', '#fb6a4a', '#ef3b2c', '#cb181d', '#99000d'];

  brewer.RdPu = ['#feebe2', '#fcc5c0', '#fa9fb5', '#f768a1', '#dd3497', '#ae017e', '#7a0177'];

  brewer.Greens = ['#edf8e9', '#c7e9c0', '#a1d99b', '#74c476', '#41ab5d', '#238b45', '#005a32'];

  brewer.YlGnBu = ['#ffffcc', '#c7e9b4', '#7fcdbb', '#41b6c4', '#1d91c0', '#225ea8', '#0c2c84'];

  brewer.Purples = ['#f2f0f7', '#dadaeb', '#bcbddc', '#9e9ac8', '#807dba', '#6a51a3', '#4a1486'];

  brewer.GnBu = ['#f0f9e8', '#ccebc5', '#a8ddb5', '#7bccc4', '#4eb3d3', '#2b8cbe', '#08589e'];

  brewer.Greys = ['#f7f7f7', '#d9d9d9', '#bdbdbd', '#969696', '#737373', '#525252', '#252525'];

  brewer.YlOrRd = ['#ffffb2', '#fed976', '#feb24c', '#fd8d3c', '#fc4e2a', '#e31a1c', '#b10026'];

  brewer.PuRd = ['#f1eef6', '#d4b9da', '#c994c7', '#df65b0', '#e7298a', '#ce1256', '#91003f'];

  brewer.Blues = ['#eff3ff', '#c6dbef', '#9ecae1', '#6baed6', '#4292c6', '#2171b5', '#084594'];

  brewer.PuBuGn = ['#f6eff7', '#d0d1e6', '#a6bddb', '#67a9cf', '#3690c0', '#02818a', '#016450'];

  brewer.Spectral = ['#d53e4f', '#fc8d59', '#fee08b', '#ffffbf', '#e6f598', '#99d594', '#3288bd'];

  brewer.RdYlGn = ['#d73027', '#fc8d59', '#fee08b', '#ffffbf', '#d9ef8b', '#91cf60', '#1a9850'];

  brewer.RdBu = ['#b2182b', '#ef8a62', '#fddbc7', '#f7f7f7', '#d1e5f0', '#67a9cf', '#2166ac'];

  brewer.PiYG = ['#c51b7d', '#e9a3c9', '#fde0ef', '#f7f7f7', '#e6f5d0', '#a1d76a', '#4d9221'];

  brewer.PRGn = ['#762a83', '#af8dc3', '#e7d4e8', '#f7f7f7', '#d9f0d3', '#7fbf7b', '#1b7837'];

  brewer.RdYlBu = ['#d73027', '#fc8d59', '#fee090', '#ffffbf', '#e0f3f8', '#91bfdb', '#4575b4'];

  brewer.BrBG = ['#8c510a', '#d8b365', '#f6e8c3', '#f5f5f5', '#c7eae5', '#5ab4ac', '#01665e'];

  brewer.RdGy = ['#b2182b', '#ef8a62', '#fddbc7', '#ffffff', '#e0e0e0', '#999999', '#4d4d4d'];

  brewer.PuOr = ['#b35806', '#f1a340', '#fee0b6', '#f7f7f7', '#d8daeb', '#998ec3', '#542788'];

  brewer.Set2 = ['#66c2a5', '#fc8d62', '#8da0cb', '#e78ac3', '#a6d854', '#ffd92f', '#e5c494'];

  brewer.Accent = ['#7fc97f', '#beaed4', '#fdc086', '#ffff99', '#386cb0', '#f0027f', '#bf5b17'];

  brewer.Set1 = ['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33', '#a65628'];

  brewer.Set3 = ['#8dd3c7', '#ffffb3', '#bebada', '#fb8072', '#80b1d3', '#fdb462', '#b3de69'];

  brewer.Dark2 = ['#1b9e77', '#d95f02', '#7570b3', '#e7298a', '#66a61e', '#e6ab02', '#a6761d'];

  brewer.Paired = ['#a6cee3', '#1f78b4', '#b2df8a', '#33a02c', '#fb9a99', '#e31a1c', '#fdbf6f'];

  brewer.Pastel2 = ['#b3e2cd', '#fdcdac', '#cbd5e8', '#f4cae4', '#e6f5c9', '#fff2ae', '#f1e2cc'];

  brewer.Pastel1 = ['#fbb4ae', '#b3cde3', '#ccebc5', '#decbe4', '#fed9a6', '#ffffcc', '#e5d8bd'];

  /**
  	Grapefruit colors for chroma.js
  
  	Copyright (c) 2008, Xavier Basty
    
  	Licensed under the Apache License, Version 2.0 (the "License");
  	you may not use this file except in compliance with the License.
  	You may obtain a copy of the License at
  	  
  	http://www.apache.org/licenses/LICENSE-2.0
  	  
  	Unless required by applicable law or agreed to in writing, software
  	distributed under the License is distributed on an "AS IS" BASIS,
  	WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  	See the License for the specific language governing permissions and
  	limitations under the License.
  */

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  chroma = (_ref2 = root.chroma) != null ? _ref2 : root.chroma = {};

  chroma.colors = colors = {};

  colors.indigo = "#4b0082";

  colors.gold = "#ffd700";

  colors.hotpink = "#ff69b4";

  colors.firebrick = "#b22222";

  colors.indianred = "#cd5c5c";

  colors.yellow = "#ffff00";

  colors.mistyrose = "#ffe4e1";

  colors.darkolivegreen = "#556b2f";

  colors.olive = "#808000";

  colors.darkseagreen = "#8fbc8f";

  colors.pink = "#ffc0cb";

  colors.tomato = "#ff6347";

  colors.lightcoral = "#f08080";

  colors.orangered = "#ff4500";

  colors.navajowhite = "#ffdead";

  colors.lime = "#00ff00";

  colors.palegreen = "#98fb98";

  colors.darkslategrey = "#2f4f4f";

  colors.greenyellow = "#adff2f";

  colors.burlywood = "#deb887";

  colors.seashell = "#fff5ee";

  colors.mediumspringgreen = "#00fa9a";

  colors.fuchsia = "#ff00ff";

  colors.papayawhip = "#ffefd5";

  colors.blanchedalmond = "#ffebcd";

  colors.chartreuse = "#7fff00";

  colors.dimgray = "#696969";

  colors.black = "#000000";

  colors.peachpuff = "#ffdab9";

  colors.springgreen = "#00ff7f";

  colors.aquamarine = "#7fffd4";

  colors.white = "#ffffff";

  colors.orange = "#ffa500";

  colors.lightsalmon = "#ffa07a";

  colors.darkslategray = "#2f4f4f";

  colors.brown = "#a52a2a";

  colors.ivory = "#fffff0";

  colors.dodgerblue = "#1e90ff";

  colors.peru = "#cd853f";

  colors.lawngreen = "#7cfc00";

  colors.chocolate = "#d2691e";

  colors.crimson = "#dc143c";

  colors.forestgreen = "#228b22";

  colors.darkgrey = "#a9a9a9";

  colors.lightseagreen = "#20b2aa";

  colors.cyan = "#00ffff";

  colors.mintcream = "#f5fffa";

  colors.silver = "#c0c0c0";

  colors.antiquewhite = "#faebd7";

  colors.mediumorchid = "#ba55d3";

  colors.skyblue = "#87ceeb";

  colors.gray = "#808080";

  colors.darkturquoise = "#00ced1";

  colors.goldenrod = "#daa520";

  colors.darkgreen = "#006400";

  colors.floralwhite = "#fffaf0";

  colors.darkviolet = "#9400d3";

  colors.darkgray = "#a9a9a9";

  colors.moccasin = "#ffe4b5";

  colors.saddlebrown = "#8b4513";

  colors.grey = "#808080";

  colors.darkslateblue = "#483d8b";

  colors.lightskyblue = "#87cefa";

  colors.lightpink = "#ffb6c1";

  colors.mediumvioletred = "#c71585";

  colors.slategrey = "#708090";

  colors.red = "#ff0000";

  colors.deeppink = "#ff1493";

  colors.limegreen = "#32cd32";

  colors.darkmagenta = "#8b008b";

  colors.palegoldenrod = "#eee8aa";

  colors.plum = "#dda0dd";

  colors.turquoise = "#40e0d0";

  colors.lightgrey = "#d3d3d3";

  colors.lightgoldenrodyellow = "#fafad2";

  colors.darkgoldenrod = "#b8860b";

  colors.lavender = "#e6e6fa";

  colors.maroon = "#800000";

  colors.yellowgreen = "#9acd32";

  colors.sandybrown = "#f4a460";

  colors.thistle = "#d8bfd8";

  colors.violet = "#ee82ee";

  colors.navy = "#000080";

  colors.magenta = "#ff00ff";

  colors.dimgrey = "#696969";

  colors.tan = "#d2b48c";

  colors.rosybrown = "#bc8f8f";

  colors.olivedrab = "#6b8e23";

  colors.blue = "#0000ff";

  colors.lightblue = "#add8e6";

  colors.ghostwhite = "#f8f8ff";

  colors.honeydew = "#f0fff0";

  colors.cornflowerblue = "#6495ed";

  colors.slateblue = "#6a5acd";

  colors.linen = "#faf0e6";

  colors.darkblue = "#00008b";

  colors.powderblue = "#b0e0e6";

  colors.seagreen = "#2e8b57";

  colors.darkkhaki = "#bdb76b";

  colors.snow = "#fffafa";

  colors.sienna = "#a0522d";

  colors.mediumblue = "#0000cd";

  colors.royalblue = "#4169e1";

  colors.lightcyan = "#e0ffff";

  colors.green = "#008000";

  colors.mediumpurple = "#9370db";

  colors.midnightblue = "#191970";

  colors.cornsilk = "#fff8dc";

  colors.paleturquoise = "#afeeee";

  colors.bisque = "#ffe4c4";

  colors.slategray = "#708090";

  colors.darkcyan = "#008b8b";

  colors.khaki = "#f0e68c";

  colors.wheat = "#f5deb3";

  colors.teal = "#008080";

  colors.darkorchid = "#9932cc";

  colors.deepskyblue = "#00bfff";

  colors.salmon = "#fa8072";

  colors.darkred = "#8b0000";

  colors.steelblue = "#4682b4";

  colors.palevioletred = "#db7093";

  colors.lightslategray = "#778899";

  colors.aliceblue = "#f0f8ff";

  colors.lightslategrey = "#778899";

  colors.lightgreen = "#90ee90";

  colors.orchid = "#da70d6";

  colors.gainsboro = "#dcdcdc";

  colors.mediumseagreen = "#3cb371";

  colors.lightgray = "#d3d3d3";

  colors.mediumturquoise = "#48d1cc";

  colors.lemonchiffon = "#fffacd";

  colors.cadetblue = "#5f9ea0";

  colors.lightyellow = "#ffffe0";

  colors.lavenderblush = "#fff0f5";

  colors.coral = "#ff7f50";

  colors.purple = "#800080";

  colors.aqua = "#00ffff";

  colors.whitesmoke = "#f5f5f5";

  colors.mediumslateblue = "#7b68ee";

  colors.darkorange = "#ff8c00";

  colors.mediumaquamarine = "#66cdaa";

  colors.darksalmon = "#e9967a";

  colors.beige = "#f5f5dc";

  colors.blueviolet = "#8a2be2";

  colors.azure = "#f0ffff";

  colors.lightsteelblue = "#b0c4de";

  colors.oldlace = "#fdf5e6";

}).call(this);
