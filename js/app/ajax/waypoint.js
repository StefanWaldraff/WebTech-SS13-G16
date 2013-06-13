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


	        var thunderstormCodes = [200, 201, 210, 211, 212, 221, 230, 231, 232];
	        var thunderstormText = ["thunderstorm with light rain", "thunderstorm with rain", "thunderstorm with heavy rain", "light thunderstorm",
	        	"thunderstorm", "heavy thunderstorm", "ragged thunderstorm", "thunderstorm with light drizzle",
	        	 "thunderstorm with drizzle", "thunderstorm with heavy drizzle"];
	        
	       	var drizzleCodes = [300, 301, 302, 310, 311, 312, 321];
	       	var drizzleText =["light intensity drizzle", "drizzle", "heavy intensity drizzle", "light intensity drizzle rain",
	       		"drizzle rain", "heavy intensity drizzle rain", "shower drizzle"];
	 	
	 		var rainCodes = [500, 501, 502, 503, 504, 511, 520, 521, 522];
	 		var rainText = ["light rain", "moderate rain", "heavy intensity rain", "very heavy rain", "extreme rain", "freezing rain",
	 			"light intensity shower rain", "shower rain", "heavy intensity shower rain"];

	 		var snowCodes = [600, 601, 602, 611, 621];
	 		var snowText = ["light snow", "snow", "sleet", "shower snow"];

	 		var atmosphereCodes = [701, 711, 721, 731, 741];
	 		var atmosphereText = ["mist", "smoke", "haze", "Sand/Dust Whirls", "Fog"];

	 		var cloudCodes = [800, 801, 802, 803, 804];
	 		var cloudText = ["sky is clear", "few clouds", "scattered clouds", "broken clouds", "overcast clouds"];

			var extremeCodes = [900, 901, 902, 903, 904, 905, 906];
			var extremeText = ["tornado", "tropical storm", "hurricane", "cold", "hot", "windy", "hail"];

			this.erweitern = function(feld, wert, codeArray, textArray, setzeSelect){
	 			if(!setzeSelect || $.inArray(wert, codeArray) != -1){
	 				for (var i = 0; i < codeArray.length; i++) {
	 				var opt = new Option(textArray[i], codeArray[i]);
	 				$(feld).append(opt);
	 			};
	 			if(setzeSelect)
	 				$('option[value='+ wert +']').attr('selected','selected'); 
	 			}
	 		}
	 		var value = parseInt(data['wcc']);
	 		var setzeSelect = false;
	        var direction = 0;
	        if (value != null) {
	        	setzeSelect = true;
	        }
	        if(!setzeSelect){
	        	this.erweitern('#wcc', "null" , ["null"], ["---"], true);
	        }
	 		this.erweitern('#wcc', value, thunderstormCodes, thunderstormText, setzeSelect);
	 		this.erweitern('#wcc', value, drizzleCodes, drizzleText, setzeSelect);
	 		this.erweitern('#wcc', value, rainCodes, rainText, setzeSelect);
	 		this.erweitern('#wcc', value, snowCodes, snowText, setzeSelect);
	 		this.erweitern('#wcc', value, atmosphereCodes, atmosphereText, setzeSelect);
	 		this.erweitern('#wcc', value, cloudCodes, cloudText, setzeSelect);
	 		this.erweitern('#wcc', value, extremeCodes, extremeText, setzeSelect);
	        
	        value = data['temp'];
	        if(value != null){
	        	$('#temp').val(parseInt(value) - 272);
	        }
	        $('#airpressure').val(data['airpressure']);
	        $('#windspeed').val(data['windspeed']);

	        var dirNumbers = [0, 45, 90, 135, 180, 225, 270, 315];
	        var dirBorders = [22, 67, 112, 157, 202, 247, 292, 337];
	        var dirText = ["North", "North-East", "East", "South-East", "South", "South-West", "West", "North-West"];

	        this.getDirection = function(value, numbers, borders){
	        	if(value < 0){
	        		value = 360 + value;
	        	}
	        	for (var i = 0; i < borders.length; i++) {
	        		if(value <= borders[i])
	        			return numbers[i];
	        	};
	        	return 0;
	        }

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
	        this.erweitern('#winddirection', direction, dirNumbers, dirText, setzeSelect);

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
	        	this.erweitern('#wavedirection', "null" , ["null"], ["---"], true);
	        }
	        this.erweitern('#wavedirection', direction, dirNumbers, dirText, setzeSelect);

	    }, "json");
    	
	}

	$(document).ready(function(event) {
		loadEntry();
	});

});