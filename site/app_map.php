<!DOCTYPE html>

<html lang="de">
  	<head>
  	
  		<!-- Header -->
	  	<?php include('_include/header.php'); include('_include/header_app.php'); ?>
	  	
  	</head>
  	<body onload="initialize();">

	  	<!-- Navigation -->
    	<?php include('_include/navigation.php'); ?>

    	<!-- Container -->
    	<div class="container-fluid">
    		
    		<!-- App Navigation -->
    		<?php include('_include/navigation_app.php'); ?>
    		
    		<!-- Route Menu -->
    		<div id="routeMenuContainer">
            	<div id="routeMenu" class="well">
            		<h4>Routen Menü</h4>
	            	<div class="btn-group btn-group-vertical">
	                    <input type="button" class="btn" value="l&ouml;schen" id="deleteRouteButton" class="routeButton" onclick="javascript: deleteRoute()" />
	                    <input type="button" class="btn" value="speichern" id="saveRouteButton" class="routeButton" onclick="javascript: saveRoute()" />
	                    <input type="button" class="btn" value="beenden" id="stopRouteButton" class="routeButton" onclick="javascript: stopRouteMode()" />
	                </div>
	            	<br><br>
	                <div id="route_distance">Routen-L&auml;nge: <span id="route_distance_number"></span> m</div>
	            </div>
	        </div>
	        
	        <!-- Distance Menu -->
	        <div id="distanceToolContainer">
	            <div id="distanceToolMenu" class="well">
	            	<h4>Distanztool</h4>
	            	<input type="button" class="btn" value="beenden" id="stopDistanceToolButton" class="distanceToolbutton" onclick="javascript: stopDistanceToolMode()" />
	            	<br><br>
	            	<div id="distanceTool_distance">Distanz: <span id="distanceTool_number"></span> m</div>
	            </div>
	        </div>
	        
	         <!-- Navigation Menu -->
	        <div id="navigationContainer">
	            <div id="navigationMenu" class="well">
	            	<h4>Navigation</h4>
	            	<input type="button" class="btn" value="beenden" id="stopNavigationButton" class="distanceToolbutton" onclick="javascript: stopNavigationMode()" />
	            	<br><br>
	            	<div id="navigation_distance">Distanz: <span id="navigation_number"></span> m</div>
	            </div>
	        </div>
	        
	        <!-- Current Position -->
	        
	        	<!-- menu -->
			    
	            <!--<div id="followCurrentPosition_button" class="well">
	                <input type="button" class="btn" value="Eigener Position folgen" id="followCurrentPositionbutton" onclick="javascript: toggleFollowCurrentPosition()" />
	            </div>-->
	        
	        
	        <!-- Map -->
	        
	        <div id="appWrapper">

				<nav id="Optionpanel">
					<table> 
						<tr>
							<td colspan="3">
								<center><img src="../img/custom/roadmap.png" id="map_type"></center>
							</td>
						</tr>
						<tr>
							<td>
								<img src="../img/custom/arrow_left.png" id="arrowLeft" width="10px" height="10px">	
							</td>
							<td>
								<label id="lblMapType">Map</label> 
							</td>
							<td>
								<img src="../img/custom/arrow_reight.png" id="arrowReight">
							</td>
						</tr>
					</table>
					
					<table>
						<tr>
							<td>
								<div class="customCheckBox">
							  		<input type="checkbox" id="0" class="layer" name="" style="display:none;"/>
								  	<label for="0" />
							  	</div>								  	
							</td>
							<td>
								<label for="0" style="margin-left:-20px;">Temperatur</label>
							</td>
						</tr>
						<tr>
							<td>
								<div class="customCheckBox">
							  		<input type="checkbox" id="1" class="layer" name="" style="display:none;"/>
								  	<label for="1" />
							  	</div>								  	
							</td>
							<td>
								<label for="1" style="margin-left:-20px;">Wind</label>
							</td>
						</tr>
						<tr>
							<td>
								<div class="customCheckBox">
							  		<input type="checkbox" checked="true" id="2" class="layer" name="" style="display:none;"/>
								  	<label for="2" />
							  	</div>								  	
							</td>
							<td>
								<label for="2" style="margin-left:-20px;">Seezeichen</label>
							</td>
						</tr>
						<tr>
							<td>
								<div class="customCheckBox">
							  		<input type="checkbox" id="weatherClouds" class="layer" name="" style="display:none;"/>
								  	<label for="weatherClouds" />
							  	</div>								  	
							</td>
							<td>
								<label for="weatherClouds" style="margin-left:-20px;">Wetter</label>
							</td>
						</tr>
					</table>	
	                <label>
	                	<input type="button" class="btn" value="Eigener Position folgen" id="followCurrentPositionbutton" onclick="javascript: toggleFollowCurrentPosition()" />
	            	</label>
				</nav>
			</div>
	            <div id="map_canvas"></div>
            </div>
 
	        <!-- Context Menus -->
	        <div id="temporaryMarkerContextMenu"></div>
	        <div id="fixedMarkerContextMenu"></div>
	        <div id="routeContextMenu_active"></div>
	        <div id="routeContextMenu_inactive"></div>	
			<div id="chat" align="center">
                <div id="chat-area" style="height:200px; width:200px; background-color: white; overflow: auto;"></div>
			</div>
		
		</div><!-- Container -->
	    
	    <!-- Java-Script -->
	    <script src="../js/bootstrap/bootstrap-dropdown.js"></script>
	    <script src="../js/bootstrap/bootstrap-modal.js"></script>
	    <script src="../js/bootstrap/bootstrap-transition.js"></script>
	    <script src="../js/bootstrap/bootstrap-button.js"></script>
	    <script src="../js/bootstrap/bootstrap-collapse.js"></script>
	    <script src="../js/bootstrap/bootstrap-affix.js"></script>
	    
	    <!-- Additional Java-Script -->
	    <script src="../js/app/map/fancywebsocket.js" type="text/javascript" ></script>
	    <script src="../js/app/map/chat.js" type="text/javascript" ></script>
	    <script src="../js/app/map/labels.js" type="text/javascript"></script>
	    <script src="../js/app/map/map.js" type="text/javascript"></script>
	    <script src="../js/app/map/map_routes.js" type="text/javascript"></script>
	    <script src="../js/app/map/validation.js" type="text/javascript"></script>
	    <script src="../js/app/map/contextMenu.js" type="text/javascript"></script>
	    <script src="../js/app/map/TxtOverlay.js" type="text/javascript"></script>

	    <!-- External JavaScript to get weather data -->
		<script src="http://openweathermap.org/js/OWM.GoogleMap.1.0.js" ></script>

	</body>
</html>