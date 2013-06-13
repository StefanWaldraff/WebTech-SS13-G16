<?php

	include('_include/connection.php');
	
	if (!$db_selected) {
	    $err = array( "wnr" => 'Error: ' . mysql_error() );
	    echo json_encode($err);
	    exit;
	}
	
	$sql = "INSERT INTO seapal.wegpunkte(tnr, name, btm, dtm, lat, lng, sog, cog, manoever, vorsegel, wdate, wtime, marker," 	
	. " wcc, icon, temp, airpressure, windspeed, winddirection, rain, clouds, wavehight, wavedirection) VALUES (
				" .  $_POST['tnr'] . ", 
				'" . $_POST['name'] . "',
				'" . $_POST['btm'] . "', 
				'" . $_POST['dtm'] . "',
				'" . $_POST['lat'] . "', 
				'" . $_POST['lng'] . "',
				'" . $_POST['sog'] . "', 
				'" . $_POST['cog'] . "', 
				'" . $_POST['manoever'] . "', 
				'" . $_POST['vorsegel'] . "', 
				'" . $_POST['wdate'] . "', 
				'" . $_POST['wtime'] . "', 
				'" . $_POST['marker'] . "'
				'" . $_POST['wcc'] . "'
				'" . $_POST['icon'] . "'
				'" . $_POST['temp'] . "'
				'" . $_POST['airpressure'] . "'
				'" . $_POST['windspeed'] . "'
				'" . $_POST['winddirection'] . "'
				'" . $_POST['rain'] . "'
				'" . $_POST['clouds'] . "'
				'" . $_POST['wavehight'] . "'
				'" . $_POST['wavedirection'] . "'
				);";

	$result = mysql_query($sql, $conn);
	
	if (!$result) {
	    $err = array( "wnr" => 'Error: ' . mysql_error() );
	    echo json_encode($err);
	    exit;
	}
	
	$result = mysql_query("SHOW TABLE STATUS LIKE 'wegpunkte'");
	
	if (!$result) {
	    $err = array( "wnr" => 'Error: ' . mysql_error() );
	    echo json_encode($err);
	    exit;
	}
	
	$row = mysql_fetch_array($result);
	
	$nextId = $row['Auto_increment'];
	
	$wnr = array( "wnr" => "" . ($nextId-1) );
	
	echo json_encode($wnr);
	
	mysql_free_result($result);
	
	mysql_close($conn);

?>