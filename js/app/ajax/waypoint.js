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
	        	erweitern('#condition', "null", ["null"], ["---"]);
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

		var temp = document.getElementById('temp');
		$("select").change(function(){
        	if($(this).val() == 'celsius') {
        		temp.value = Math.round((temp.value - 32) * 5/9);
        	}
        	else if ($(this).val() == 'fahrenheit') {
        		temp.value = Math.round(temp.value *1.8 +32);
        	}
        	alert($(this).value);
    	});

    	$("input").change(function(e) {	
    		alert(e.name);
    		//call_update($(this).name, $(this).val())
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
