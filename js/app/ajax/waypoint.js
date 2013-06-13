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

	 		var value = parseInt(data['wcc']);
	 		var setzeSelect = false;
	        var direction = 0;
	        if (value != null) {
	        	setzeSelect = true;
	        }
	        if(!setzeSelect){
	        	erweitern('#wcc', "null" , ["null"], ["---"], true);
	        }
	 		erweitern('#wcc', value, thunderstormCodes, thunderstormText, setzeSelect);
	 		erweitern('#wcc', value, drizzleCodes, drizzleText, setzeSelect);
	 		erweitern('#wcc', value, rainCodes, rainText, setzeSelect);
	 		erweitern('#wcc', value, snowCodes, snowText, setzeSelect);
	 		erweitern('#wcc', value, atmosphereCodes, atmosphereText, setzeSelect);
	 		erweitern('#wcc', value, cloudCodes, cloudText, setzeSelect);
	 		erweitern('#wcc', value, extremeCodes, extremeText, setzeSelect);
	        
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
	        	direction = this.getDirection(parseInt(value), dirNumbers, dirBorders);
	        }
	        if(!setzeSelect){
	        	this.erweitern('#winddirection', "null" , ["null"], ["---"], true);
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
	        	direction = this.getDirection(parseInt(value), dirNumbers, dirBorders);
	        }

	        if(!setzeSelect){
	        	erweitern('#wavedirection', "null" , ["null"], ["---"], true);
	        }
	        erweitern('#wavedirection', direction, dirNumbers, dirText, setzeSelect);

	    }, "json");
    	
	}

	$(document).ready(function(event) {
		loadEntry();

		var temp = document.getElementById('temp');
		$("select").change(function(){
        	if($(this).val() == 'celsius') {
        		temp.value = Math.round((temp.value - 32) * 5/9);
        	}
        	else if ($(this).val() == 'fahrenheit') {
        		temp.value = Math.round(temp.value *1.8 +32);
        	}
    	});
	});

});
