function startMap(map_canvas,lat,lng) {
	var newMapType = new google.maps.StyledMapType(newStyle, {name: "man and nature"});
	var mapOptions = {
	    zoom: parseInt(document.getElementById('zoomlevel').innerHTML),
	    center: new google.maps.LatLng(lat,lng),
	    //disableDefaultUI: true,
	    zoomControl: false,
	    panControl: false,
	    mapTypeControlOptions: {
			mapTypeIds: ['new', 'parks', 'roads', google.maps.MapTypeId.ROADMAP, google.maps.MapTypeId.SATELLITE]
	    }
	};
	var map = new google.maps.Map(document.getElementById(map_canvas), mapOptions);
	map.mapTypes.set('new', newMapType);
	map.setMapTypeId('new');
	//map.setOptions({styles: newStyle});
	//var overlay = new google.maps.KmlLayer("http://dl.dropbox.com/u/18063657/city_sizes/CityOutlines.kml", {preserveViewport: true}); 
	//overlay.setMap(map);
	return map;
}
	
	//shortcuts
document.onkeyup=function(e) {
	if(e.which == 65) document.getElementById('rotationstatus').innerHTML="up";
	if(e.which == 68) document.getElementById('rotationstatus').innerHTML="up";
}
document.onkeydown=function(e) {
	if(e.which == 65) {
		var heading=map0.getHeading();
		document.getElementById('rotationstatus').innerHTML=heading;
		if (heading==null) {
			var heading = 0;
		}
		map0.setHeading(heading+90);
	}
	if(e.which == 68) {
		var heading=map0.getHeading();
		document.getElementById('rotationstatus').innerHTML=heading;
		if (heading==null) {
			var heading = 0;
		}
		map0.setHeading(heading-90);
	}
}
	
function LinkMaps(map0, map1) {
	google.maps.event.addListener(map0, 'zoom_changed', function() {
		var newzoom = map0.getZoom();
		document.getElementById('zoomlevel').innerHTML=newzoom;
		map1.setZoom(newzoom);
	});
	google.maps.event.addListener(map0, 'maptypeid_changed', function() {
		var x = map0.getMapTypeId();
		map1.setMapTypeId(x);
	});
	google.maps.event.addListener(map0, 'heading_changed', function() {
		var h = map0.getHeading();
		map1.setHeading(h);
	});
}
	
function initialize() {
	geocoder = new google.maps.Geocoder();
	map0 = startMap("map_canvas0",39.7391536007426,-104.98470339855373);
	map1 = startMap("map_canvas1",37.77492950021904,-122.41941550062131);
	codeAddress(map0,'address0');
	codeAddress(map1,'address1');
	map1.setOptions({disableDoubleClickZoom: true,scrollwheel: false});
	LinkMaps(map0, map1);
	//LinkMaps(map1, map0);
}
	
function codeAddress(map,a) {
	var address = document.getElementById(a).value;
	geocoder.geocode( { 'address': address}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			map.setCenter(results[0].geometry.location);
		} else {
			alert("Geocode was not successful for the following reason: " + status);
		}
	});
}

function switchListeners() {
	
}