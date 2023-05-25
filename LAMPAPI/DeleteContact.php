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
		/*
		$sql = "DELETE FROM Contacts WHERE Name = $name";
		if (mysqli_query($conn, $sql)) {
    			echo "Contact deleted!";
		}
		*/
		$stmt = $conn->prepare("DELETE FROM Contacts WHERE Name=? AND Phone=? AND Email=? AND UserID=?"); // prepare command to insert into contacts table
		$stmt->bind_param("ssss", $name, $phone, $email, $userId);
		$stmt->execute();
		$stmt->close();
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