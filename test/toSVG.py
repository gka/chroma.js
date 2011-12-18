from grapefruit import Color


from svgfig import SVG,canvas,Text

w = 522
h = 800
		
svg = canvas(width='%dpx' % w, height='%dpx' % h, viewBox='0 0 %d %d' % (w, h), enable_background='new 0 0 %d %d' % (w, h), style='stroke:none;')

yo = 10

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
	svg.append(Text(23,yo+15,k,style='font-size:12px').SVG())
	svg.append(SVG('rect',10,y=yo,width=20,height=20,fill=c.html))
	yo += 24
	
svg.firefox()
