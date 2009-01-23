<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8;"/>
        <title>[ scruwp :: Scrum With PHP ]</title>
        <script type="text/javascript" src="js/jquery.js"></script>
        <script type="text/javascript" src="js/jquery-ui.js"></script>
        <script type="text/javascript" src="js/script.js?<?= rand() ?>"></script>
		<link type="text/css" media="all" rel="stylesheet" href="css/layout.css?<?= rand() ?>" />
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
						<a href="javascript:void(0);" onclick="Add.history();">
							<img src="images/add.gif" alt="Add" title="Add history" />
						</a>
					</th>
    				<th><span>todo</span></th>
    				<th><span>wip</span></th>
    				<th><span>done</span></th>
    			</tr>
    		</thead>
			<tbody></tbody>
			<tfoot>
				<tr>
					<td></td>
					<td colspan="3"></td>
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
		<script type="text/javascript">
			jQuery(function(){
				Modal.initialize();
				Struts.init();
				$.ajaxSetup({
					beforeSend: function(){
						$('#loading').show();
					},
					complete: function(){
						$('#loading').hide();
					}
				});
				Show.container = $('#main > tfoot > tr > td:last');
			});
		</script>
	</head>
</html>
