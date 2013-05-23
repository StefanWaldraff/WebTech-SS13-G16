<?php

$filename  = dirname(__FILE__).'/data.txt';

// store new message in the file
$lat = isset($_GET['lat']) ? $_GET['lat'] : '';
$lon = isset($_GET['lon']) ? $_GET['lon'] : '';
if ($lat != '' && $lon != '')
{
	$coord = array();
	$coord['lat'] = $lat;
	$coord['lon'] = $lon;
	file_put_contents($filename, serialize($coord));
    die();
}

// infinite loop until the data file is modified
$lastmodif    = isset($_GET['timestamp']) ? $_GET['timestamp'] : 0;
$currentmodif = filemtime($filename);
while ($currentmodif <= $lastmodif) // check if the data file has been modified
{
  usleep(100000); // sleep 100ms to unload the CPU
  clearstatcache();
  $currentmodif = filemtime($filename);
}

// return a json array
$arrayCoord = unserialize(file_get_contents($filename));
$response = array();
$response['lat']       = $arrayCoord['lat'];
$response['lon']       = $arrayCoord['lon'];
$response['timestamp'] = $currentmodif;
echo json_encode($response);
flush();

/* filename: backend.php */
?>