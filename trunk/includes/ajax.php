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
	case 'edtUser': edtUser(); break;
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
		'users', array( '*' ), false, array('name')
	);

	if( is_array( $return ) ){
		echo '{ code: ', $return['code'], ', message: "',sanitize( $return['message'] ),(
			$return['query'] ? '", query: "'.$return['query'] : ''
		),'" }';
	} else {
		echo $return;
	}
}

function edtUser(){
	$return = update(
		'users', array(
			'idColorSet' => $_REQUEST['idColorSet'],
			'name' => $_REQUEST['name'],
		), array( 'id = '.$_REQUEST['id'] )
	);

	echo '{ code: ', $return['code'] ,', action: "', $_REQUEST['action'] ,'", id: ', $_REQUEST['id'] ,
		', message: "',$return['message'],( $return['query'] ? '", query: "'.$return['query'] : '' ),
	'" }';
}

// SPRINT

function addSprint(){
	// DEFAULT STATUS
	$update['status'] = false;
	$return['status'] = false;

	// START THE SQL TRANSACTION
	if( startTransaction() ){
		// CHECK IF HAS THE DEFAULT FLAG
		if( $_REQUEST['status'] ){
			// CLEAR THE ACTIVE FLAG
			$update = update( 'sprints',
				array( 'status' => 0 ), array( 'idTeam = '.$_REQUEST['idTeam'] )
			);
		} else {
			$update['status'] = true;
		}

		// IF THE FIRST UPDATE IS OK
		if( $update['status'] ){
			// CALC THE WEEKS IN SECONDS
			$endDate = date( 'Y-m-d',(
				strtotime( toMysql($_REQUEST['beginDate']) ) + ( 604800 * $_REQUEST['duration'] )
			) );

			// INSERT THE SPRINT
			$return = insert(
				'sprints', array( 'idTeam','status','beginDate','endDate' ),
				array( $_REQUEST['idTeam'],$_REQUEST['status'],toMysql($_REQUEST['beginDate']),$endDate )
			);
		}
	}

	// CHECK THE STATUS OS THE QUERIES
	if( $update['status'] && $return['status'] ){
		// SAVE THE CHANGES
		commitTransaction();
	} else {
		// DONT SAVE IT :P 
		rollbackTransaction();
		// DEFAULT ERROR STATUS
		$return = array( 'code' => 1, 'id' => 0 );
	}

	// ECHO THE JSON RESPONSE
	echo '{ code: ', $return['code'] ,', id: ', $return['id'] ,', message: "',(
		$return['code'] ? 'Error' : 'Ok!'
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
	// DEFAULT STATUS
	$update['status'] = false;

	// START THE SQL TRANSACTION
	if( startTransaction() ){
		// RESET THE DEFAULT STATUS
		$update = update(
			'sprints', array( 'status' => 0 ), array( 'idTeam = '. $_REQUEST['idTeam'] )
		);

		// IF THE UPDATE IS OK
		if( $update['status'] ){
			// CHANGE THE STATUS
			$return = update(
				'sprints', array( 'status' => 1 ), array( 'id = '.$_REQUEST['id'] )
			);
		}
	}

	// CHECK THE STATUS OS THE QUERIES
	if( $update['status'] && $return['status'] ){
		// SAVE THE CHANGES
		commitTransaction();
	} else {
		// DONT SAVE IT :P 
		rollbackTransaction();
		// DEFAULT ERROR STATUS
		$return = array( 'code' => 1, 'id' => 0 );
	}

	// ECHO THE JSON RESPONSE
	echo '{ code: ', $return['code'] ,', message: "',(
		$return['code']
			? 'Has been a error while trying to make this the default sprint'
			: 'The sprint #'. $_REQUEST['id'] .' is now the default!'
	),'" }';
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
		$tasks = select(
			'tasks', array('*'), array( 'idHistory = '.$_REQUEST['id'] )
		);
		
		$isTasksDeleted = true;

		foreach( $tasks['data'] as $task ){
			$deleted = deleteTask( $task );

			if( !$deleted['status'] ){
				$isTasksDeleted = false;
				break;
			}
		}

		if( $isTasksDeleted ){
			$history = delete(
				'histories', array( 'id = '.$_REQUEST['id'] )
			);

			if( is_array( $history ) && $history['status'] ){
				if( commitTransaction() ){
					echo '{ code: 0, message: "Yeah, history deleted with success!" }';
					return true;
				}
			}
		}
	}

	echo '{ code: 1, message: "Ops! The history wasn\'t removed." }';
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
	if( startTransaction() ){
		$return = insert(
			'tasks',
			array( 'idHistory','idStatus','idUser','text' ),
			array(
				$_REQUEST['history'], $_REQUEST['status'],
				$_REQUEST['userAddTask'], $_REQUEST['text']
			)
		);

		if( $return['status'] )
			$log = insert(
				'tasks_log', array( 'idTask','oldStatus','newStatus' ),
				array( $return['id'], 0, 1 )
			);
	}

	if( $return['status'] && $log['status'] ){
		commitTransaction();
	} else {
		rollbackTransaction();
	}

	echo '{ code: ', $return['code'] ,', id: ', $return['id'] ,', message: "',(
		$return['code'] ? '' : ''
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

function deleteTask($option = false){
	$task = $option ? $option : $_REQUEST;

	if( startTransaction() ){
		$return = insert(
			'tasks_log', array( 'idTask','oldStatus','newStatus' ),
			array( $task['id'], $task['status'], 0 )
		);

		if( $return['status'] )
			$return = delete( 'tasks', array( 'id = '.$task['id'] ) );
	}

	if( $return['status'] ){
		commitTransaction();
	} else {
		rollbackTransaction();
	}

	if( $option ){
		return $return;
	} else {
		echo '{ code: ', $return['code'] ,', message: "',$return['message'],'" }';
	}
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
	if( startTransaction() ){
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
	}

	if( $return['status'] ){
		commitTransaction();
	} else {
		rollbackTransaction();
	}

	echo '{ code: ', $return['code'] ,', message: "',(
		$return['code'] ? 'Has been a error while trying to save the task; Ops!' : '' 
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
