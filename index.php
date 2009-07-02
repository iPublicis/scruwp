<?php include_once('includes/config.php'); ?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
    <head>
        <title>[ scruwp :: <?php echo PROG_NAME; ?> ]</title>
		<link rel="shortcut icon" href="favicon.ico">
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8;"/>
		<link rel="stylesheet" href="css/layout.css" type="text/css" media="all" />
		<link rel="stylesheet" href="css/jquery.ui-1.7.css" type="text/css" media="all" />
    </head>
    <body>
    	<div id="header">
    		<h1>Scruwp :: <?php echo PROG_NAME; ?></h1>
			<div id="options">
				<span class="button options ui-corner-all">Options</span>
				<div class="container ui-corner-tl ui-corner-bottom" style="display: none;">
					<ul>
						<li class="team">
							<nobr>
		    					<label for="teamSelect"><b>Team:</b></label>
		    					<select id="teamSelect">
		    						<optgroup label="Teams">
		    							<option value="">...</option>
									</optgroup>
								</select>
							</nobr>
							<ul>
								<li>
									<a href="javascript:void(0);" class="addTeam link">Add team</a>
								</li>
							</ul>
						</li>
						<li>&nbsp;</li>
						<li class="user">
							<nobr>
		    					<label for="userSelect"><b>User:</b></label>
		    					<select id="userSelect">
	    							<option value="">All users</option>
		    						<optgroup label="Users">
									</optgroup>
								</select>
							</nobr>
							<ul>
								<li>
									<a href="javascript:void(0);" class="addUser link">Add user</a>
								</li>
								<li class="edtUser">
									<a href="javascript:void(0);" class="edtUser link">Edit user</a>
								</li>
							</ul>
						</li>
						<li>&nbsp;</li>
						<li class="sprint">
							<nobr>
		    					<label for="sprintSelect"><b>Sprint:</b></label>
		    					<select id="sprintSelect">
		    						<optgroup label="Sprints">
		    							<option value="">...</option>
									</optgroup>
								</select>
							</nobr>
							<ul>
								<li>
									<a href="javascript:void(0);" class="addSprint link">Add sprint</a>
								</li>
								<li>
									<a href="javascript:void(0);" class="defaultSprint link">Make default</a>
								</li>
							</ul>
						</li>
						<li>&nbsp;</li>
						<li class="history">
							<nobr>
		    					<label for="sprintSelect"><b>History:</b></label>
							</nobr>
							<ul>
								<li>
									<a href="javascript:void(0);" class="addHistory link">Add history</a>
								</li>
							</ul>
						</li>
					</ul>
				</div>
			</div>
    	</div>
    	<table id="main" width="100%" cellspacing="0" cellpadding="0" border="0">
    		<thead>
    			<tr>
    				<th class="begin"></th>
    				<th colspan="2">
    					<div id="progressbar"></div>
    				</th>
					<th class="end"></th>
    			</tr>
    			<tr>
    				<th>
    					<span style="float: left;">history</span>
						<img src="images/history/history.png" id="colapseAll" alt="-" title="Colapse All history" />
					</th>
    				<th>
    					<span>todo</span>
					</th>
    				<th>
    					<span>wip</span>
					</th>
    				<th>
    					<span>done</span>
					</th>
    			</tr>
    		</thead>
			<tbody></tbody>
    	</table>
		<div id="message" style="display:none;">
			<img src="images/close.png" alt=" X " title="Close" class="pointer" />
			<span></span>
		</div>
    	<div id="loading" class="ui-corner-all" style="display:none;">
    		<img src="images/loading.gif" alt="" title="Loading..." />
			<span>Loading...</span>
    	</div>
		<div id="backGround" style="display:none;"></div>
		<div id="content" class="ui-corner-all" style="display:none;">
			<span class="header">&nbsp;</span>
			<a href="javascript:void(0);" class="close">CLOSE</a>
			<div class="main ui-corner-bottom">&nbsp;</div>
		</div>
    </body>
	<head>
        <script type="text/javascript" src="js/jquery-1.3.2.js"></script>
        <script type="text/javascript" src="js/jquery.ui-1.7.min.js"></script>
        <script type="text/javascript" src="js/jquery.cookie.js"></script>
        <script type="text/javascript" src="js/script.js"></script>
		<script type="text/javascript">
			$( Struts.init );
		</script>
	</head>
</html>