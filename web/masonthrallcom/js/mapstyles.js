// mapstyles

var man_color = "#302020";
var nature_color = "#C0F572";
var water_color = "#408080";

var newStyle = [
	{
		"elementType": "labels",
		"stylers": [
			{ "visibility": "off" }
		]
	}, {
		"elementType": "geometry",
		"stylers": [
			{ "visibility": "off" }
		]
	}, {
		"featureType": "landscape.man_made",
		"elementType": "geometry.fill",
		"stylers": [
			{ "color": man_color },
			{ "visibility": "on" }
		]
	}, {
		"featureType": "landscape.natural",
		"elementType": "geometry",
		"stylers": [
			{ "color": nature_color },
			{ "visibility": "on" }
		]
	}, {
		"featureType": "poi.park",
		"elementType": "geometry",
		"stylers": [
			{ "color": nature_color },
			{ "visibility": "on" }
		]
	}, {
		"featureType": "transit",
		"elementType": "geometry",
		"stylers": [
			{ "visibility": "on" },
			{ "color": man_color },
			{ "weight": "0" }
		]
	}, {
		"featureType": "road",
		"elementType": "geometry",
		"stylers": [
			{ "visibility": "on" },
			{ "color": man_color },
			{ "weight": "0" }
		]
	}, {
		"featureType": "water",
		"elementType": "geometry",
		"stylers": [
			{ "visibility": "on" },
			{ "color": water_color }
		]
	}
];