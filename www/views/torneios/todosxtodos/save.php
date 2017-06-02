 <?php
echo '<img src="'.$_POST['img_val'].'" />';
 
//Get the base-64 string from data
$filteredData=substr(isset($_POST['img_val']), strpos(isset($_POST['img_val']), ",")+1);
 
//Decode the string
$unencodedData=base64_decode($filteredData);
 
//Save the image
file_put_contents('img.png', $unencodedData);
?>