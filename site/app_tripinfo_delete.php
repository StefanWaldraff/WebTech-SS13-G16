<?php

	include('_include/connection.php');
	
	if (!$db_selected) {
	    $err = array( "wnr" => 'Error: ' . mysql_error() );
	    echo json_encode($err);
	    exit;
	}
	
	$sql = "DELETE FROM seapal.wegpunkte WHERE wnr = " . $_POST['wnr'] . ";";
	
	$result = mysql_query($sql, $conn);
	
	if (!$result) {
	    $err = array( "wnr" => 'Error: ' . mysql_error() );
	    echo json_encode($err);
	    exit;
	}
		
	$bnr = array( "wnr" => 'ok');
	
	echo json_encode($bnr);
		
	mysql_close($conn);

?>