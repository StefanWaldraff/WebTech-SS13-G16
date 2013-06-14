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
                var name = $(this).context.name;
                if(name == 'wdate' || name == 'lan' || name == 'lng'){
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
			"wnr": parseInt(waynr),
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

function getWeatherData(force){
    var lat = document.getElementById('lat').value;
    var lon = document.getElementById('lng').value;
    var date = document.getElementById('wdate').value;

    function buildToday(){
        var d = new Date();
        var year = d.getFullYear();
        var month = d.getMonth() + 1;
        month = (month < 10)? "0" + month : month;
        var day = d.getDate();
        day = (day < 10)? "0" + day : day;
        return year + "-" + month + "-" + day;
    }

    var today = buildToday();
    for (var i = 0; i < today.length; i++) {
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
    alert("predicted");
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
            call_update(value.name, v.wind.speed);
            somethingChanged = true;
        }   
        value = document.getElementById('winddirection'); 
        if(force || check(value) || value.options[value.selectedIndex].text == "---"){
            call_update(value.name, v.wind.deg);
            somethingChanged = true;
        }
        value = document.getElementById('wcc'); 

        if(force || check(value) || value.options[value.selectedIndex].text == "---"){
            var temp = v.weather[0].id;
            call_update(value.name, temp);
            somethingChanged = true;
        }
        value = document.getElementById('airpressure'); 
        if(force || check(value)){
            call_update(value.name, v.main.pressure);
            somethingChanged = true;
        }
        value = document.getElementById('rain'); 
        if(force || check(value)){
            //call_update(value.name, v.rain.(3h));
            //somethingChanged = true;
        }
        value = document.getElementById('temp'); 
        if(force || check(value)){
            call_update(value.name, v.main.temp);
            somethingChanged = true;
        }
        value = document.getElementById('clouds'); 
        if(force || check(value)){
            call_update(value.name, v.clouds.all);
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
        document.getElementById('wcc').options.length = 0;
        if (value != null) {
        	$('option[value='+ value.charAt(0) +']').attr('selected','selected');
            getGruppe(parseInt(value.charAt(0)), parseInt(value), true);
        }else{
        	erweitern('#wcc', "null" , ["null"], ["---"], true);
        	erweitern('#condition', "null", ["null"], ["---"], true);
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
        	erweitern('#winddirection', "null" , ["null"], ["---"], true);
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
        	erweitern('#wavedirection', "null" , ["null"], ["---"], true);
        }
        erweitern('#wavedirection', direction, dirNumbers, dirText, setzeSelect);

    }, "json");
	
}