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
		<form class="form-horizontal"> 	
			<!--Container -->
			<div id="appWrapper" align="center">
			    <br />
			    <h2>Wegpunkt</h2>
			    <br />
			    <div class="container-fluid" align="center">
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
				<br />
<!-- UNSER TEIL ------------------------------------------------------------------------------------------------------------------------------------ -->
				<h2>Weather information</h2>
				<br />
				<div class="container-fluid" align="center">
						<div class="row well" style="margin-left: 15%;" align="center">
							<div class="span4">
								<div class="control-group">
									<label class="control-label" >Wind strength</label>
									<input class="input-medium" type="number" name="windstrength" id="windstrength" value="0" min="0" max="12" />	
								</div>
								<div class="control-group">
									<label class="control-label" >Clouds</label>
									<!--<input class="input-medium" type="number" name="clouds" id="clouds" value="0" min="0" max="100" step="10"/>-->
									<select name="clouds" id="clouds" style="width: 165px";>
										<option value="800" selected="selected">sky is clear</option>
										<option value="801">few clouds</option>
										<option value="802">scattered clouds</option>
										<option value="803">broken clouds</option>
										<option value="804">overcast clouds</option>
									</select>
								</div>
							</div>
							<div class="span4">
								<div class="control-group">
									<label class="control-label" >Wind direction</label>
									<select name="winddirection" id="winddirection" style="width: 165px";>
										<option value="0" selected="selected">North</option>
										<option value="45">North-East</option>
										<option value="90">East</option>
										<option value="135">South-East</option>
										<option value="180">South</option>
										<option value="225">South-West</option>
										<option value="270">West</option>
										<option value="315">North-West</option>
									</select>
								</div>
								<div class="control-group">
									<label class="control-label" >Rain</label>
									<select name="rain" id="rain" style="width: 165px";>
										<option  value="noRain">no rain</option>
										<option  value="500">light rain</option>
										<option value="501">moderate rain</option>
										<option value="502">heavy intensity rain</option>
										<option value="503">very heavy rain</option>
										<option  value="504">extreme rain</option>
										<option value="511">freezing rain</option>
										<option value="520">light intensity shower rain</option>
										<option value="521">shower rain</option>
										<option  value="522">heavy intensity shower rain</option>
									</select>
								</div>
							</div>
							<div class="span4">
								<div class="control-group">
									<label class="control-label" >Air pressure</label>
									<input class="input-medium" type="number" id="airpressure" min="0"/>
								</div>
								<div class="control-group">
									<label class="control-label" >Temperature</label> 
									<input  type="text" id="temp" class="input-medium" />
									<select name="scale" style="width: 165px";>
										<option value="celsius" selected="selected">&degC </option>
										<option value="fahrenheit">&degF </option>
									</select>
								</div>
							</div>
							<div class="span4">
								<div class="control-group">
									<label class="control-label" >Wave hight</label>
									<input class="input-medium" type="number" id="wavehigh" min="0"/>
								</div>
								<div class="control-group">
									<label class="control-label" >Wave direction</label>
									<select name="wavedirection" style="width: 165px";>
										<option value="0" selected="selected">North</option>
										<option value="45">North-East</option>
										<option value="90">East</option>
										<option value="135">South-East</option>
										<option value="180">South</option>
										<option value="225">South-West</option>
										<option value="270">West</option>
										<option value="315">North-West</option>
									</select>
								</div>
							</div>
						</div>    
				</div>
			</div>
		</form>
		</div>
	<!-- Container -->
		<!--footer -->
		<?php include('_include/footer.php'); ?>
		<!-- Java Script -->
		<script src="../js/bootstrap/bootstrap-transition.js"></script>
	    <script src="../js/bootstrap/bootstrap-button.js"></script>
	    <script src="../js/bootstrap/bootstrap-collapse.js"></script>
	    <script src="../js/bootstrap/bootstrap-affix.js"></script>
		
		<!-- Additional Java-Script -->
		<script src="../js/app/ajax/waypoint.js" type="text/javascript"></script>
		
	</body>
</html>