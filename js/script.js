var Struts = {
	newTask: {},
	init: function(){
		Get.history();
	},
	history: {
		mount: function( dados ){
			$.each(dados,function(h,hist){
				$('#main > tbody').append(
					'<tr class="history '+ hist.id +'">' +
						'<td>' +
							'<b>'+ hist.name +'</b>'+
							'<br />' + hist.text +
						'</td>' +
						'<td class="box"><img src="images/notes/new.gif" alt="+" title="1" class="addTask" /></td>' +
						'<td class="box"><img src="images/notes/new.gif" alt="+" title="2" class="addTask" /></td>' +
						'<td class="box"><img src="images/notes/new.gif" alt="+" title="3" class="addTask" /></td>' +
					'</tr>'
				).find('tr:last').data('id',hist.id)
				 .find('img.addTask').hide().click( function(){
				 	Struts.newTask = {
						history: hist.id,
						status: $(this).attr('title')
					};
					Add.task();
				 } ).parent().parent().children('td.box').droppable({
					accept: 'span.dragBox',
					drop: function(ev, ui) {
						// PEGA OS IDS DE HISTORIA
						var id = ui.draggable.data('history');
						var history = ui.element.get(0).parentNode.className.split(' ')[1];

						// CANCELA SE A HISTORIA FOR DIFERENTE
						if( id != history )
							return false;

						// SALVA O STATUS DA TASK
						Save.status( ui.draggable );

						if (window.statusJSON) {
							// INSERE A TASK NA TABELA
							$(this).append($(ui.helper[0]).css({
								'top': 0,
								'left': 0
							}));
						}

						return window.statusJSON;
					}
				});

				$('#main > tbody > tr > td:gt(0)').each(function(){
					$(this).mouseover(function(){
						$( this ).children('img.addTask').show();
					});
					$(this).mouseout(function(){
						$( this ).children('img.addTask').hide();
					});
				});

				Get.taskByHistory( hist.id );
			});
		}
	},
	task: {
		mount: function( dados ){
			$.each( dados,function(){
				$('#main > tbody > tr.'+ this.idHistory +' > td:eq('+ this.idStatus +')')
				.append(
					'<span class="dragBox">' +
						'<span class="text">' + this.text + '</span>' +
						'<span class="name">' + this.name + '</span>' +
					'</span>'
				).find('span.dragBox:last')
					.data( 'status',this.idStatus )
					.data( 'history',this.idHistory )
					.data( 'task',this.id ).hide().fadeIn('slow')
					.draggable({
						grid: [ 10,10 ],
						opacity: 0.7,
						revert: true,
						zIndex: 666
					}
				);
			});
		}
	}
};

var Add = {
	history: function(){
		Modal.load(
			'pages/addHistory.html','Add history'
		);
	},
	task: function(){
		Modal.load(
			'pages/addTask.html','Add Task',function(){
				$('#content > div.main')
					.find('select').val( Struts.newTask.status ).parent()
					.find(':hidden[name=history]').val( Struts.newTask.history );
			}
		);
	}
};

var Get = {
	dummy: function( callBack ){
		$.get('pages/dummy.php',
			$.isFunction( callBack ) ? callBack : function(){}
		);
	},
	history: function( id ){
		$.ajax({
			cache: false,
			method: 'POST',
			dataType: 'json',
			url: 'includes/ajax.php',
			data: ( 'action=getHistory&id=' + id ),
			success: function( json ){
				if( json.count && json.count > 0 ){
					Struts.history.mount( json.data );
				}
			}
		});
	},
	task: function( id ){
		$.ajax({
			cache: false,
			method: 'POST',
			dataType: 'json',
			url: 'includes/ajax.php',
			data: ( 'action=getTask&id=' + id ),
			success: function( json ){
				if( json.count && json.count > 0 ){
					Struts.task.mount( json.data );
				}
			}
		});
	},
	taskByHistory: function( id ){
		$.ajax({
			cache: false,
			method: 'POST',
			dataType: 'json',
			url: 'includes/ajax.php',
			data: ( 'action=getTaskByHistory&id=' + id ),
			success: function( json ){
				if( json.count && json.count > 0 ){
					Struts.task.mount( json.data );
				}
			}
		});
	}
};

var Save = {
	history: function(){
		$.ajax({
			cache: false,
			method: 'POST',
			dataType: 'json',
			url: 'includes/ajax.php',
			data: $('#content :input').serialize(),
			success: function( json ){
				var div = $('#content > div.main div.response');
				if( json.code == 0 ){
					div.addClass('success').html( json.message );
					Get.history( json.id );
				}
			}
		});
		return false;
	},
	task: function(){
		$.ajax({
			cache: false,
			method: 'POST',
			dataType: 'json',
			url: 'includes/ajax.php',
			data: $('#content :input').serialize(),
			success: function( json ){
				var div = $('#content > div.main div.response');
				if( json.code == 0 ){
					div.addClass('success').html( json.message );
					Get.task( json.id );
				}
			}
		});
		return false;
	},
	status: function( span ){
		var status = $('#main > tbody > tr > td').index( span.parent() ),
			param = 'action=saveStatus&id='+ span.data('task') +'&status='+ status;

		$.ajax({
			async: false,
			cache: false,
			method: 'POST',
			dataType: 'json',
			url: 'includes/ajax.php',
			data: param,
			success: function(json,xhr){
				if (json.code == 0) {
					Show.info(json.message);
				}
				self.statusJSON = json.code == 0;
			}
		});

		return self.statusJSON;
	}
};

function printError(cod,message,sql){
 	if( $.browser.mozilla && typeof window.console == 'object' ){
		console.group( 'MySQL Error' );
			console.error( cod,': ',message );
			if( sql )
				console.info( sql );
		console.groupEnd();
	} else {
		alert( cod + ': ' + message );
		if( sql ){
			alert( sql );
		}
	}
}

function loading( remove ){
	var content = $( '#content > div.main' );
	if( remove ){
		content.find('div.loading').remove();
	} else {
		content.empty().append('<div class="loading">Carregando...</div>');
	}
}

var Show = {
	info: function( msg ){
		this.container.html( msg ).addClass('info');
	},
	success: function( msg ){
		this.container.html( msg ).addClass('success');
	},
	error: function( msg ){
		this.container.html( msg ).addClass('error');
	},
	clear: function(){
		this.container.empty().removeClass('info')
			.removeClass('success').removeClass('error');
	}
};

var Modal = {
	initialize: function(){
		$('#content > a.close').click( Modal.close );
	},
	open: function(){
		$('#backGround').fadeIn('fast',function(){
			$('#content').fadeIn('fast');
		});
	},
	load: function( url,title,callBack ){
		var content = $('#content > div.main');
		$('#content > span.header').html( title || '' );
		this.open();

		$.ajax({
			cache: false,
			url: url,
			dataType: 'html',
			beforeSend: function(){
				loading( false );
			},
			success: function( response ){
				loading( true );
				content.append( response );
				if( $.isFunction( callBack ) ){
					callBack();
				}
			},
			error: function( xhr ){
				loading( true );
				content.append('<p>'+ xhr.statusText +'</p>');
			}
		});
	},
	close: function(){
		$('#content').fadeOut( 'fast',function(){
			$('#content > div.main').empty();
			$('#backGround').fadeOut( 'fast' );
		} );
	}
};
