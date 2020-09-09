<?php

if (isset($_SERVER['HTTP_ORIGIN'])) {
    // Decide if the origin in $_SERVER['HTTP_ORIGIN'] is one
    // you want to allow, and if so:
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400');    // cache for 1 day
}

// Access-Control headers are received during OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {

    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
        // may also be using PUT, PATCH, HEAD etc
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS");         

    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
        header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");

    exit(0);
}

include "db.php";

$email = mysqli_real_escape_string($conn, $_POST["email"]);
$password = mysqli_real_escape_string($conn, $_POST["password"]);


$sql = "SELECT * FROM users WHERE email='$email'";
$result = mysqli_query($conn,$sql);
$count = mysqli_num_rows($result); //checks number of presences.

if($count > 0){
    $row = mysqli_fetch_assoc($result);
    $passwordFromDB = $row['password'];

    $key = "coronatracker123";

    $decrypted = openssl_decrypt($passwordFromDB,"AES256", $key);

    if($decrypted === $password){
        echo json_encode(array("status"=>200,"msg"=>"OK","result"=>$row));
    }else{
        echo json_encode(array("status"=>400,"msg"=>"BAD","result"=>""));
    }
}else {
    echo json_encode(array("status"=>404,"msg"=>"NOT FOUND","result"=>""));
}

?>