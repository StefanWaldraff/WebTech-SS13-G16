var actions_disabled = false;

$(function() {
	$(document).ready(function(event) {
		loadEntry();
		getWeatherData(false);
		var temp = document.getElementById('temp');
		$("select").change(function(){
            if(actions_disabled)
                return;
			var e = $(this).context;

        	if($(this).val() == 'celsius') {
        		temp.value = Math.round((temp.value - 32) * 5/9);
        	}
        	else if ($(this).val() == 'fahrenheit') {
        		temp.value = Math.round(temp.value *1.8 +32);
        	}

        	if(e.name == 'condition') {
        		document.getElementById('wcc').options.length = 0;
        		erweitern('#wcc', "wccnull" , ["wccnull"], ["---"], true);
                console.log(e.options[e.selectedIndex]);
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
                var name = $(this).context.name;
                if(name == 'wdate' || name == 'lat' || name == 'lng'){
                    getWeatherData(true);
                }
    		}
    	});
	});

});

function call_update(fieldName, fieldVal) {

        if(fieldName == 'wdate' || fieldName == 'wtime'){
            // this fix is needed to store values as DATE and/or TIME types in sql
            fieldVal = "'" + fieldVal + "'";
        }
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

            // this seems unneeded since app_waypoint_update.php does not response anything
	    	// if (data['wnr'].match(/Error/)) {
		    	
		    // 	$('#dialogTitle').text('Error');
		    // 	$('#dialogMessage').text(data['wnr'].replace(/Error: /, ""));
		    	
	    	// } else {
		    		    
		    // 	$('#dialogTitle').text('Success');
		    // 	$('#dialogMessage').text("Eintrag wurde erfolgreich gespeichert.");
	    	// }
	    
	    	// $('#messageBox').modal('show');
	    	
	    }, "json");

}


function buildDateString(date){
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    month = (month < 10)? "0" + month : month;
    var day = date.getDate();
    day = (day < 10)? "0" + day : day;
    return year + "-" + month + "-" + day;
}

function getWeatherData(force){
    var lat = document.getElementById('lat').value;
    var lon = document.getElementById('lng').value;
    var date = document.getElementById('wdate').value;

    if(date == "" || date == null){
        alert("date1: " + date);
        loadEntry();
        lat = document.getElementById('lat').value;
        lon = document.getElementById('lng').value;
        date = document.getElementById('wdate').value;
        alert("date2: " + date + " lat: " + lat + "lon: " +lon);
        // if date is not set there we won't make a request
        return;
    }
    alert("request");
    var today = buildDateString(new Date());
    for (var i = 0; i < today.length; i++) {
        //alert("date: " + date.charAt(i) + " today: " + today.charAt(i));
        if(date.charAt(i) < today.charAt(i))
            return getHistoricWeatherData(lat, lon, date, force);
        if(date.charAt(i) > today.charAt(i))
            return getPredictedWeatherData(lat, lon, date, force);
    }
    return getCurrentWeatherData(lat, lon, force);
}

function getHistoricWeatherData(lat, lon, date, force){
    alert("historic");
}

function getPredictedWeatherData(lat, lon, date, force){
    $.ajax({
      type : 'get',
      url : "http://api.openweathermap.org/data/2.5/forecast/daily?cnt=14&lat=" + lat +"&lon=" + lon + "&callback=?",
      dataType : 'json', 
      success : function(response){
        for (var i = 0; i < response.list.length; i++){
            // hacky solution, need *1000 for time in mils and StringBuilder to ignore h, min and sec
            var entryDate = buildDateString(new Date(response.list[i].dt *1000));
            if(date == entryDate){
                return readPredictedData(response.list[i], force);
            }
        }
        // can't predict further than 14 days, so no data available
        alert("reseting");
        return defaultWeatherData();
      }, 
      error: function(a,b,c){
      },
    });

}

function defaultWeatherData(){
    event.preventDefault();
    var query = window.location.search;
    
    var waynrQuery = query.match(/wnr=\d/);
    var waynr = waynrQuery[0].replace(/wnr=/, "");

    var json = {
        "wnr": waynr,
    };

    jQuery.post("app_waypoint_default.php", json, function(data) { 
    }, "json");

    loadEntry()
}

function readPredictedData(entry, force){
    var somethingChanged = false;

    var field = document.getElementById('windspeed');
    var value;

    if(force || check(field)){
        value = entry.speed;
        call_update(field.name, value);
        somethingChanged = true;
    }   
    field = document.getElementById('winddirection'); 
    if(force || check(field) || field.options[field.selectedIndex].text == "---"){
        value = entry.deg;
        call_update(field.name, value);
        somethingChanged = true;
    }
    field = document.getElementById('wcc'); 
    if(force || check(field) || field.options[field.selectedIndex].text == "---"){
        value = entry.weather[0].id;
        call_update(field.name, value);
        somethingChanged = true;
    }
    field = document.getElementById('airpressure'); 
    if(force || check(field)){
        value = entry.pressure;
        call_update(field.name, value);
        somethingChanged = true;
    }
    field = document.getElementById('rain'); 
    if(force || check(field)){
        value = entry.rain;
        call_update(field.name, value);
        if(value != null){
            somethingChanged = true;
        }
    }
    field = document.getElementById('temp'); 
    if(force || check(field)){
        // using average temp
        value = (entry.temp.min + entry.temp.max)/2;
        call_update(field.name, value);
        somethingChanged = true;
    }
    field = document.getElementById('clouds'); 
    if(force || check(field)){
        value = entry.clouds;
        call_update(field.name, value);
        somethingChanged = true;
    }
    // retrive data from database if something changed
    if(somethingChanged){
        loadEntry();
    }
}

function getCurrentWeatherData(lat, lon, force){	

    $.ajax({
      type : 'get',
      url : "http://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&callback=?",
      dataType : 'json', 
      success : function(response){
      	var somethingChanged = false;
        var value = document.getElementById('windspeed'); 
        if(force || check(value)){
            call_update(value.name, response.wind.speed);
            somethingChanged = true;
        }   
        value = document.getElementById('winddirection'); 
        if(force || check(value) || value.options[value.selectedIndex].text == "---"){
            call_update(value.name, response.wind.deg);
            somethingChanged = true;
        }
        value = document.getElementById('wcc'); 

        if(force || check(value) || value.options[value.selectedIndex].text == "---"){
            var temp = response.weather[0].id;
            call_update(value.name, temp);
            somethingChanged = true;
        }
        value = document.getElementById('airpressure'); 
        if(force || check(value)){
            call_update(value.name, response.main.pressure);
            somethingChanged = true;
        }
        value = document.getElementById('rain'); 
        if(force || check(value)){
            // hacky solution because of "3h" fieldname...
            for(wert in response.rain){
                call_update(value.name, response.rain[wert]);
                break;
            }
        }
        value = document.getElementById('temp'); 
        if(force || check(value)){
            call_update(value.name, response.main.temp);
            somethingChanged = true;
        }
        value = document.getElementById('clouds'); 
        if(force || check(value)){
            call_update(value.name, response.clouds.all);
            somethingChanged = true;
        }   
        // retrive data from database if something changed
        if(somethingChanged){
            loadEntry();
        }
      }, 
      error: function(a,b,c){
      }
    });

}

function check(value){
	return value.value == null || value.value == "" || value.value == "null";
}

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
        document.getElementById('condition').options.length = 0;
        document.getElementById('wcc').options.length = 0;
        
        if (value != null) {
            getGruppe(1, null, false);
            getGruppe(parseInt(value.charAt(0)), parseInt(value), true);
        }else{
        	erweitern('#wcc', "wccnull" , ["wccnull"], ["---"], true);
        	erweitern('#condition', "cnull", ["cnull"], ["---"], true);
            getGruppe(1, null, false);
        }
       
        value = data['temp'];
        if(value != null){
        	$('#temp').val(parseInt(value) - 272);
        }
        $('#airpressure').val(data['airpressure']);
        $('#windspeed').val(data['windspeed']);

        value = data['winddirection'];
        setzeSelect = false;
        direction = 0;
        document.getElementById('winddirection').options.length = 0;
        if (value != null) {
        	setzeSelect = true;
        	direction = getDirection(parseInt(value), dirNumbers, dirBorders);
        }
        if(!setzeSelect){
        	erweitern('#winddirection', "widnull" , ["widnull"], ["---"], true);
        }
        erweitern('#winddirection', direction, dirNumbers, dirText, setzeSelect);

        $('#rain').val(data['rain']);
        $('#clouds').val(data['clouds']);
        $('#wavehight').val(data['wavehight']);

        value = data['wavedirection'];
        document.getElementById('wavedirection').options.length = 0;
        setzeSelect = false;
       	direction = 0;
        if (value != null) {
        	setzeSelect = true;
        	direction = getDirection(parseInt(value), dirNumbers, dirBorders);
        }

        if(!setzeSelect){
        	erweitern('#wavedirection', "wavnull" , ["wavnull"], ["---"], true);
        }
        erweitern('#wavedirection', direction, dirNumbers, dirText, setzeSelect);

    }, "json");
	
}