	var weatherRules = [
		{
			min: 82,
			max: 1000,
			activities: [
			'beaches','pools', 'parks', 'museums', 'playgrounds', 'amusement park', 'water sports']
		},
		{
			min: 0,
			max: 82,
			activities: [
			'movies', 'bowling', 'roller skating', 'ice skating', 'museums', 'trampoline parks']
		}
	];

//*****************************************	
var geoLookup;
var lat;
var lon;
var options;
var weatherSearch;
var googleAPI;
var map;
var map;
var service;
var error;
var infowindow;

	$(document).ready(function(){
		$('#form').submit(function(event){
			event.preventDefault();

			var query= $('#zipcode').val();
			weatherSearch = 'https://api.wunderground.com/api/66932217fc7ece0f/conditions/q/'+query+'.json';
			geoLookup = "https://api.wunderground.com/api/66932217fc7ece0f/geolookup/q/"+query+".json";
			$('#weather, #activity-list').empty();
			
			getWeather(weatherSearch);

			
		});	

		$("footer").on('click', '.newSearch',function(e){
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
		activity= 'playgrounds';
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

		error = data.response.error;
			if(error) {
			alert("Invalid Zip Code");	
			$('#zipcode').val('');
			}
			else {
				var currentTemp= data.current_observation.temp_f;
				var location = data.current_observation.display_location.full;
				var icon = data.current_observation.icon;
				var weath= data.current_observation.weather;
			$('#weather').append("<p class='logo med'>Find Something</p><p class='logo large'>Fun To Do Today</p>");
			$('#weather').append('<p class="image-icon"><img class = "weather-icon" src="https://icons.wxug.com/i/c/i/'+icon+'.gif"alt="Image Icon for the current weather"><br>'+weath+'</br></p> <p class= "location-info">'+ location + ': ' + currentTemp +  '&#8457' );	

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

			$('#weather, #activity-list, #map, footer, .main, #results').css('display', 'block');
			$('body').css('border', '10px solid #26a0da');
			$('header').css('display','none');
			getGeoCode();
		}
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
	}, 1000);

	$('#results').empty();
	$('#map').empty();
	initialize();
}

function initMap(lat,lon) {

    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 5,
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
      zoom: 8
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
			var result = '<p><a href="https://www.google.com/maps/place/'+results[i].name+'/@'+results[i].geometry.location+'" target="_blank"><strong>'+results[i].name+'</strong><br>'+address+'<br>'+results[i].rating+' &#9733</p></a>';
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
    	service.getDetails(place, function(result, status) {
      		if (status !== google.maps.places.PlacesServiceStatus.OK) {
        		console.error(status);
        		return;
      		}	
      infoWindow.setContent('<a href="https://www.google.com/maps/place/'+result.name+'/@'+placeLoc+'" target="_blank"><strong>'+result.name+ '</strong><br/>' + address + "</a>");
      infoWindow.open(map, marker);
      zoom: 10
      map.setCenter(marker.getPosition())
    	});
	});	
	google.maps.event.addListener(map, "click", function(event) {
    infoWindow.close();
});

}
