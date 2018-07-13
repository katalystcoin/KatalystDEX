<?php 
session_start();

// to be replaced 
$host="localhost"; 
$username="root"; 
$password=""; 
$db_name="katalyst_test"; 
$tbl_name="email";

$tbl_header_01="email";
$tbl_header_02="wallet_add";

$con = mysqli_connect("$host", "$username", "$password", "$db_name")or die("cannot connect"); 
mysqli_select_db($con,"$db_name")or die("cannot select DB");

$ref = $_SESSION['referral'];

$email = 'not set';
if(isset($_POST['walletEmail'])) 
{ 
$email=$_POST['walletEmail'];
}

$sql="INSERT INTO $tbl_name($tbl_header_01, $tbl_header_02)VALUES('$email', '$ref')";
$result=mysqli_query($con, $sql);

mysqli_close($con);
?> 

<script type="text/javascript">
	location.href = 'https://katalyst.exchange/'; 
</script>  

