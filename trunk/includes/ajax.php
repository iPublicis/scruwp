<?php
error_reporting( 0 );
require('functions.php');
header('Content-type: text/json;');

$conn = connect();

switch( $_REQUEST['action'] ){
	// TEAM
	case 'addTeam': addTeam(); break;
	case 'getTeam': getTeam(); break;
	// SPRINT
	case 'addSprint': addSprint(); break;
	case 'getSprint': getSprint(); break;
	case 'defaultSprint': defaultSprint(); break;
	case 'getSprintByTeam': getSprintByTeam(); break;
	// HISTORY
	case 'addHistory': addHistory(); break;
	case 'getHistory': getHistory(); break;
	case 'deleteHistory': deleteHistory(); break;
	case 'getHistoryBySprint': getHistoryBySprint(); break;
	// TASK
	case 'addTask': addTask(); break;
	case 'getTask': getTask(); break;
	case 'deleteTask': deleteTask(); break;
	case 'getTaskByHistory': getTaskByHistory(); break;
	// STATUS
	case 'saveStatus': saveStatus(); break;
	// DEFAULT
	default: blank();
}

// TEAM

function addTeam(){
	$return = insert(
		'teams', array( 'name' ),
		array( $_REQUEST['name'] )
	);

	echo '{ code: ', $return['code'] ,', id: ', $return['id'] ,', message: "',(
		$return['code'] ? 'error' : 'Ok!'
	),'" }';
}

function getTeam(){
	$return = getJSON(
		'teams', array( '*' )
	);

	if( is_array( $return ) ){
		echo '{ code: ', $return['code'], ', message: "',sanitize( $return['message'] ),(
			$return['query'] ? '", query: "'.$return['query'] : ''
		),'" }';
	} else {
		echo $return;
	}
}

// SPRINT

//TODO: Adicionar transacao
function addSprint(){
	$update['status'] = true;

	if( $_REQUEST['status'] )
		$update = update( 'sprints',
			array( 'status' => 0 ), array( 'idTeam = '.$_REQUEST['idTeam'] )
		);

	if( $update['status'] ){
		$endDate = date( 'Y-m-d',(
			strtotime( toMysql($_REQUEST['beginDate']) ) + ( 604800 * $_REQUEST['duration'] )
		) );

		$return = insert(
			'sprints', array( 'idTeam','status','beginDate','endDate' ),
			array( $_REQUEST['idTeam'],$_REQUEST['status'],toMysql($_REQUEST['beginDate']),$endDate )
		);
	} else {
		$return = array(
			'id' => 0,
			'code' => 1
		);
	}

	echo '{ code: ', $return['code'] ,', id: ', $return['id'] ,', message: "',(
		$return['code'] ? 'error' : 'Ok!'
	),'" }';
}

function getSprint(){
	$return = getJSON(
		'sprints', array( '*' ), array( 'id = '.$_REQUEST['id'] )
	);

	if( is_array( $return ) ){
		echo '{ code: ', $return['code'], ', message: "',sanitize( $return['message'] ),(
			$return['query'] ? '", query: "'.$return['query'] : ''
		),'" }';
	} else {
		echo $return;
	}
}

//TODO: Adicionar transacao
function defaultSprint(){
	$update['status'] = false;
	$update = update( 'sprints',array( 'status' => 0 ) );

	if( $update['status'] ){
		$return = update(
			'sprints',array( 'status' => 1 ),array( 'id = '.$_REQUEST['id'] )
		);
	} else {
		$return = array(
			'code' => 1,
			'message' => 'error'
		);
	}

	echo '{ code: ', $return['code'] ,', message: "',( $return['code'] ? 'error' : 'Ok!' ),'" }';
}

function getSprintByTeam(){
	$return = getJSON(
		'sprints', array( '*' ), array( 'idTeam = '.$_REQUEST['id'] )
	);

	if( is_array( $return ) ){
		echo '{ code: ', $return['code'], ', message: "',sanitize( $return['message'] ),(
			$return['query'] ? '", query: "'.$return['query'] : ''
		),'" }';
	} else {
		echo $return;
	}
}

// HISTORY

function addHistory(){
	$return = insert(
		'histories', array( 'name','text','estimate','idSprint' ),
		array( $_REQUEST['name'],$_REQUEST['text'],$_REQUEST['estimate'],$_REQUEST['idSprint'] )
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

function deleteHistory(){
	if( startTransaction() ){
		$tasks = delete(
			'tasks', array( 'idHistory = '.$_REQUEST['id'] )
		);

		if( is_array( $tasks ) && $tasks['status'] ){
			$history = delete(
				'histories', array( 'id = '.$_REQUEST['id'] )
			);

			if( is_array( $history ) && $history['status'] ){
				echo '{ code: 0, message: "Ok!" }';
				return commitTransaction();
			}
		}
	}

	echo '{ code: 1, message: "Error!" }';
	return rollbackTransaction();
}

function getHistoryBySprint(){
	$return = getJSON(
		'histories', array( '*' ), array( 'idSprint = '.$_REQUEST['id'] )
	);

	if( is_array( $return ) ){
		echo '{ count: 0, code: ', $return['code'], ', message: "',sanitize( $return['message'] ),(
			$return['query'] ? '", query: "'.$return['query'] : ''
		),'" }';
	} else {
		echo $return;
	}
}

// TASKS

function addTask(){
	$return = insert(
		'tasks', array( 'idHistory','idStatus','name','text','color' ),
		array( $_REQUEST['history'],$_REQUEST['status'],$_REQUEST['name'],$_REQUEST['text'],$_REQUEST['color'] )
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

function deleteTask(){
	$return = delete(
		'tasks', array( 'id = '.$_REQUEST['id'] )
	);

	echo '{ code: ', $return['code'] ,', message: "',$return['message'],(
			$return['query'] ? '", query: "'.$return['query'] : ''
		),'" }';
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
	$return = insert(
		'tasks_log', array( 'idTask','oldStatus','newStatus' ),
		array( $_REQUEST['id'],$_REQUEST['oldStatus'],$_REQUEST['status'] )
	);

	if( $return['status'] ){
		$return = update(
			'tasks', array(
				'idStatus' => $_REQUEST['status'],
			), array( 'id = '.$_REQUEST['id'] )
		);
	}

	echo '{ code: ', $return['code'] ,', message: "',$return['message'],(
		$return['query'] ? '", query: "'.$return['query'] : ''
	),'" }';
}

// OTHER

function blank(){
	die( '{ code: 1, message: "Invalid action" }' );
}
?>