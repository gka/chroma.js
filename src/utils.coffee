###
utils.coffee
###

root = (exports ? this)	

type = do ->
	###
	for browser-safe type checking+
	ported from jQuery's $.type
	###
	classToType = {}
	for name in "Boolean Number String Function Array Date RegExp Undefined Null".split(" ")
		classToType["[object " + name + "]"] = name.toLowerCase()
	
	(obj) ->
		strType = Object::toString.call(obj)
		classToType[strType] or "object"
    
root.type ?= type


Array.max = (array) ->
	Math.max.apply Math, array 

Array.min = (array) ->
	Math.min.apply Math, array 
	
