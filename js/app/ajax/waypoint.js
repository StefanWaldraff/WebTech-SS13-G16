$(function() {
	$(document).ready(function(event) {
		loadEntry();
		getWeatherData(false);
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
        // if date is not set there we won't make a request
        return;
    }
    var today = buildDateString(new Date());
    for (var i = 0; i < today.length; i++) {
        if(date.charAt(i) < today.charAt(i))
            return getClosestCities(lat, lon, date, force);
        if(date.charAt(i) > today.charAt(i))
            return getPredictedWeatherData(lat, lon, date, force);
    }
    return getCurrentWeatherData(lat, lon, force);
}

getClosestCities = function (lat, lon, date, force){
    $.ajax({
        type : 'get',
        url : "http://api.openweathermap.org/data/2.5/find?lat=" + lat + "&lon=" + lon + "&callback=?",
        dataType : 'json', 
        success : function(response){
            var cityIDs = new Array();
            for (var i = 0; i < response.list.length; i++) {
                cityIDs.push(response.list[i].id);
            };   
            var dateSec = (new Date(date).getTime())/1000;      
            getHistoricWeatherData(lat, lon, dateSec, force, cityIDs, 0);
        }, 
        error: function(a,b,c){
        }
    });
}

function getHistoricWeatherData(lat, lon, date, force, cityIDs, index){
    //alert("historic " + cityIDs[0]);
    if(index == cityIDs.length){
        // checked all possible cities
        return;
    }
    $.ajax({
        type : 'get',
        url : "http://api.openweathermap.org/data/2.5/history/city/1517501?type=day&start=1371081600&end=1371081600&callback=?",
        dataType : 'json', 
        success : function(response){
           if(response.list.length == 0){
                // no data from this station
                return getHistoricWeatherData(lat, lon, date, force, cityIDs, ++index);
            }
            writeHistoricData(response.list[0], force);
        }, 
        error: function(a,b,c){
            // try next city
            getHistoricWeatherData(lat, lon, date, force, cityIDs, ++index);
        }
    });
}

function writeHistoricData(response, force){
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
    value = document.getElementById('precipation'); 
    if(force || check(value)){
        // hacky solutions because of "3h" fieldname...
        for(wert in response.rain){
            // checks for rain
            call_update(value.name, response.rain[wert]);
            break;
        }
        for(wert in response.snow){
            // checks for snow
            call_update(value.name, response.snow[wert]);
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
        return defaultWeatherData();
      }, 
      error: function(a,b,c){
      }
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
    field = document.getElementById('precipation'); 
    if(force || check(field)){
        value = entry.rain;
        call_update(field.name, value);
        if(value != null){
            somethingChanged = true;
        }
        value = entry.snow;
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
        value = document.getElementById('precipation'); 
        if(force || check(value)){
            // hacky solution because of "3h" fieldname...
            for(wert in response.rain){
                call_update(value.name, response.rain[wert]);
                break;
            }
            for(wert in response.snow){
                call_update(value.name, response.snow[wert]);
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

        $('#precipation').val(data['precipation']);
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