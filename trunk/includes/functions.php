<?php
error_reporting(0);
require('config.php');

function connect(){
	$conn = mysql_connect( DB_HOST,DB_USER,DB_PASS );
	if( is_resource( $conn ) ){
		$db = mysql_select_db( DB_DATABASE,$conn );
		if( !is_resource( $db ) ){
			return printError();
		}
		return $conn;
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

function sanitize( $buf ){
	return str_replace( '"',"'", str_replace( "\n",'',$buf ) );
}

function toMysql( $date = false ){
	if( !$date )
		return $date;

	return implode( "-",array_reverse( explode( "/",$date ) ) );
}

function startTransaction(){
	return (bool) mysql_query( 'START TRANSACTION;' );
}

function rollbackTransaction(){
	return (bool) mysql_query( 'ROLLBACK;' );
}

function commitTransaction(){
	return (bool) mysql_query( 'COMMIT;' );
}

function insert( $table = false, $fields = false, $values = false ){
	if( !$table || !is_array( $fields ) || !is_array( $values ) ){
		return array(
			'status' => false, 'code' => 1, 'message' => 'Parâmetros inválidos'
		);
	}

	$sql = 'INSERT INTO '.
				$table.
					' ('. implode( ',',$fields ) .') '.
				' VALUES '.
					' ("'. implode( '","',$values ) .'");';

	$query = mysql_query( $sql );

	if( $query && mysql_affected_rows() > 0 ){
		return array(
			'status' => true, 'code' => mysql_errno(), 'id' => mysql_insert_id(),
			'message' => sanitize( mysql_error() ), 'query' => sanitize( $sql )
		);
	} else {
		return array(
			'status' => false, 'code' => mysql_errno(), 'id' => 0,
			'message' => sanitize( mysql_error() ), 'query' => $sql
		);
	}
}

function select( $table = false, $fields = false, $where = false ){
	if( !$table || !is_array( $fields ) ){
		return array(
			'status' => false, 'code' => 1, 'message' => 'Parâmetros inválidos'
		);
	}

	$sql = ' SELECT '.
				implode( ', ',$fields ) .
			' FROM '.
				$table.
			( is_array( $where ) && count( $where ) ?
				' WHERE '.implode( ' AND ',$where ) : '' ).';';

	$result = mysql_query( $sql );

	if( $result ){
		$data = array();

		while( $buf = mysql_fetch_assoc( $result ) ){
			$data[] = $buf;
		}

		return array(
			'status' => true, 'code' => mysql_errno(), 'count' => count( $data ), 'data' => $data
		);
	} else {
		return array(
			'status' => false, 'code' => mysql_errno(), 'message' => sanitize( mysql_error() ),
			'query' => $sql, 'count' => 0, 'data' => array()
		);
	}
}

function update( $table = false, $values = false, $where = false ){
	if( !$table || !is_array( $values ) ){
		return array(
			'status' => false, 'code' => 1, 'message' => 'Parâmetros inválidos'
		);
	}

	$sql = 'UPDATE '.$table.' SET ';

	foreach( $values as $field => $value ){
		$sql .= ( $i++ ? ',' : '' ).$field.' = "'. $value .'"';
	}
	
	$sql .= ( $where && is_array( $where )
		? ' WHERE '. implode( ' AND ',$where ) : '' ).';';

	$query = mysql_query( $sql );

	return array(
		'status' => ( $query && mysql_affected_rows() > 0 ), 'code' => mysql_errno(),
		'message' => sanitize( mysql_error() ), 'query' => sanitize( $sql )
	);
}

function delete( $table = false, $where = false ){
	if( !$table || !is_array( $where ) ){
		return array(
			'status' => false, 'code' => 1, 'message' => 'Parâmetros inválidos'
		);
	}

	$sql = 'DELETE FROM '.$table.' WHERE '.implode( ' AND ',$where ).';';

	$query = mysql_query( $sql );

	return array(
		'status' => ( $query && mysql_affected_rows() > 0 ), 'code' => mysql_errno(),
		'message' => sanitize( mysql_error() ), 'query' => sanitize( $sql )
	);
}

function getJSON( $table = false, $fields = false, $where = false ){
	$return = select( $table, $fields, $where );

	if( $return['status'] ){
		$buf = '{ count: '. $return['count'].', data: [';
			$i = 0;
			foreach( $return['data'] as $row ){
				$buf .= ( $i++ ? ',' : '' ).'{';
				$j = 0;
				foreach( $row as $key => $value ){
					$buf .= ( $j++ ? ',' : '' ).$key.': "'. sanitize( $value ) .'"';
				}
				$buf .= '}';
			}
		$buf .= ']}';

		return $buf;
	} else {
		return $return;
	}
}
?>