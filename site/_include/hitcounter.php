<?php
	$hit_count = @file_get_contents('_include/count.txt');
	echo "<div > 
			<h4>Hitcounter</h4> 
			<p>" .$hit_count."</p> 
		</div>";
	$hit_count++;
	@file_put_contents('_include/count.txt', $hit_count);
?>

<!--class='span2' style='background-color:deepskyblue;-->