<?php
error_reporting( 0 );
$error_array = error_get_last();

require('function.php');

header('Content-type: text/json;');

switch( $_REQUEST['action'] ){
	case 'addHistory': addHistory(); break;
	default: blank();
}

function addHistory(){
	echo utf8_encode( '{ errro: 1, message: "addHistory..." }' );
}

function blank(){
	echo utf8_encode( '{ errro: 1, message: "Ação inválida" }' );
}

var_dump( $error_array );

if( $error_array != null ){
	var_dump( $error_array );
}
?>