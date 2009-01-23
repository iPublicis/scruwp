<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
    <head>
        <title>[ scruwp :: Scrum With PHP ]</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8;"/>
		<link rel="shortcut icon" href="favicon.ico">
		<link rel="stylesheet" href="css/layout.css" type="text/css" media="all" />
    </head>
    <body>
    	<div id="header">
    		<h1>Scuwp :: Scrum With PHP</h1>
    	</div>
    	<table id="main" width="100%" cellspacing="0" cellpadding="0" border="0">
    		<thead>
    			<tr>
    				<th>
    					<span>history</span>
						<a href="javascript:void(0);" class="addHistory" onclick="Add.history();">
							<img src="images/history/new.gif" alt="Add" title="Add history" />
						</a>
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
			<tfoot>
    			<tr>
    				<td>
    					<b>Inicio:</b>&nbsp;<span></span>
						&nbsp;
						<b>Fim:</b>&nbsp;<span></span>
    				</td>
    				<td colspan="2">&nbsp;</td>
    				<td align="right">
    					<label for="sprintSelect"><b>Sprint:</b></label>
    					<select id="sprintSelect">
    						<optgroup label="Sprints">
    							<option value="">...</option>
							</optgroup>
						</select>
    					<img src="images/sprint/settings.gif" class="actSprint" alt="+" title="Sprint actions" />
						<div class="sprintOpt" style="display: none;">
	    					<img src="images/sprint/add.gif" class="sprint addSprint" alt="+" title="Add sprint" />
	    					<img src="images/sprint/sprint.gif" class="sprint defaultSprint" alt="*" title="Sprint default" />
						</div>
    				</td>
    			</tr>
			</tfoot>
    	</table>
    	<div id="loading" style="display:none;">
    		<img src="images/loading.gif" alt="" title="Carregando..." />
    	</div>
		<div id="backGround" style="display:none;"></div>
		<div id="content" style="display:none;">
			<span class="header">&nbsp;</span>
			<a href="javascript:void(0);" class="close">CLOSE</a>
			<div class="main">&nbsp;</div>
		</div>
    </body>
	<head>
        <script type="text/javascript" src="js/jquery.js"></script>
        <script type="text/javascript" src="js/jquery-ui.js"></script>
        <script type="text/javascript" src="js/script.js?<?= rand() ?>"></script>
		<script type="text/javascript">
			jQuery(function(){
				$('#main > tbody > tr:odd > td').css('background-color','#F9F9F9');
				$('#main > tfoot > tr > td:last > img.addSprint').click( Add.sprint );
				Struts.init();
			});
		</script>
	</head>
</html>























