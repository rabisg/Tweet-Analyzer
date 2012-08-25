var map = null;
	    var content ='';
	    var name='';

var icon=new Array();
icon[0] = "http://chart.apis.google.com/chart?cht=mm&chs=24x32&chco=FFFFFF,008CFF,000000&ext=.png";
icon[1] = "http://chart.apis.google.com/chart?cht=mm&chs=24x32&chco=FFFFFF,008CFF,000000&ext=.png";
icon[2] = "http://chart.apis.google.com/chart?cht=mm&chs=24x32&chco=FFFFFF,F32CF0,000000&ext=.png";
icon[3] = "http://chart.apis.google.com/chart?cht=mm&chs=24x32&chco=FFFFFF,A344AF,000000&ext=.png";
icon[4] = "http://chart.apis.google.com/chart?cht=mm&chs=24x32&chco=FFFFFF,A7832F,000000&ext=.png";
icon[5] = "http://chart.apis.google.com/chart?cht=mm&chs=24x32&chco=FFFFFF,9BFF34,000000&ext=.png";
icon[6] = "http://chart.apis.google.com/chart?cht=mm&chs=24x32&chco=FFFFFF,07FFF7,000000&ext=.png";
icon[7] = "http://chart.apis.google.com/chart?cht=mm&chs=24x32&chco=FFFFFF,0FFAAA,000000&ext=.png";
icon[8] = "http://chart.apis.google.com/chart?cht=mm&chs=24x32&chco=FFFFFF,008C12,000000&ext=.png";
icon[9] = "http://chart.apis.google.com/chart?cht=mm&chs=24x32&chco=FFFFFF,AABA4F,000000&ext=.png";
icon[10] = "https://chart.googleapis.com/chart?chst=d_bubble_text_small&chld=bb|";

var markerArray = []; //create a global array to store markers
var pointnew=new google.maps.LatLng(43.907787, -79.359741);


function initialize() {
    document.getElementById("map_canvas").innerHTML='sdsd';
    var myOptions = {
        zoom: 2,
        center: new google.maps.LatLng(43.907787, -79.359741),
        mapTypeControl: true,
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
        },
        navigationControl: true,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);

    var mcOptions = {
        gridSize: 0,
        maxZoom: 1
    };
    google.maps.event.addListener(map, 'click', function() {
        infowindow.close();
    });
	
}

	  var socket = io.connect('localhost');
	  socket.on('init', function (data) {
	    console.log(2);
	    for (var i=0;i < data.length;i++){
			for (var j=0;j<50;j++)
			{
					if ( data[i].locations[0].name==country.country[j].countryName){
					console.log(country.country[j].countryName);
					var p1=parseFloat(country.country[j].north);
					var p2=parseFloat(country.country[j].south);
					var p3=parseFloat(country.country[j].east);
					var p4=parseFloat(country.country[j].west);
					name=country.country[j].countryName;
					for(var kkk=0; kkk<10; kkk++){
						latlng=new google.maps.LatLng((p1+p2)/2+((Math.random()*2-1)*((p1-p2)/2)),(p3+p4)/2+((Math.random()*2-1)*((p3-p4)/2)));
		
		var infowindow = new google.maps.InfoWindow({
			size: new google.maps.Size(400, 200)
		});				
	var marker = new google.maps.Marker({
        position: latlng,
        map: map,
        icon: icon[10]+escape(data[i].trends[kkk].name)+"|C6EF8C|000000"
    });
    
marker.content=country.country[j].countryName;
marker.note=country.country[j];

    
google.maps.event.addListener(marker, 'click', function() {
		document.getElementById('new').innerHTML=this.content+"  "+this.note.population;
		infowindow.content=this.content;
		infowindow.setPosition(pointnew);
		//document.getElementById("tweets").innerHTML='qwqw';
		this.setAnimation(google.maps.Animation.BOUNCE);
        infowindow.open(map, this);
});

					}
					}
					}
					}
	  });
	  window.onload = initialize;