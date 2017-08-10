	var weatherRules = [
		{
			min: 85,
			max: 1000,
			activities: [
			'beaches','pools', 'parks', 'museums', 'playgrounds', 'amusement park', 'water sports']
		},
		{
			min: 0,
			max: 85,
			activities: [
			'movies', 'bowling', 'roller skating', 'ice skating', 'museums', 'trampoline park']
		}
	];

//*****************************************	
var geoLookup;
var lat;
var lon;
var options;
var weatherSearch;
var googleAPI;
var activity;
var map;
var map;
var service;
var infowindow;

	$(document).ready(function(){
		$('#form').submit(function(event){
			event.preventDefault();
			$('#weather, #activity-list, #map, footer, .main, #results').css('display', 'block');
			var query= $('#zipcode').val();
			weatherSearch = 'http://api.wunderground.com/api/66932217fc7ece0f/conditions/q/'+query+'.json';
			geoLookup = "http://api.wunderground.com/api/66932217fc7ece0f/geolookup/q/"+query+".json";
			$('#weather, #activity-list').empty();
			$('html, body').animate({
				scrollTop: $("#weather").offset().top -600
		   }, 2000);
			
			getWeather(weatherSearch);
			$('header').css('display','none');
			getGeoCode();

		});	

		$("footer").on('click', '.newsearch',function(e){
			location.reload();
		});


//**********Click events for the Activities*********
		$("#activity-list").on('click', '.movies', function(e){
		activity= 'movie theatres';	
		getActivities(activity);

		});

		$("#activity-list").on('click', '.pools', function(e){
		activity= 'swimming';
		getActivities(activity);
		});

		$("#activity-list").on('click', '.bowling', function(e){
		activity= 'bowling';
		getActivities(activity);
		});

		$("#activity-list").on('click', '.museums', function(e){
		activity= 'museums';
		getActivities(activity);
		});

		$("#activity-list").on('click', '.beaches', function(e){
		activity= 'beaches';
		getActivities(activity);
		});

		$("#activity-list").on('click', '.parks', function(e){
		activity= 'parks';
		getActivities(activity);
		});

		$("#activity-list").on('click', '.roller', function(e){
		activity= 'roller skating';
		getActivities(activity);
		});

		$("#activity-list").on('click', '.ice', function(e){
		activity= 'ice skating';
		getActivities(activity);
		});

		$("#activity-list").on('click', '.playgrounds', function(e){
		activity= 'playground';
		getActivities(activity);
		});

		$("#activity-list").on('click', '.amusement', function(e){
		activity= 'amusement park';
		getActivities(activity);
		});

		$("#activity-list").on('click', '.trampoline', function(e){
		activity= 'trampoline park';
		getActivities(activity);
		});

		$("#activity-list").on('click', '.water', function(e){
		activity= 'water sports';
		getActivities(activity);
		});
		//*******************************
	});



//*******************************************	
	//Get Current Weather Conditions from weather underground and display
	function getWeather(weatherSearch){
		$.getJSON(weatherSearch).done(function(data){
		var currentTemp= data.current_observation.temp_f;
		var location = data.current_observation.display_location.full;
		var icon = data.current_observation.icon;
		var weath= data.current_observation.weather;
			$('#weather').append("<p class='logo med'>Find Something</p><p class='logo large'>Fun To Do Today</p>");
			$('#weather').append('<p class="image-icon"><img class = "weather-icon" src="https://icons.wxug.com/i/c/i/'+icon+'.gif"><br>'+weath+'</br></p> <p class= "location-info">'+ location + ': ' + currentTemp +  '&#8457' );	

			var activitiesHTML = "<ul>";
			for (var i = 0; i < weatherRules.length; i++) {
				if(currentTemp >=weatherRules[i].min && currentTemp <weatherRules[i].max){
					for (var j = 0; j < weatherRules[i].activities.length; j++) {
						activitiesHTML+= "<li class="+weatherRules[i].activities[j]+">"+weatherRules[i].activities[j]+"</li>";
					}
				}
			}
			activitiesHTML += "</ul>";

			$('#activity-list').append(activitiesHTML);
		 });	
	}

//*************************************************

function getGeoCode() {
	$.getJSON(geoLookup).done(function(data){
		lat = data.location.lat;
		lon = data.location.lon;
		initMap(lat,lon);
		});
}

var name;
function getActivities(activity){
	$('html, body').animate({
	scrollTop: $("#results").offset().top -100
	}, 2000);

	$('#results').empty();
	$('#map').empty();
	googleAPI= 'https://maps.googleapis.com/maps/api/place/textsearch/json?location='+lat+','+lon+'&radius=500&query='+activity+'&key=AIzaSyAJ_wq_D6Grboah9szVhRr71p5uN2PsbtU';
	initialize();
}

function initMap(lat,lon) {

    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 10,
        center: new google.maps.LatLng(lat,lon),
        mapTypeId: 'roadmap'
        });
    var marker = new google.maps.Marker ({
    	position: new google.maps.LatLng(lat,lon),
    	map: map,
    	animation: google.maps.Animation.DROP,
    	title: 'You are Here'
    });
    var infowindow = new google.maps.InfoWindow({
    	content: "You are Here"
  	});

 	 marker.addListener('click', function() {
   		infowindow.open(map, marker);
  	});
};

function initialize() {
  var placeLocation = new google.maps.LatLng(lat,lon);

  map = new google.maps.Map(document.getElementById('map'), {
      center: placeLocation,
      zoom: 10
    });

  var request = {
    location: placeLocation,
    radius: '100',
    query: activity
  };

  service = new google.maps.places.PlacesService(map);
  service.textSearch(request, callback);
}
var string;
var address;
function callback(results, status) {
	$('#results').css('display', 'block');
	$('#results').html('<h2>'+activity+'</h2>');
  	if (status == google.maps.places.PlacesServiceStatus.OK) {
    	for (var i = 0; i < results.length; i++) {
    		console.log(results[i]);
      		var place = results[i];
			string = results[i].formatted_address;
			address = string.replace(', United States', "");
			createMarker(results[i], address);
			var result = '<p>'+results[i].name+'<br>'+address+'<br>'+results[i].rating+' &#9733</p>';
  			$("#results").append(result);
    	}
  	}
}

function createMarker(place, address) {
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location
    });

    var infoWindow = new google.maps.InfoWindow({    
  	});

	google.maps.event.addListener(marker, 'click', function() {
		 infoWindow.close();
    	service.getDetails(place, function(result, status) {
      		if (status !== google.maps.places.PlacesServiceStatus.OK) {
        		console.error(status);
        		return;
      		}	
      	console.log(result);
      infoWindow.setContent('<a href="https://www.google.com/maps/place/'+result.name+'/ " target="_blank"><strong>'+result.name+ '</strong><br/>' + address + "</a>");
      infoWindow.open(map, marker);
      map.setCenter(marker.getPosition())
    	});
	});	
	google.maps.event.addListener(map, "click", function(event) {
    infoWindow.close();
});

}


//*********Text Slide Show***********
var places = [
"pools", 
"museums", 
"beaches", 
"movie theatres",
"trampoline parks",
"theme parks",
"roller skating",
"ice skating",
"bowling"
];
    var i = 0;
    setInterval(function() {
       $("#textslide").html(places[i]);
            if (i == places.length)
             	i=0;
            else
                i++;
        }, 1 * 2000);

//********************************


