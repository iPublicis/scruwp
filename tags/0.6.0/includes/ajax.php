<?php
require_once('config.php');
require_once('functions.php');
header('Content-type: text/x-json;');

$conn = connect();

switch( $_REQUEST['action'] ){
	// TEAM
	case 'addTeam': addTeam(); break;
	case 'getTeam': getTeam(); break;
	// USER
	case 'addUser': addUser(); break;
	case 'getUser': getUser(); break;
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
	case 'getTask': getTask(); break;
	case 'addTask': addTask(); break;
	case 'edtTask': edtTask(); break;
	case 'deleteTask': deleteTask(); break;
	case 'getTaskByHistory': getTaskByHistory(); break;
	// STATUS
	case 'saveStatus': saveStatus(); break;
	// OTHER
	case 'getColorSet': getColorSet(); break;
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
	$return = selectToJSON(
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

// USER

function addUser(){
	$return = insert(
		'users', array( 'name','idColorSet' ),
		array( $_REQUEST['name'], $_REQUEST['idColorSet'] )
	);

	echo '{ code: ', $return['code'] ,', id: ', $return['id'] ,', message: "',(
		$return['code'] ? 'error' : 'Ok!'
	),'" }';
}

function getUser(){
	$return = selectToJSON(
		'users', array( '*' )
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

function addSprint(){
	//TODO: Adicionar transacao
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
	$return = selectToJSON(
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

function defaultSprint(){
	//TODO: Adicionar transacao
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
	$return = selectToJSON(
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
	$return = selectToJSON(
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
	$return = selectToJSON(
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
		'tasks',
		array( 'idHistory','idStatus','idUser','name','text','color' ),
		array(
			$_REQUEST['history'], $_REQUEST['status'],
			$_REQUEST['userAddTask'], $_REQUEST['name'],
			$_REQUEST['text'], $_REQUEST['color']
		)
	);

	echo '{ code: ', $return['code'] ,', id: ', $return['id'] ,', message: "',$return['message'],(
			$return['query'] ? '", query: "'.$return['query'] : ''
		),'" }';
}

function getTask(){
	$return = queryToJSON('
		SELECT
			t.id,
			t.idStatus,
			t.idHistory,
			t.idUser,
			t.text,
			u.name,
			c.background,
			c.border,
			c.color
		FROM
			tasks t
		INNER JOIN users u ON t.idUser = u.id
		INNER JOIN colors_set c ON u.idColorSet = c.id
		WHERE
			t.id = '. $_REQUEST['id'] .'
	');

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
	$return = queryToJSON('
		SELECT
			t.id,
			t.idStatus,
			t.idHistory,
			t.idUser,
			t.text,
			u.name,
			c.background,
			c.border,
			c.color
		FROM
			tasks t
		INNER JOIN users u ON t.idUser = u.id
		INNER JOIN colors_set c ON u.idColorSet = c.id
		WHERE
			t.idHistory = '. $_REQUEST['id'] .'
	');

	if( is_array( $return ) ){
		echo '{ count: 0, code: ', $return['code'], ', message: "',sanitize( $return['message'] ),(
			$return['query'] ? '", query: "'.$return['query'] : ''
		),'" }';
	} else {
		echo $return;
	}
}

function edtTask(){
	$return = update(
		'tasks', array(
			'idUser' => $_REQUEST['idUser'],
			'text' => $_REQUEST['text'],
		), array( 'id = '.$_REQUEST['id'] )
	);

	echo '{ code: ', $return['code'] ,', action: "', $_REQUEST['action'] ,'", id: ', $_REQUEST['id'] ,
		', message: "',$return['message'],( $return['query'] ? '", query: "'.$return['query'] : '' ),
	'" }';
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

function getColorSet(){
	$return = selectToJSON(
		'colors_set', array( '*' )
	);

	if( is_array( $return ) ){
		echo '{ code: ', $return['code'], ', message: "',sanitize( $return['message'] ),(
			$return['query'] ? '", query: "'.$return['query'] : ''
		),'" }';
	} else {
		echo $return;
	}
}

function blank(){
	die( '{ code: 1, message: "Invalid action" }' );
}
?>
