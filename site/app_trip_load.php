<?php
	
	include('_include/connection.php');
	
	if (!$db_selected) {
	    die('Error: ' . mysql_error());
	}
	
	$sql = "SELECT * FROM seapal.tripinfo WHERE tnr = '" . $_GET['tnr'] . "';";
	
	$result = mysql_query($sql, $conn);
	
	if (!$result) {
	    die('Error: ' . mysql_error());
	}
	
	$row = mysql_fetch_array($result);
	
	echo json_encode($row);
	
	mysql_free_result($result);
		
	mysql_close($conn);
	
?>