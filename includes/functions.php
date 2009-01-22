<?php
require('config.php');

function connect(){
	$conn = mysql_connect( DB_HOST,DB_USER,DB_PASS );
	if( is_resource( $conn) ){
		$db = mysql_select_db( DB_DATABASE,$conn );
		if( is_resource( $db ) ){
			echo 'connected :)';
		} else {
			return printError();
		}
	} else {
		printError();
	}
}

function printError( $return = false, $message = false ){
	if( !mysql_errno() || !mysql_error() )
		return false;

	$buf = '<script type="text/javascript">printError('.
		mysql_errno() .',"'. mysql_error() .'"'. (
			$message ? $message : ''
		).
	');</script>';

	if( $return ){
		return $buf;
	} else {
		echo $buf;
		return false;
	}
}

?>