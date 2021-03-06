// Php-Server JS-Code auslagern?
// andere M�glichkeit zur Routenbenennung �berlegen
// wozu lat/long anzeige? entfernen?
// openseamap fehler beheben falls m�glich
// Benutzerposition bestimmen

var map = null;
var markersArray = [];
var station_list;

var overlay = new google.maps.OverlayView();

var MODE = { DEFAULT: { value: 0, name: "default" }, ROUTE: { value: 1, name: "route" }, DISTANCE: { value: 2, name: "distance" }, NAVIGATION: { value: 3, name: "navigation" } };
var currentMode = MODE.DEFAULT;

var tmp_lat = 47.65521295468833;
var tmp_lon = 9.2010498046875;
var timestamp = 0;
var server_url = './../site/server/chatserver.php';  
var noerror = false;
var cometIntervalId = null;

var currentPositionMarker = null;
var followCurrentPosition = false;
var noToggleOfFollowCurrentPositionButton = false;

var temporaryMarker = null;
var temporaryMarkerInfobox = null;
var temporaryMarkerTimeout = null;

var fixedMarker = null;
var fixedMarkerInfoBox = null;
var fixedMarkerCount = 0;
var fixedMarkerArray = new Array();

var selectedMarker = null;

var currentPositionMarkerImage = new google.maps.MarkerImage('../img/icons/boat.png',
    new google.maps.Size(50, 50), //size
    new google.maps.Point(0, 0),  //origin point
    new google.maps.Point(25, 40)  //offset point
);

var temporaryMarkerImage = new google.maps.MarkerImage('../img/icons/cross_hair.png',
    new google.maps.Size(43, 43), //size
    new google.maps.Point(0, 0),  //origin point
    new google.maps.Point(22, 22)  //offset point
);

var fixedMarkerImage = new google.maps.MarkerImage('../img/icons/flag6.png',
    new google.maps.Size(40, 40), //size
    new google.maps.Point(0, 0),  //origin point
    new google.maps.Point(9, 32)  //offset point
);

var routeMarkerImage = new google.maps.MarkerImage('../img/icons/flag4.png',
    new google.maps.Size(40, 40), //size
    new google.maps.Point(0, 0),  //origin point
    new google.maps.Point(7, 34)  //offset point
);

var distanceMarkerImage = new google.maps.MarkerImage('../img/icons/flag5.png',
    new google.maps.Size(40, 40), //size
    new google.maps.Point(0, 0),  //origin point
    new google.maps.Point(7, 34)  //offset point
);

var destinationMarkerImage = new google.maps.MarkerImage('../img/icons/destination.png',
    new google.maps.Size(28, 31), //size
    new google.maps.Point(0, 0),  //origin point
    new google.maps.Point(7, 9)  //offset point
);

function MarkerWithInfobox(marker, infobox, counter) {
    this.reference = marker;
    this.infobox = infobox;
    this.counter = counter;
}

// initialize map and all event listeners
function initialize() {

    connect();

    // set different map types
    var mapTypeIds = ["roadmap", "satellite", "OSM"];
    var mapTypeLabels = ["Map", "Satellite", "OpenStreetMap"];
    var mapTypeImages = ["../img/custom/roadmap.png", "../img/custom/satellite.png", "../img/custom/openStreetMap.png"];

    // set map Options
    var mapOptions = {
        center: new google.maps.LatLng(tmp_lat, tmp_lon),
        zoom: 14,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControlOptions: {
            mapTypeIds: mapTypeIds
        },
        disableDefaultUI: true,
        mapTypeControl: false
    };

    //set route menu position
    document.getElementById('routeMenuContainer').style.width = document.body.offsetWidth + "px";
    document.getElementById('routeMenuContainer').style.display = "none";
    document.getElementById('distanceToolContainer').style.width = document.body.offsetWidth + "px";
    document.getElementById('distanceToolContainer').style.display = "none";
    document.getElementById('navigationContainer').style.width = document.body.offsetWidth + "px";
    document.getElementById('navigationContainer').style.display = "none";
    document.getElementById('chat').style.display = "none";

    // initialize map
    map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
    
    // set client position
    currentPosition = new google.maps.LatLng(tmp_lat, tmp_lon)

    var currentMarkerOptions = {
        position: currentPosition,
        map: map,
        icon: currentPositionMarkerImage
    }

    // initialize marker for current position
    currentPositionMarker = new google.maps.Marker(currentMarkerOptions);

    // set map types
    map.mapTypes.set("OSM", new google.maps.ImageMapType({
        getTileUrl: function (coord, zoom) {
            return "http://tile.openstreetmap.org/" + zoom + "/" + coord.x + "/" + coord.y + ".png";
        },
        tileSize: new google.maps.Size(256, 256),
        name: "OSM",
        maxZoom: 18
    }));

    overlay.draw = function () { };
    overlay.setMap(map);

    //Optionpanel clicked event
    var options = document.getElementById('Optionpanel');
    var currentMapType = 0;
    options.addEventListener("click", function (e) {
            
        if(e.target.id == 'Optionpanel') {
            if(options.style.left != '0px')
                options.style.left = '0px';
            else
                options.style.left = '-16em';
        }
        else if(e.target.id == 'arrowLeft') {
            if(currentMapType > 0)
                currentMapType -= 1;
            else
                currentMapType = 2;
            document.getElementById('lblMapType').innerHTML = mapTypeLabels[currentMapType];
            document.getElementById('map_type').src = mapTypeImages[currentMapType];
        }
        else if(e.target.id == 'arrowReight') {
            if(currentMapType < 2)
                currentMapType += 1;
            else
                currentMapType = 0;
            document.getElementById('lblMapType').innerHTML = mapTypeLabels[currentMapType];
            document.getElementById('map_type').src = mapTypeImages[currentMapType];
        }
        else if(e.target.id == 'map_type' || e.target.id == 'lblMapType') {
            map.setMapTypeId(mapTypeIds[currentMapType]);
        }
        else if(e.target.id == 'weatherClouds') {
            handleClouds();
        }
    });

    google.maps.event.addListener(currentPositionMarker, 'position_changed', function () {
        
        if (followCurrentPosition) {
            map.setCenter(currentPositionMarker.getPosition());
        }
        
        if (currentMode == MODE.NAVIGATION) {
            updateNavigation(currentPositionMarker.position, destinationMarker.position);
        }
    });

    // Overlay map array containing all used overlayer    
    overlayMaps = [{
        getTileUrl: function (coord, zoom) {
        return "http://www.openportguide.org/tiles/actual/air_temperature/5/" + zoom + "/" + coord.x + "/" + coord.y + ".png";
        },
        tileSize: new google.maps.Size(256, 256),
        name: "OpenSeaMapTemperature",
        maxZoom: 18
    }, {
        getTileUrl: function (coord, zoom) {
        return "http://www.openportguide.org/tiles/actual/wind_vector/7/" + zoom + "/" + coord.x + "/" + coord.y + ".png";
        },
        tileSize: new google.maps.Size(256, 256),
        name: "OpenSeaMapWeather",
        maxZoom: 18
    }, {
        getTileUrl: function (coord, zoom) {
            return "http://tiles.openseamap.org/seamark/" + zoom + "/" + coord.x + "/" + coord.y + ".png";
        },
        tileSize: new google.maps.Size(256, 256),
        name: "OpenSeaMap",
        maxZoom: 18
    }];

    // initialize empty array with static number of entries
    for (i = 0; i < overlayMaps.length; i++){
        map.overlayMapTypes.push(null);
    }

    // activate seapal standard overlayer
    var overlayMap = new google.maps.ImageMapType(overlayMaps[2]);
    map.overlayMapTypes.setAt(2, overlayMap);

    // drawing selected overlayers
    $('.layer').click(function(){
        var layerID = parseInt($(this).attr('id'));
        if(!isNaN(layerID)) {
            if ($(this).attr('checked')){
                var overlayMap = new google.maps.ImageMapType(overlayMaps[layerID]);
                map.overlayMapTypes.setAt(layerID, overlayMap);
            } else {
                if (map.overlayMapTypes.getLength() > 0){
                    map.overlayMapTypes.setAt(layerID, null);
                }
            }
        }
    });

    // create cloud layer if activated
    google.maps.event.addListener(map, 'idle', handleClouds);    

    // click on map
    google.maps.event.addListener(map, 'click', function (event) {

        // Handle optionpanel size
        var panel = document.getElementById('Optionpanel');
        if(panel.style.left == '0px')
            panel.style.left = '-16em'; 

        // handler for default mode
        if (currentMode == MODE.DEFAULT) {
            setTemporaryMarker(event.latLng);
        } else if (currentMode == MODE.ROUTE || currentMode == MODE.DISTANCE) {
            addRouteMarker(event.latLng);
        }
    });

    google.maps.event.addListener(map, 'center_changed', function () {
        if (followCurrentPosition && !noToggleOfFollowCurrentPositionButton) {
            //toggleFollowCurrentPosition();
        } else {
            noToggleOfFollowCurrentPositionButton = false;
        }
    });
}

/*
 * Get latitude and longitude from server
 */
function connect() {
    
    $.ajax({
      type : 'get',
      url : server_url,
      dataType : 'json', 
      data : {'timestamp' : timestamp},
      success : function(response) {
        timestamp = response.timestamp;
        tmp_lat =  response.lat;
        tmp_lon =  response.lon;        
        noerror = true;          
      },
      complete : function(response) {
        // send a new ajax request when this request is finished
        if (!self.noerror) {
          // if a connection problem occurs, try to reconnect each 5 seconds
          cometIntervalId = setTimeout(function(){ connect(); }, 5000);           
        }else {
          // persistent connection
          connect(); 
        }
        noerror = false;                    
      }
    });
    if(followCurrentPosition) {
        
        currentPosition = new google.maps.LatLng(tmp_lat, tmp_lon);
        
        var currentMarkerOptions = {
            position: currentPosition,
            map: map,
            icon: currentPositionMarkerImage
        }

        // initialize marker for current position
        currentPositionMarker = new google.maps.Marker(currentMarkerOptions);
        map.setCenter(currentPositionMarker.getPosition());
    }
    else {
        if(cometIntervalId != null)
        {
            cometIntervalId = null;
            clearTimeout(cometIntervalId);
        }
    }
}

// get weather data and add it to map if overlayer is activated
function handleClouds(){
    var chxClouds = document.getElementById('weatherClouds');
    if(chxClouds.checked) {
        var bounds = map.getBounds();
        var ln = bounds.getNorthEast();
        var ln2 = bounds.getSouthWest();
        var z = map.getZoom();
        var myhre = 'http://openweathermap.org/data/getrect?type=city&cnt=200&lat1='+ 
            ln2.lat() + '&lat2='+ ln.lat() + '&lng1=' + ln2.lng() + '&lng2='+ ln.lng()+
            "&cluster=yes&zoom="+z+"&callback=?";
        $.getJSON(myhre, getData);
    }
    else {
        // delete all cloud items 
        deleteOverlays();
    }
}

// get temperature data from openweathermap.org
function getData(s)
{
    station_list = s;

    if(station_list.cod != '200') {
        alert('Info: ' + JSONobject.message);
        return;
    }

    // clean map
    deleteOverlays();

    infowindow = new google.maps.InfoWindow({
        content: "place holder",
        disableAutoPan: false
    })

    // recreate cloud items
    for(var i = 0; i <  station_list.list.length; i ++){
        var p = new google.maps.LatLng(station_list.list[i].lat, station_list.list[i].lng);

        var temp = station_list.list[i].temp -273;
        temp = Math.round(temp*100)/100;

        img = GetWeatherIcon(station_list.list[i]);
        var html_b = '<div style="background-color:#ffffff;opacity:0.8;border:1px solid #777777;" >\
            <img src="http://openweathermap.org'+img+'" height="50px" width="60px" style="float: left; "><b>'+temp+' °C</b></div>';


        var m = new StationMarker(p, map, html_b);
        m.station_id=i; 
        markersArray.push(m);

      }
}

// remove all clouds from map
function deleteOverlays() {
  if (markersArray) {
    for (i in markersArray) {
          markersArray[i].setMap(null);
    }
    markersArray.length = 0;
  }
}

// temporary marker context menu ----------------------------------------- //
$(function () {
    $.contextMenu({
        selector: '#temporaryMarkerContextMenu',
        events: {
            hide: function () {
                startTimeout();
            }
        },
        callback: function (key, options) {
        
            if (key == "marker") {

                setFixedMarker(temporaryMarker.position)

            } else if (key == "startroute") {

                startNewRoute(temporaryMarker.position, false);

            } else if (key == "distance") {

                startNewRoute(temporaryMarker.position, true);

            } else if (key == "destination") {
            
                startNewNavigation(currentPositionMarker.position, temporaryMarker.position);

            } else if (key == "delete") {
                temporaryMarker.setMap(null);
                temporaryMarkerInfobox.setMap(null);
            }
        },
        items: {
            "marker": { name: "Markierung setzen", icon: "marker" },
            "startroute": { name: "Neue Route setzen", icon: "startroute" },
            "distance": { name: "Distanz messen", icon: "distance" },
            "destination": { name: "Zum Ziel machen", icon: "destination" },
            "sep1": "---------",
            "delete": { name: "L&ouml;schen", icon: "delete" }
        }
    });
});

// fixed marker context menu ------------------------------------------------ //
$(function () {
    $.contextMenu({
        selector: '#fixedMarkerContextMenu',
        callback: function (key, options) {
            if (key == "destination") {

                startNewNavigation(currentPositionMarker.position, selectedMarker.reference.position);
            
            } else if (key == "delete") {
                selectedMarker.reference.setMap(null);
                selectedMarker.infobox.setMap(null);
                fixedMarkerArray.splice(fixedMarkerArray.indexOf(selectedMarker), 1);
            }
        },
        items: {
            "destination": { name: "Zum Ziel machen", icon: "destination" },
            "sep1": "---------",
            "delete": { name: "L&ouml;schen", icon: "delete" }
        }
    });
});

// helper functions --------------------------------------------------------- //

// start marker timout
function startTimeout() {

    temporaryMarkerTimeout = setTimeout(function () {
        temporaryMarker.setMap(null);
        temporaryMarkerInfobox.setMap(null);
    }, 5000);
}

// stop marker timout
function stopTimeout() {
    clearTimeout(temporaryMarkerTimeout);
}

// draw temporaryMarkerInfobox 
function drawTemporaryMarkerInfobox(latLng) {
    customTxt = "<div class='markerInfoBox well' id='temporaryMarkerInfobox'>"
     + formatCoordinate(latLng.lat(), "lat") + " "
     + formatCoordinate(latLng.lng(), "long")
     + "</br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbspDTM " + getDistance(latLng, currentPositionMarker.position) + "m</div>";
    //return new TxtOverlay(latLng, customTxt, "coordinate_info_box", map, -110, -60);
    //$('body').append("<span>" + latLng.lat() + " " + latLng.lng() + "</span><br>");
    return new TxtOverlay(latLng, customTxt, "coordinate_info_box", map, -113, -92);
}

// draw fixedMarkerInfobox 
function drawFixedMarkerInfobox(latLng, counter) {

    customTxt = "<div class='markerInfoBox label' id='fixedMarkerInfobox'>"
     + "Markierung " + (counter) + "</div>";
    return new TxtOverlay(latLng, customTxt, "coordinate_info_box", map, 40, -29);
}

function getMarkerWithInfobox(event) {

    for (var i = 0; i < fixedMarkerArray.length; i++) {
        if (fixedMarkerArray[i].reference.position == event.latLng) {
            return fixedMarkerArray[i];
        }
    }
    return null;
}

function setTemporaryMarker(position) {

    var temporaryMarkerOptions = {
        position: position,
        map: map,
        icon: temporaryMarkerImage,
        draggable: true
    }

    // delete temp marker & infobox
    if (temporaryMarker != null) { temporaryMarker.setMap(null); }
    if (temporaryMarkerInfobox != null) { temporaryMarkerInfobox.setMap(null); }

    stopTimeout();
    temporaryMarker = new google.maps.Marker(temporaryMarkerOptions);

    // click on marker
    google.maps.event.addListener(temporaryMarker, 'click', function (event) {
        var pixel = fromLatLngToPixel(event.latLng);
        
        if (currentMode != MODE.NAVIGATION) {
            $('#temporaryMarkerContextMenu').contextMenu({ x: pixel.x, y: pixel.y });
        }
        
        stopTimeout();
    });

    // marker is dragged
    google.maps.event.addListener(temporaryMarker, 'drag', function (event) {
        temporaryMarkerInfobox.setMap(null);
        temporaryMarkerInfobox = drawTemporaryMarkerInfobox(event.latLng);
    });

    // marker drag start
    google.maps.event.addListener(temporaryMarker, 'dragstart', function (event) {
        stopTimeout();
    });

    // marker drag end
    google.maps.event.addListener(temporaryMarker, 'dragend', function (event) {
        startTimeout();
    });

    startTimeout();
    temporaryMarkerInfobox = drawTemporaryMarkerInfobox(position);
}

function setFixedMarker(position) {

    temporaryMarker.setMap(null);
    temporaryMarkerInfobox.setMap(null);
    stopTimeout();

    fixedMarkerCount++;
    var fixedMarkerOptions = {
        position: position,
        map: map,
        title: 'Markierung ' + fixedMarkerCount,
        icon: fixedMarkerImage,
        draggable: true
    }

    fixedMarker = new google.maps.Marker(fixedMarkerOptions);

    // click on fixed marker
    google.maps.event.addListener(fixedMarker, 'click', function (event) {
        selectedMarker = getMarkerWithInfobox(event);
        var pixel = fromLatLngToPixel(event.latLng);
        
        if (currentMode != MODE.NAVIGATION) {
            $('#fixedMarkerContextMenu').contextMenu({ x: pixel.x, y: pixel.y });
        }
    });

    // marker is dragged
    google.maps.event.addListener(fixedMarker, 'drag', function (event) {
        selectedMarker = getMarkerWithInfobox(event);
        selectedMarker.infobox.setMap(null);
        selectedMarker.infobox = drawFixedMarkerInfobox(event.latLng, selectedMarker.counter);
    });

    fixedMarker.setMap(map);
    fixedMarkerInfoBox = drawFixedMarkerInfobox(temporaryMarker.position, fixedMarkerCount);
    fixedMarkerArray.push(new MarkerWithInfobox(fixedMarker, fixedMarkerInfoBox, fixedMarkerCount));
}

function getDistance(coord1, coord2) {
    return Math.round(google.maps.geometry.spherical.computeDistanceBetween(coord1, coord2));
}

function fromLatLngToPixel(latLng) {

    var pixel = overlay.getProjection().fromLatLngToContainerPixel(latLng);
    pixel.x += document.getElementById('map_canvas').offsetLeft;
    pixel.y += document.getElementById('map_canvas').offsetTop;
    return pixel;
}

function toggleFollowCurrentPosition() {
    followCurrentPosition = !followCurrentPosition;
    if (followCurrentPosition) {
        document.getElementById("followCurrentPositionbutton").value = "Eigener Position nicht mehr folgen";
        noToggleOfFollowCurrentPositionButton = true;
        connect();
    } else {
        document.getElementById("followCurrentPositionbutton").value = "Eigener Position folgen"; 
        initialize();
    }

}





