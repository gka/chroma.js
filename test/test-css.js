var chroma = require('../chroma.js');

var test = [
	"rgb(255, 0, 10)",
	"rgb(355, 0, 10)",
	"rgb(255,0,10)",
	"rgb(0,0,-20)",
	"rgb(100%, 0%, 0%)",
	"hsl(0, 100%, 50%)",
	"hsl(120,100%,50%)",
	"hsl(120, 100%, 25%)",
	"whitesmoke",
	"yellowgreen"
];

for (var i in test) {
	var col = chroma.color(test[i]);
	console.log(test[i],'-->', col.rgb(), col.hex());
}
