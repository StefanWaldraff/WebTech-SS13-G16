<!DOCTYPE html>

<html lang="de">
	<head>
		
		<!-- Header -->
		<?php include('_include/header.php'); ?>
		
	</head>
	<body>
		
		<!-- Navigation -->
		<?php include('_include/navigation.php'); ?>
		
		<!-- Container -->
		<div class="container-fluid">
			
			<!-- App Navigation -->
			<?php include('_include/navigation_app.php'); ?>
			
			<!-- Content -->		
			<div id="appWrapper" align="center">
			    <br />
			    <h2>Wegpunkt</h2>
			    <br />
			    <div class="container-fluid" align="center">
	            	<form class="form-horizontal"> 
		            	<div class="row well" style="margin-left: 15%;" align="center">
		            		<div class="span4" align="center">	            		
			            		<div class="control-group">
			            			<label class="control-label">Name</label>
			            			<input class="input-medium" type="text" id="name"/>
			            		</div>
			            		<div class="control-group">
			            			<label class="control-label">Time</label>
			            			<input class="input-medium" type="date" id="wdate"/>
			                    </div>
			                    <div class="control-group">
			            			<label class="control-label">Date</label>
			            			<input class="input-medium" type="date" id="wtime"/>
			                    </div>
		            		</div>
		            		<div class="span4">
		            			<div class="control-group">
			            			<label class="control-label">Latitude</label>
			            			<input class="input-medium" type="text" id="lat"/>
			            		</div>
			            		<div class="control-group">
			            			<label class="control-label">Longitude</label>
			            			<input class="input-medium" type="text" id="lng"/>
			                    </div>
			                    <div class="control-group">
			            			<label class="control-label">Fahrt nach</label>
			            			<select name="fahrtziel" id="marker" style="width: 165px;"></select>
			                    </div>
		            		</div>
		            		<div class="span4">
		            			<div class="control-group">
			            			<label class="control-label">COG</label>
			            			<input class="input-medium" type="text" id="cog"/>
			                    </div>
			                    <div class="control-group">
			            			<label class="control-label">SOG</label>
			            			<input class="input-medium" type="text" id="sog"/>
			                    </div>
			                    
			                    <div class="control-group">
			                    	<label class="control-label">Manoever</label>
			            			<select name="manoever" id="manoever" style="width: 165px;"></select>
			                    </div>                   
		            		</div>
		            		<div class="span4">
		            			<div class="control-group">
			            			<label class="control-label">BTM</label>
			            			<input class="input-medium" type="text" id="btm"/>
			                    </div>
			                    <div class="control-group">
			            			<label class="control-label">DTM</label>
			            			<input class="input-medium" type="text" id="dtm"/>
			                    </div>
			                    <div class="control-group">
			            			<label class="control-label">Vorsegel</label>
			            			<select name="vorsegel" id="vorsegel" style="width: 165px;"></select>
			            		</div>
		            		</div>
		            	</div>      	 
	            	</div>
	            </div>
			    <br />
			    <br />
			    <div class="container" align="center">
			    <div class="row" style="margin-left:5%;">
			        <div class="span4" id="appNotes">
			        	<h4>Notes</h4>
			            <textarea style="width:96%; height:360px;"></textarea>
			        </div>
			        <div class="span4" id="markerMap">
			        	<h4>Map</h4>
			            <img src="../img/icons/marker_map.png" id="appInfoPhoto" style="width:100%; heigt: 100%;"/>
			        </div>
			        <div class="span4" id="appPhotos">
			        	<h4>Photos</h4>
				        <img src="../img/icons/no_image.jpg" id="appInfoPhoto" style="width:100%; heigt: 100%;"/>
				    </div>
				</div>
			    </div>
			</div><!-- Content -->
			
			<div id="appWrapper" align="center">
			    <br />
			    <h2>Weather information</h2>
			    <br />
			    <div class="container-fluid" align="center">
		            	<div class="row well" style="margin-left: 15%;" align="center">
		            		<div width: 600px;>
								<div class="control-group">
									<label class="control-label" >Wind strength</label>
									<img src="../img/custom/windspeed0.png" />   
									<input type="radio" name="windstrength" value="0" />
									<img src="../img/custom/windspeed1.png" /> 
									<input type="radio" name="windstrength" value="1" /> 	
									<img src="../img/custom/windspeed2.png" /> 
									<input type="radio" name="windstrength" value="2" />  
									<img src="../img/custom/windspeed3.png" /> 
									<input type="radio" name="windstrength" value="3" >
									<img src="../img/custom/windspeed4.png" > 
									<input type="radio" name="windstrength" value="4" >
									<img src="../img/custom/windspeed5.png" > 
									<input type="radio" name="windstrength" value="5" > 
									<img src="../img/custom/windspeed14.png" > 
									<input type="radio" name="windstrength" value="14" >
									<img src="../img/custom/windspeed15.png" > 
									<input type="radio" name="windstrength" value="15" >	
			            		</div>
								<div class="control-group">
			            			<label class="control-label" >Clouds</label>
									<img src="../img/custom/sonne.jpg" > 
									<input type="radio" name="clouds" value="sonnig" selected="selected" >
									<img src="../img/custom/grauewolke.jpg" > 
									<input type="radio" name="clouds" value="bewölkt" >
									<img src="../img/custom/wolkesonneblitz.jpg" > 
									<input type="radio" name="clouds" value="wechselhaft" >
									<img src="../img/custom/wolkesonne.jpg" > 
									<input type="radio" name="clouds" value="sonnewolke" >
									<img src="../img/custom/blitz.jpg" > 
									<input type="radio" name="clouds" value="gewittrig" >
			                    </div>
							</div>
							<div class="span4">
			            		<div class="control-group">
			            			<label class="control-label" >Wind direction</label>
			            			<select name="winddirection" id="winddirection" style="width: 165px";>
										<option value="nord" selected="selected">Nord</option>
										<option value="nordost">Nord-Ost</option>
										<option value="ost">Ost</option>
										<option value="sued">Süd-Ost</option>
										<option value="sued">Süd</option>
										<option value="suedwest">Süd-West</option>
										<option value="west">West</option>
										<option value="nordwest">Nord-West</option>
									</select>
			                    </div>
			                    <div class="control-group">
			            			<label class="control-label" >Rain</label>
			            			<select name="rain" id="rain" style="width: 165px";>
										<option value="leicht">Leicht</option>
										<option value="mittel">Mittel</option>
										<option value="stark">Stark</option>
										<option value="sehrstark">Sehr stark</option>
									</select>
			                    </div>
		            		</div>
							<div class="span4">
								<div class="control-group">
			            			<label class="control-label" >Air pressure</label>
			            			<input class="input-medium" type="text" id="airpressure"/>
			                    </div>
		            		
		            			<div class="control-group">
			            			<label class="control-label" >Temperature</label> 
									<input type="radio" name="massstab" value="celsius" >Grad Celsius
									<input type="radio" name="massstab" value="fahrenheit" >Grad Fahrenheit
			            			<input  type="text" id="temp" class="input-medium" />
			            		</div>
							</div>
							<div class="span4">
		            			<div class="control-group">
			            			<label class="control-label" >Wave hight</label>
			            			<input class="input-medium" type="text" id="wavehigh" />
			                    </div>
			                    <div class="control-group">
			            			<label class="control-label" >Wave direction</label>
			            			<select name="wavedirection" style="width: 165px";>
										<option value="nord" selected="selected">Nord</option>
										<option value="nordost">Nord-Ost</option>
										<option value="ost">Ost</option>
										<option value="sued">Süd-Ost</option>
										<option value="sued">Süd</option>
										<option value="suedwest">Süd-West</option>
										<option value="west">West</option>
										<option value="nordwest">Nord-West</option>
									</select>
			                    </div>
							</div>
							<div class="span4">
								<div class="control-group">
									<label class="control-label" >Uhrzeit</label>
									<input class="input-medium"  type="time" />
								</div>
								<div class="control-group">
									<label class="control-label" >Datum</label>
									<input class="input-medium"  type="date" id="datum"/>
								</div>
							</div>
		            	</div>    
	            </div>
			</form>
			
		</div><!-- Container -->
		
		<!-- Java Script -->
		<script src="../js/bootstrap/bootstrap-transition.js"></script>
	    <script src="../js/bootstrap/bootstrap-button.js"></script>
	    <script src="../js/bootstrap/bootstrap-collapse.js"></script>
	    <script src="../js/bootstrap/bootstrap-affix.js"></script>
		
		<!-- Additional Java-Script -->
		<script src="../js/app/ajax/waypoint.js" type="text/javascript"></script>
		
	</body>
</html>