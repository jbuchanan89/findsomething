	var weatherRules = [
		{
			min: 85,
			max: 1000,
			activities: [
			'beaches','pools', 'parks', 'museums', 'playgrounds', 'amusement park']
		},
		{
			min: 0,
			max: 84,
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
	};

//*************************************************

function getGeoCode() {
	$.getJSON(geoLookup).done(function(data){
		lat = data.location.lat;
		lon = data.location.lon;
		initMap(lat,lon);
		});
	};

	function getActivities(activity){
		$('#results').empty();
		$('#map').empty();
		googleAPI= 'https://maps.googleapis.com/maps/api/place/textsearch/json?location='+lat+','+lon+'&radius=500&query='+activity+'&key=AIzaSyAJ_wq_D6Grboah9szVhRr71p5uN2PsbtU';

		map = new google.maps.Map(document.getElementById('map'), {
        zoom: 10,
        center: new google.maps.LatLng(lat,lon),
        mapTypeId: 'roadmap'
        });
		

			// $.ajax({
			// 	method: 'GET',
			// 	url: googleAPI,
			// 	dataType: 'jsonp',
			// 	crossOrigin: true,
			// 	success: function(data){
			// 		console.log('success');
			// 	}
			// })
		

		$.getJSON(googleAPI).done(function(data){
			$("#results").css('display', 'block');
			$('#results').html('<h2>'+activity+'</h2>');
	   	for(var i =0; i<data.results[i].name.length; i++){
	   		var marker = new google.maps.Marker ({
		    	position: new google.maps.LatLng(data.results[i].geometry.location.lat,data.results[i].geometry.location.lng),
		    	map: map,
		    	title: data.results[i].name
		    });
	    	$("#results").append('<p>'+data.results[i].name+'<br>'+data.results[i].formatted_address+'<br>'+data.results[i].rating+'&#9733</p>');
	     };

	});
	};



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


