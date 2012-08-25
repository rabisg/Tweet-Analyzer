function merge(array, elem)
{
	var i;
	for(i=0; i<array.length; i++)
		if(array[i].locations[0].woeid == elem.locations[0].woeid)
			array[i] = elem;
	if(i==array.length)
		array.push(elem);
}
exports.merge = merge;
