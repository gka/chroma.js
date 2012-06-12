var chroma = require('../dist/chroma.pack.js');

var data = [{ name: 'Foo', val: 123 }, { name: 'Blub', val: 60 }, { name: 'Bar', val: 10 }];

console.log(chroma.limits(data, 'e', 7, 'val', function(e) { return e.name != 'Foo'; } ));
console.log(chroma.limits(data, 'e', 7, 'val' ));