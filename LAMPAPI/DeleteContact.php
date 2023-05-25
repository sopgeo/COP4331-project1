<?php
	$inData = getRequestInfo();
	

	$name = $inData["name"];
	$userId = $inData["userId"];
	$phone = $inData["phone"];
	$email = $inData["email"];

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{

		$sql = "DELETE FROM Contacts WHERE Name = $name";
		if (mysqli_query($conn, $sql)) {
    			echo "Contact deleted!";
		}

		$conn->close();
		returnWithError("");
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
?>