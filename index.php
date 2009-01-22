<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8;"/>
        <title>[ scruwp :: Scrum With PHP ]</title>
        <script type="text/javascript" src="js/jquery.js"></script>
        <script type="text/javascript" src="js/jquery-ui.js"></script>
        <script type="text/javascript" src="js/script.js"></script>
		<link type="text/css" media="all" rel="stylesheet" href="css/layout.css" />
    </head>
    <body>
    	<div id="header">
			<div class="center">
	    		<h1>Scrum With PHP</h1>
			</div>
    	</div>
    	<table id="main" width="100%" cellspacing="1" cellpadding="1" border="0">
    		<thead>
    			<tr>
    				<th>História</th>
    				<th>TODO</th>
    				<th>WIP</th>
    				<th>DONE</th>
    			</tr>
    		</thead>
			<tbody>
			</tbody>
			<tfoot>
				<tr>
					<td>
						<a href="javascript:void(0);" onclick="addHistory();" class="left">
							<img src="images/add.gif" alt="Adicionar" title="Adicionar história" />
						</a>
					</td>
					<td colspan="3">&nbsp;</td>
				</tr>
			</tfoot>
    	</table>
		<div id="backGround" style="display:none;"></div>
		<div id="content" style="display:none;">
			<span class="header">a</span>
			<a href="javascript:void(0);" class="close">FECHAR</a>
			<div class="main"></div>
		</div>
    </body>
</html>
<?php
	require('includes/functions.php');
	connect();
?>