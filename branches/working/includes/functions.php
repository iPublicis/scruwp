<?php
// error_reporting(0);

function connect(){
	$conn = mysql_connect( DB_HOST,DB_USER,DB_PASS );
	if( is_resource( $conn ) ){
		$db = mysql_select_db( DB_DATABASE,$conn );
		if( !is_resource( $db ) ){
			return printError();
		}
		return $conn;
	} else {
		return printError();
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

function implodeRecursive($glue = '',$array = array()){
	if( is_array($array) ){
		$buffer = '';
		foreach( $array as $arrayChild ){
			if( is_array( $arrayChild ) ){
				$buffer = implodeRecursive($glue,$arrayChild);
			} else {
				$buffer = $arrayChild;
			}
		}
		return $buffer;
	} else {
		return implode($glue,$array);
	}
}

function sanitize( $buf ){
	return strip_tags( addslashes(
		str_replace( "\n",' ',$buf )
	) );
}

function toMysql( $date = false ){
	if( !$date )
		return $date;

	return implode( "-",array_reverse( explode( "/",$date ) ) );
}

function fromMysql( $date = false ){
	if( !$date )
		return $date;

	return implode( "/",array_reverse( explode( "-",$date ) ) );
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

function query( $query ){
	if( !$query ){
		return array(
			'status' => false, 'code' => 1, 'message' => 'Invalid Parameters'
		);
	}

	$result = mysql_query( $query );

	if( $result ){
		$data = array();

		while( $buf = mysql_fetch_assoc( $result ) ){
			$id = isset( $buf['id'] ) ? $buf['id'] : $i++;
			$data[ $id ] = $buf;
		}

		return array(
			'status' => true, 'code' => mysql_errno(), 'count' => count( $data ), 'data' => $data
		);
	} else {
		return array(
			'status' => false, 'code' => mysql_errno(), 'message' => sanitize( mysql_error() ),
			'query' => $query, 'count' => 0, 'data' => array()
		);
	}
}

function insert( $table = false, $fields = false, $values = false ){
	if( !$table || !is_array( $fields ) || !is_array( $values ) ){
		return array(
			'status' => false, 'code' => 1, 'message' => 'Invalid Parameters'
		);
	}

	$sql = 'INSERT INTO '.
				$table.
					' ('. implode( ',',$fields ) .') '.
				' VALUES '.
					' ("'. implode( '","', array_map( sanitize, $values ) ) .'");';

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
			'status' => false, 'code' => 1, 'message' => 'Invalid Parameters'
		);
	}

	$sql =	' SELECT '.
				implode( ', ',$fields ) .
			' FROM '.
				$table.
			( is_array( $where ) && count( $where ) ?
				' WHERE '.implode( ' AND ',$where ) : '' ).';';

	$result = mysql_query( $sql );

	if( $result ){
		$data = array();

		while( $buf = mysql_fetch_assoc( $result ) ){
			$id = isset( $buf['id'] ) ? $buf['id'] : $i++;
			$data[ $id ] = array_map( sanitize,$buf );
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
			'status' => false, 'code' => 1, 'message' => 'Invalid Parameters'
		);
	}

	$sql = 'UPDATE '.$table.' SET ';

	foreach( $values as $field => $value ){
		$sql .= ( $i++ ? ',' : '' ).$field.' = "'. sanitize( $value ) .'"';
	}

	$sql .= ( $where && is_array( $where )
		? ' WHERE '. implode( ' AND ',$where ) : '' ).';';

	$query = mysql_query( $sql );

	return array(
		'status' => (bool)$query, 'code' => mysql_errno(),
		'message' => sanitize( mysql_error() ), 'query' => sanitize( $sql )
	);
}

function delete( $table = false, $where = false ){
	if( !$table || !is_array( $where ) ){
		return array(
			'status' => false, 'code' => 1, 'message' => 'Invalid Parameters'
		);
	}

	$sql = 'DELETE FROM '.$table.' WHERE '.implode( ' AND ',$where ).';';

	$query = mysql_query( $sql );

	return array(
		'status' => ( $query && mysql_affected_rows() > 0 ), 'code' => mysql_errno(),
		'message' => sanitize( mysql_error() ), 'query' => sanitize( $sql )
	);
}

function selectToJSON( $table = false, $fields = false, $where = false ){
	$return = select( $table, $fields, $where );

	if( $return['status'] ){
		return toJSON( $return );
	} else {
		return $return;
	}
}

function queryToJSON( $query ){
	$return = query( $query );

	if( $return['status'] ){
		return toJSON( $return );
	} else {
		return $return;
	}
}

function toJSON( $return ){
	$buf = '{ "count": '. $return['count'].', "data": [';
		$i = 0;
		foreach( $return['data'] as $row ){
			$buf .= ( $i++ ? ',' : '' ).'{';
			$j = 0;
			foreach( $row as $key => $value ){
				$buf .= ( $j++ ? ',' : '' ).'"'.$key.'"'.': "'. $value .'"';
			}
			$buf .= '}';
		}		
	$buf .= ']}';

	return $buf;
}

function mountSelect( $data = false, $name = false, $value = false ){
	if( !$data || !$name ){
		echo '';
		return false;
	}

	$buf  = '<select name="'. $name .'">';
	$buf .= '<option value="">Select...</option>';

	foreach( $data as $option ){
		$selected = $option['id'] == $value ? ' selected="selected"' : '';
		$buf .= '<option value="'. $option['id'] .'"'. $selected .'>'. $option['name'] .'</option>';
	}
	
	$buf .= '</select>';

	return $buf;
}
?>