$(function() {

	function loadEntry() { 

		var query = window.location.search;

		var waypnrQuery = query.match(/wnr=\d/);
		var waypnr = waypnrQuery[0].replace(/wnr=/, "");

		jQuery.get("app_tripinfo_load.php", {'wnr': waypnr}, function(data) {

	        $('#name').val(data['name']);
	        $('#lat').val(data['lat']);
	        $('#lng').val(data['lng']);
	        $('#btm').val(data['btm']);
	        $('#dtm').val(data['dtm']);
	        $('#sog').val(data['sog']);
	        $('#cog').val(data['cog']);
	        $('#manoever').append('<option>' + data['manoever'] + '</option>');
	        $('#vorsegel').append('<option>' + data['vorsegel'] + '</option>');
	        $('#marker').append('<option>' + data['marker'] + '</option>');
	        $('#wdate').val(data['wdate']);
	        $('#wtime').val(data['wtime']);

	 		var value = data['wcc'];
	 		var setzeSelect = false;
	        var direction = 0;
	        if (value != null) {
	        	setzeSelect = true;
	        	$('option[value='+ value.charAt(0) +']').attr('selected','selected');
	        }else{
	        	erweitern('#wcc', "null" , ["null"], ["---"], true);
	        	erweitern('#condition', "null", ["null"], ["---"], true);
	        }
	       
	       	value = parseInt(value);
	 		getGruppe(2, value, setzeSelect);
	 		getGruppe(3, value, setzeSelect);
	 		getGruppe(5, value, setzeSelect);
	 		getGruppe(6, value, setzeSelect);
	 		getGruppe(7, value, setzeSelect);
	 		getGruppe(8, value, setzeSelect);
	 		getGruppe(9, value, setzeSelect);
	        
	        value = data['temp'];
	        if(value != null){
	        	$('#temp').val(parseInt(value) - 272);
	        }
	        $('#airpressure').val(data['airpressure']);
	        $('#windspeed').val(data['windspeed']);

	        value = data['winddirection'];
	        setzeSelect = false;
	        direction = 0;
	        if (value != null) {
	        	setzeSelect = true;
	        	direction = getDirection(parseInt(value), dirNumbers, dirBorders);
	        }
	        if(!setzeSelect){
	        	erweitern('#winddirection', "null" , ["null"], ["---"], true);
	        }
	        erweitern('#winddirection', direction, dirNumbers, dirText, setzeSelect);

	        $('#rain').val(data['rain']);
	        $('#clouds').val(data['clouds']);
	        $('#wavehight').val(data['wavehight']);

	        value = data['wavedirection'];
	        setzeSelect = false;
	       	direction = 0;
	        if (value != null) {
	        	setzeSelect = true;
	        	direction = getDirection(parseInt(value), dirNumbers, dirBorders);
	        }

	        if(!setzeSelect){
	        	erweitern('#wavedirection', "null" , ["null"], ["---"], true);
	        }
	        erweitern('#wavedirection', direction, dirNumbers, dirText, setzeSelect);

	    }, "json");
    	
	}



	$(document).ready(function(event) {
		loadEntry();
		getCurrentWeatherData(5, 9);
		var temp = document.getElementById('temp');
		$("select").change(function(){

			var e = $(this).context;

        	if($(this).val() == 'celsius') {
        		temp.value = Math.round((temp.value - 32) * 5/9);
        	}
        	else if ($(this).val() == 'fahrenheit') {
        		temp.value = Math.round(temp.value *1.8 +32);
        	}

        	if(e.name == 'condition') {
        		document.getElementById('wcc').options.length = 0;
        		erweitern('#wcc', "null" , ["null"], ["---"], true);
        		getGruppe(parseInt(e.options[e.selectedIndex].value), null, false);
        	}
        	else if(e.name == 'scale') {
        		call_update('temp', e.options[e.selectedIndex].value);
        	}
        	else {
        		call_update(e.name, e.options[e.selectedIndex].value);
        	}
    	});

    	$("input").change(function(e) {	
    		if($(this).context.name == 'temp') {
    			var result = 0;
        		var tmpVal = document.getElementById('scale');

        		if(tmpVal.value == 'celsius') {
        			result = parseInt($(this).val()) + 272;
        		} else {
        			result = Math.round((parseInt($(this).val()) - 32) * 5/9) + 272;
        		}
        		call_update($(this).context.name, result);
        	}
        	else {
    			call_update($(this).context.name, $(this).val());
    		}
    	});
	});

});

function call_update(fieldName, fieldVal) {

		event.preventDefault();
		var query = window.location.search;
		
		var waynrQuery = query.match(/wnr=\d/);
		var waynr = waynrQuery[0].replace(/wnr=/, "");
	
		var json = {
			"wnr": waynr,
			field: fieldName,
			value: fieldVal
	    };
	
	    jQuery.post("app_waypoint_update.php", json, function(data) { 
	    
	    	if (data['wnr'].match(/Error/)) {
		    	
		    	$('#dialogTitle').text('Error');
		    	$('#dialogMessage').text(data['wnr'].replace(/Error: /, ""));
		    	
	    	} else {
		    		    
		    	$('#dialogTitle').text('Success');
		    	$('#dialogMessage').text("Eintrag wurde erfolgreich gespeichert.");
	    	}
	    
	    	$('#messageBox').modal('show');
	    	
	    }, "json");

}

function getCurrentWeatherData(lat, lon){
	$.ajax({
      type : 'get',
      url : "http://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&callback=?",
      dataType : 'json', 
      success : function(response) {
      	console.log(response);
      	/*callUpdate(response.weather["id"], );
      	callUpdate(response.weather["icon"], );
      	callUpdate(response.main.pressure, );
        callUpdate(response.main.temp, 
        
        callUpdate(response.wind.speed
        callUpdate(response.wind.deg
        callUpdate(response.clouds.all
        
        
        callUpdate(response.rain.3h*/

      }, error: alert("mist")
    });

}
/*wcc INT DEFAULT NULL,
	icon VARCHAR(3) DEFAULT NULL,
	temp INT DEFAULT NULL,
	airpressure INT DEFAULT NULL,
	windspeed INT DEFAULT NULL,
	winddirection INT DEFAULT NULL,
	rain INT DEFAULT NULL,
	clouds INT DEFAULT NULL,
	wavehight INT DEFAULT NULL,
	wavedirection INT DEFAULT NULL,

{"coord":
	{"lon":139,
	"lat":35},
"sys":{"country":"JP",
	"sunrise":1371065364,
	"sunset":1371117530},
"weather":[{"id":500,
	"main":"Rain",
	"description":"light rain",
	"icon":"10n"}],
"base":"global stations",
"main":{"temp":290.37,
	"humidity":87,
	"pressure":1014,
	"temp_min":290.37,
	"temp_max":290.37},
"wind":{"speed":9.33,
	"deg":24.5033},
"rain":{"3h":1},
"clouds":{"all":80},
"dt":1371137938,
"id":1851632,
"name":"Shuzenji",
"cod":200}*/
