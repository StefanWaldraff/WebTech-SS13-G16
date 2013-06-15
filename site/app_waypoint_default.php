<?php

	include('_include/connection.php');
	
	if (!$db_selected) {
	    $err = array( "wnr" => 'Error: ' . mysql_error() );
	    echo json_encode($err);
	    exit;
	}

	$sql = "UPDATE seapal.wegpunkte SET wcc=NULL WHERE wnr=" . $_POST['wnr'] . ";";
	@file_put_contents('_include/log.txt', $sql);
	$result = mysql_query($sql, $conn);
	$sql = "UPDATE seapal.wegpunkte SET icon=NULL WHERE wnr=" . $_POST['wnr'] . ";";
	$result = mysql_query($sql, $conn);
	$sql = "UPDATE seapal.wegpunkte SET temp=NULL  WHERE wnr=" . $_POST['wnr'] . ";";
	$result = mysql_query($sql, $conn);
	$sql = "UPDATE seapal.wegpunkte SET airpressure=NULL WHERE wnr=" . $_POST['wnr'] . ";";
	$result = mysql_query($sql, $conn);
	$sql = "UPDATE seapal.wegpunkte SET windspeed=NULL WHERE wnr=" . $_POST['wnr'] . ";";
	$result = mysql_query($sql, $conn);
	$sql = "UPDATE seapal.wegpunkte SET winddirection=NULL WHERE wnr=" . $_POST['wnr'] . ";";
	$result = mysql_query($sql, $conn);
	$sql = "UPDATE seapal.wegpunkte SET precipation=NULL WHERE wnr=" . $_POST['wnr'] . ";";
	$result = mysql_query($sql, $conn);
	$sql = "UPDATE seapal.wegpunkte SET clouds=NULL WHERE wnr=" . $_POST['wnr'] . ";";
	$result = mysql_query($sql, $conn);
	$sql = "UPDATE seapal.wegpunkte SET wavehight=NULL WHERE wnr=" . $_POST['wnr'] . ";";
	$result = mysql_query($sql, $conn);
	$sql = "UPDATE seapal.wegpunkte SET wavedirection=NULL WHERE wnr=" . $_POST['wnr'] . ";";
	$result = mysql_query($sql, $conn);
	
	if (!$result) {
	    $err = array( "wnr" => 'Error: ' . mysql_error() );
	    echo json_encode($err);
	    exit;
	}
	
	mysql_close($conn);

?>