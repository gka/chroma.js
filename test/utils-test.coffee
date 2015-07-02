require 'es6-shim'
vows = require 'vows'
assert = require 'assert'
chroma = require '../chroma'

unpack = (args) ->
    if args.length >= 3
        [].slice.call args
    else
        args[0]

vows
    .describe('Some tests for utils')

    .addBatch

        'unpack arguments':
            topic: [1,2,3]
            'unpacked from array': (t) -> assert.deepEqual unpack(t), [1,2,3]
            'unpacked from single values': (t) -> assert.deepEqual unpack([t]), [1,2,3]
            

    .export(module)
