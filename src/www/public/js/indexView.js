/**
 * New node file
 */
var map;

$(document).ready(function() {
	
	var clientPos;
	if(navigator.geolocation) {
	    navigator.geolocation.getCurrentPosition(
	    	// OK
	    	function(position) {
		    	console.log(position);
	    		clientPos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
	    		console.log(clientPos);
	    		
	    		
	    		var markerClient = new google.maps.Marker({
	    			position: clientPos,
	    			map: map,
	    			title: 'You are here'
	    		});
	    		
	    		map.panTo(clientPos);
	    		
		    },
		    // KO
	    	function(error) {
		    	console.log(error);
		    	// whatever
		    	
		    });
	    
    } else {
	    alert("Ce navigateur ne supporte pas la g�olocalisation");
	}
	
	
	// Position par d�faut
	var centerpos = new google.maps.LatLng(43.580417999999995,7.125102);
	
	// Options relatives � la carte
	var optionsGmaps = {
	    center: centerpos,
	    mapTypeId: google.maps.MapTypeId.ROADMAP,
	    zoom: 5
	};
	// ROADMAP peut �tre remplac� par SATELLITE, HYBRID ou TERRAIN
	// Zoom : 0 = terre enti�re, 19 = au niveau de la rue
	 
	// Initialisation de la carte pour l'�l�ment portant l'id "map"
	map = new google.maps.Map(document.getElementById("map"), optionsGmaps);
	
	
	
});

function searchBandName() {
	console.log("search band name");
	$.ajax({
		type: "GET",
        url: '/bandSearch?bandName=' + $("#bandName").val(),
        timeout: 5000,
        success: function(data) {
            console.log("success");
            console.log("bandName = " + data.bandName);
            console.log(data);
            
            displayResult(data);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert('error ' + textStatus + " " + errorThrown);
        }
    });
}

function displayResult(data) {
	
	console.log("display data : " + data);
	
	// Remove old data
	$('[id^="concert_"]').remove();
	
	for (var i = 0; i < data.length; i++) {

		console.log("geo : %j", data[i].fields.geometry);
		
		var lat,lng;
		if (data[i].fields.geometry) {
			var geometry = data[i].fields.geometry[0].split(",");
			lat = geometry[0];
			lng = geometry[1];
			
			addMarker(lat, lng, data[i].fields.location[0]);
		}
		
		var html = "";
		
		html += "<div id='concert_'" + i + ">";
		html += "<div style='float: left; width: 250px'>";
		html += formatDate_MMMDDYYYY(new Date(data[i].fields.date));
		html += "</div>";
		html += "<div>";
		html += data[i].fields.location;
		html += "</div>";
		html += "</div>";
		
		$("#resultList").append(html);
		
	}
	
	$("#resultList").show();
	
}

function addMarker(lat, lng, title) {
	console.log(title);
	marker = new google.maps.Marker({
        position: new google.maps.LatLng(lat, lng),
        map: map,
        title: title
    });
}