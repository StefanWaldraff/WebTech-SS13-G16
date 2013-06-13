<?php

	include('_include/connection.php');
	
	if (!$db_selected) {
	    $err = array( "wnr" => 'Error: ' . mysql_error() );
	    echo json_encode($err);
	    exit;
	}
	
	$sql = "UPDATE seapal.wegpunkte SET " . $_POST['field'] . "=" . $_POST['value'] . " WHERE wnr=" . $_POST['wnr'] . ";";
	
	
	$result = mysql_query($sql, $conn);
	
	if (!$result) {
	    $err = array( "wnr" => 'Error: ' . mysql_error() );
	    echo json_encode($err);
	    exit;
	}
	
	mysql_close($conn);

?>