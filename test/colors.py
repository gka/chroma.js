from grapefruit import Color

for k in Color.NAMED_COLOR:
	c = Color.NewFromHtml(Color.NAMED_COLOR[k], wref=Color.WHITE_REFERENCE['std_D50'])
	out = [k]
	out.append(c.html)
	r,g,b = c.rgb
	out.append([int(r*255),int(g*255),int(b*255)])
	out.append(list(c.hsv))
	out.append(list(c.hsl))
	l,a,b = c.lab
	out.append([l/100.0,a,b])
	#print 'colors.push( ' + str(out) +' );'
	print 'colors.'+k+' = "'+c.html+'"'
