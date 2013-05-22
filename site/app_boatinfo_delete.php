<?php

	include('_include/connection.php');
	
	if (!$db_selected) {
	    $err = array( "bnr" => 'Error: ' . mysql_error() );
	    echo json_encode($err);
	    exit;
	}
	
	$sql = "DELETE FROM seapal.bootinfo WHERE bnr = " . $_POST['bnr'] . ";";
	
	$result = mysql_query($sql, $conn);
	
	if (!$result) {
	    $err = array( "bnr" => 'Error: ' . mysql_error() );
	    echo json_encode($err);
	    exit;
	}
	
	$bnr = array( "bnr" => 'ok');
	
	echo json_encode($bnr);
	
	mysql_close($conn);

?>
                       
