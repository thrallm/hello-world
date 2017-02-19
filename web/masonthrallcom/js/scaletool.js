// Make a map
function StartMap(map_canvas, lat, lng) {
	var manAndNatureMapType = new google.maps.StyledMapType(ManAndNatureStyle, {name: "man and nature"});
	var manAndNatureMapTypeWithLabels = new google.maps.StyledMapType(ManAndNatureStyleWithLabels, {name: "with labels"});
	var mapOptions = {
	    zoom: parseInt(document.getElementById('zoomlevel').innerHTML),
	    center: new google.maps.LatLng(lat,lng),
	    zoomControl: false,
	    panControl: false,
	    mapTypeControlOptions: {
			mapTypeIds: ['man_and_nature', 'man_and_nature_with_labels', google.maps.MapTypeId.ROADMAP, google.maps.MapTypeId.SATELLITE]
	    }
	};
	var map = new google.maps.Map(document.getElementById(map_canvas), mapOptions);
	map.mapTypes.set('man_and_nature', manAndNatureMapType);
	map.mapTypes.set('man_and_nature_with_labels', manAndNatureMapTypeWithLabels);
	map.setMapTypeId('man_and_nature');
	//map.setOptions({styles: newStyle});
	//var overlay = new google.maps.KmlLayer("http://dl.dropbox.com/u/18063657/city_sizes/CityOutlines.kml", {preserveViewport: true}); 
	//overlay.setMap(map);
	return map;
}

// Connect the two maps
function LinkMaps(map0, map1) {
	google.maps.event.addListener(map0, 'mouseover', function() {
		map0.master = true;
		map1.master = false;
	});
	google.maps.event.addListener(map0, 'zoom_changed', function() {
		if (map0.master == true) {
			var newzoom = map0.getZoom();
			document.getElementById('zoomlevel').innerHTML=newzoom;
			map1.setZoom(newzoom);
		}
	});
	google.maps.event.addListener(map0, 'maptypeid_changed', function() {
		if (map0.master == true) {		
			var x = map0.getMapTypeId();
			map1.setMapTypeId(x);
		}
	});
	google.maps.event.addListener(map0, 'heading_changed', function() {
		if (map0.master == true) {
			var h = map0.getHeading();
			map1.setHeading(h);
		}
	});
}

// Start
function initialize() {
	geocoder = new google.maps.Geocoder();
	map0 = StartMap("map_canvas0", 39.7391536007426, -104.98470339855373);
	map1 = StartMap("map_canvas1", 37.77492950021904, -122.41941550062131);
	GeoCodeAddress(map0, 'address0');
	GeoCodeAddress(map1, 'address1');
	LinkMaps(map0, map1);
	LinkMaps(map1, map0);
}

// Geocode address
function GeoCodeAddress(map, a) {
	var address = document.getElementById(a).value;
	geocoder.geocode( { 'address': address}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			map.setCenter(results[0].geometry.location);
		} else {
			alert("Geocode was not successful for the following reason: " + status);
		}
	});
}

// Globals
var geocoder;
var map0;
var map1;

// Shortcuts
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