<?php
error_reporting( 0 );
require('functions.php');
header('Content-type: text/json;');

$conn = connect();

switch( $_REQUEST['action'] ){
	// HISTORY
	case 'addHistory': addHistory(); break;
	case 'getHistory': getHistory(); break;
	// TASK
	case 'addTask': addTask(); break;
	case 'getTask': getTask(); break;
	case 'getTaskByHistory': getTaskByHistory(); break;
	case 'saveStatus': saveStatus(); break;
	default: blank();
}
//	print_r( $_REQUEST );

// HISTORY

function addHistory(){
	$return = insert(
		'histories', array( 'name','text' ), array( $_REQUEST['name'],$_REQUEST['text'] )
	);

	echo '{ code: ', $return['code'] ,', id: ', $return['id'] ,', message: "',(
		$return['code'] ? 'error' : 'Ok!'
	),'" }';
}

function getHistory(){
	$return = getJSON(
		'histories', array( '*' ), (
			$_REQUEST['id'] != 'undefined' ? array( ' id = '.$_REQUEST['id'].' ' ) : ''
		)
	);

	if( is_array( $return ) ){
		echo '{ code: ', $return['code'], ', message: "',sanitize( $return['message'] ),(
			$return['query'] ? '", query: "'.$return['query'] : ''
		),'" }';
	} else {
		echo $return;
	}
}

// TASKS

function addTask(){
	$return = insert(
		'tasks', array( 'idHistory','idStatus','name','text' ),
		array( $_REQUEST['history'],$_REQUEST['status'],$_REQUEST['name'],$_REQUEST['text'] )
	);

	echo '{ code: ', $return['code'] ,', id: ', $return['id'] ,', message: "',$return['message'],(
			$return['query'] ? '", query: "'.$return['query'] : ''
		),'" }';
}

function getTask(){
	$return = getJSON(
		'tasks', array( '*' ), array( 'id = '.$_REQUEST['id'] )
	);

	if( is_array( $return ) ){
		echo '{ code: ', $return['code'], ', message: "',sanitize( $return['message'] ),(
			$return['query'] ? '", query: "'.$return['query'] : ''
		),'" }';
	} else {
		echo $return;
	}
}

function getTaskByHistory(){
	$return = getJSON(
		'tasks', array( '*' ), array( 'idHistory = '.$_REQUEST['id'] )
	);

	if( is_array( $return ) ){
		echo '{ count: 0, code: ', $return['code'], ', message: "',sanitize( $return['message'] ),(
			$return['query'] ? '", query: "'.$return['query'] : ''
		),'" }';
	} else {
		echo $return;
	}
}

function saveStatus(){
	$return = update(
		'tasks', array(
			'idStatus' => $_REQUEST['status'],
		), array( 'id = '.$_REQUEST['id'] )
	);

	echo '{ code: ', $return['code'] ,', message: "',$return['message'],(
		$return['query'] ? '", query: "'.$return['query'] : ''
	),'" }';
}

// OTHER

function blank(){
	die( '{ code: 1, message: "Invalid action" }' );
}
?>