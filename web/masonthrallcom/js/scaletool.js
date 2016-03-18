function startMap(map_canvas,lat,lng) {
var zombieStyles = [
	{
		elementType: "labels",
		stylers: [
		{ visibility: "off" }
		]
	},{
	featureType: "administrative",
	stylers: [
	{ visibility: "off" }
	]
	},{
	featureType: "poi",
	stylers: [
	{ visibility: "off" }
	]
	},{
	featureType: "road",
	stylers: [
	{ visibility: "off" }
	]
	},{
	featureType: "transit",
	stylers: [
	{ visibility: "off" }
	]
	},{
	featureType: "landscape.man_made",
	elementType: "geometry",
	stylers: [
	{ visibility: "on" },
	{ invert_lightness: true }
	]
	}
];
	  
	  var parkStyles = [
	  {
	    featureType: "all",
	    elementType: "geometry",
	    stylers: [
	      { visibility: 'off' }
	    ]
	  },
	  {
	    featureType: "all",
	    elementType: "labels",
	    stylers: [
	      { visibility: 'off' }
	    ]
	   },
	   {
	      featureType: "water",
	      elementType: "geometry",
	      stylers: [
	        { visibility: 'on' }
	      ]
	    },
	   {
	      featureType: "poi.park",
	      elementType: "geometry",
	      stylers: [
	        { visibility: 'on' },
		{ lightness: -20 }
	      ]
	    },
	   {
	      featureType: "landscape.man_made",
	      elementType: "geometry",
	      stylers: [
	        { visibility: 'on' },
		{ lightness: -100 }
	      ]
	    }
	  ];
	  
	  var roadStyles = [
	  {
	    featureType: "all",
	    elementType: "geometry",
	    stylers: [
	      { visibility: 'off' }
	    ]
	  },
	  {
	    featureType: "all",
	    elementType: "labels",
	    stylers: [
	      { visibility: 'off' }
	    ]
	   },
	   {
	      featureType: "water",
	      elementType: "geometry",
	      stylers: [
	        { visibility: 'on' }
	      ]
	    },
	   {
	      featureType: "poi.park",
	      elementType: "geometry",
	      stylers: [
	        { visibility: 'on' },
		{ lightness: -20 }
	      ]
	    },
	   {
	      featureType: "road.local",
	      elementType: "geometry",
	      stylers: [
	        { visibility: 'on' },
		{ lightness: 0 },
		{ hue: "#F6FF00" },
		{ saturation: 0 }
	      ]
	    },
	   {
	      featureType: "road.arterial",
	      elementType: "geometry",
	      stylers: [
	        { visibility: 'on' },
		{ lightness: -10 },
		{ saturation: -60 }
	      ]
	    },
	   {
	      featureType: "road.highway",
	      elementType: "geometry",
	      stylers: [
	        { visibility: 'on' },
		{ lightness: -10 },
		{ saturation: -60 },
	      ]
	    },	    
	   {
	      featureType: "landscape.man_made",
	      elementType: "geometry",
	      stylers: [
	        { visibility: 'on' },
		{ lightness: -100 }
	      ]
	    },
	  ];
	  
	  var crazyStyles = [
	  {
	    stylers: [
	      { visibility: "off" }
	    ]
	  },
	  {
	    elementType: "geometry",
	    stylers: [
	      { visibility: "on" },
	      { invert_lightness: true },
	      { hue: "#3bff00" }
	    ]
	  }
	]
	  
	  var zombieMapType = new google.maps.StyledMapType(zombieStyles, {name: "figure ground"});
	  var parkMapType = new google.maps.StyledMapType(parkStyles, {name: "with parks"});
	  var roadMapType = new google.maps.StyledMapType(roadStyles, {name: "and roads"});
	  var crazyMapType = new google.maps.StyledMapType(crazyStyles, {name: "green"});

	  var mapOptions = {
	    zoom: parseInt(document.getElementById('zoomlevel').innerHTML),
	    center: new google.maps.LatLng(lat,lng),
	    //disableDefaultUI: true,
	    zoomControl: false,
	    panControl: false,
	    mapTypeControlOptions: {
	      mapTypeIds: ['zombie0', 'parks', 'roads', google.maps.MapTypeId.ROADMAP, google.maps.MapTypeId.SATELLITE]
	    }
	};
	var map = new google.maps.Map(document.getElementById(map_canvas), mapOptions);
	map.mapTypes.set('zombie0', zombieMapType);
	map.mapTypes.set('parks', parkMapType);
	map.mapTypes.set('roads', roadMapType);
	map.mapTypes.set('crazy', crazyMapType);
	map.setMapTypeId('zombie0');
	//map.setOptions({styles: zombieStyles});
	//var overlay = new google.maps.KmlLayer("http://dl.dropbox.com/u/18063657/city_sizes/CityOutlines.kml", {preserveViewport: true}); 
	//overlay.setMap(map);
	return map;
	}
	
	//shortcuts
	document.onkeyup=function(e) {
	    if(e.which == 49) document.getElementById('rotationstatus').innerHTML="up";
	    if(e.which == 50) document.getElementById('rotationstatus').innerHTML="up";
	}
	document.onkeydown=function(e) {
		if(e.which == 49) {
			var heading=map0.getHeading();
			document.getElementById('rotationstatus').innerHTML=heading;
			if (heading==null) {
				var heading = 0;
			}
			map0.setHeading(heading+90);
		}
		if(e.which == 50) {
			var heading=map0.getHeading();
			document.getElementById('rotationstatus').innerHTML=heading;
			if (heading==null) {
				var heading = 0;
			}
			map0.setHeading(heading-90);
		}
	}
	
	function initialize() {
	  geocoder = new google.maps.Geocoder();
	  map0 = startMap("map_canvas0",39.7391536007426,-104.98470339855373);
	  map1 = startMap("map_canvas1",37.77492950021904,-122.41941550062131);
	  codeAddress(map0,'address0');
	  codeAddress(map1,'address1');
	  map1.setOptions({disableDoubleClickZoom: true,scrollwheel: false});
	  google.maps.event.addListener(map0, 'zoom_changed', function() {
	    var newzoom0=map0.getZoom();
	    document.getElementById('zoomlevel').innerHTML=newzoom0;
	    map1.setZoom(newzoom0);
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