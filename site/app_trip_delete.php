<?php

	include('_include/connection.php');
	
	if (!$db_selected) {
	    $err = array( "tnr" => 'Error: ' . mysql_error() );
	    echo json_encode($err);
	    exit;
	}
	
	$sql = "DELETE FROM seapal.tripinfo WHERE tnr = " . $_POST['tnr'] . ";";
	
	$result = mysql_query($sql, $conn);
	
	if (!$result) {
	    $err = array( "tnr" => 'Error: ' . mysql_error() );
	    echo json_encode($err);
	    exit;
	}
		
	$bnr = array( "tnr" => 'ok');
	
	echo json_encode($bnr);
		
	mysql_close($conn);

?>