<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
    <head>
        <title>[ scruwp :: Scrum With PHP ]</title>
		<link rel="shortcut icon" href="favicon.ico">
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8;"/>
		<link rel="stylesheet" href="css/layout.css" type="text/css" media="all" />
    </head>
    <body>
    	<div id="header">
    		<h1>Scruwp :: Scrum With PHP</h1>
    	</div>
    	<table id="main" width="100%" cellspacing="0" cellpadding="0" border="0">
    		<thead>
    			<tr>
    				<th></th>
    				<th colspan="2"></th>
    				<th class="options">
    					<span class="button">Opções</span>
						<div class="container" style="display: none;">
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
											<a href="javascript:void(0);" class="addTeam link">Adicionar</a>
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
											<a href="javascript:void(0);" class="addSprint link">Adicionar</a>
										</li>
										<li>
											<a href="javascript:void(0);" class="defaultSprint link">Marcar atual</a>
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
											<a href="javascript:void(0);" class="addHistory link">Adicionar</a>
										</li>
									</ul>
								</li>
							</ul>
						</div>
    				</th>
    			</tr>
    			<tr>
    				<th>
    					<span>history</span>
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
    				<td></td>
    				<td colspan="2">&nbsp;</td>
    				<td align="right"></td>
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
        <script type="text/javascript" src="js/jquery.1.3.min.js"></script>
        <script type="text/javascript" src="js/jquery.ui.all.min.js"></script>
        <script type="text/javascript" src="js/script.js?<?= rand() ?>"></script>
		<script type="text/javascript">
			$(function(){
				$('#main > tbody > tr:odd > td').css('background-color','#F9F9F9');
				Struts.init();
			});
		</script>
	</head>
</html>