function merge(array, elem)
{
	var i;
	for(i=0; i<array.length; i++)
		if(array[i].locations[0].woeid == elem.locations[0].woeid)
			array[i] = elem;
	if(i==array.length)
		array.push(elem);
}

function moodAnalyze(text2) {
	var text='happily 1 happiness 1 happy 1 sad -1 sadden -1 sadly -1 sadness -1 safe 1 anger -1 angrily -1 angriness -1 angry -1 exceptionally 1 excessive -1 excessively -1 excite 1 excited 1 excitedly 1 excitedness 1 excitement 1 frustrate -1 frustrated -1 frustrating -1 frustratingly -1 frustration -1 fulfillment 1 hope 1 hopeful 1 hopefully 1 hopefulness 1 hopeless -1 hopelessly -1 hopelessness -1 hopes 1 good 1 goodly 1 goodness 1 goodwill 1 great 1 greatest 1 greatly 0 greatness 1 greed -1 greedy -1 greet 1 grief -1';
	var lk2=new Array();
	var lk=new Array();
	lk = text.split(" ");
	lk2 = text2.split(" ");
	var m={};
	var k2 = {'positive':0,'negative':0,'neutral':0};
	for (var i=0;i<lk.length;i++){
		if (!(lk[i]=='1' || lk[i]=='0' || lk[i]=='-1')){
				m[lk[i]]=parseInt(lk[i+1]);
		}
	}
	for (var i=0;i<lk2.length;i++){
		document.getElementById('qw').innerHTML+=lk2[i]+'</br>';
		if (lk2[i] in m){
			console.log(lk2[i]);
			console.log(m[lk2[i]]);
			if (m[lk2[i]]==1)
				k2['positive']+=1;
			else if(m[lk2[i]]==0)
				k2['neutral']+=0;
			else if(m[lk2[i]]==-1)
				k2['negative']-=1;
		}
	}
	for (var i=0;i<lk.length;i++){
		if (m.length!=0){
			if (lk[i] in m)
			{
				m[lk[i]]+=1;
			}
			else{
				m[lk[i]]=1;
			}
		}
		else{
			m[lk[i]]=1;
		}
	}
	var qw = k2['positive']+k2['neutal']+k2['negative'];
	if(qw>0) return 'happy';
	else if(qw<0) return 'sad';
	else return 'soso';
}
exports.moodAnalyze = moodAnalyze;
exports.merge = merge;
