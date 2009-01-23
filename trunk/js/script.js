var Struts = {
	newTask: {},
	init: function(){
		// LOAD ALL THE SPRINTS
		Get.sprint();
		// MODAL CORRECTIONS
		Modal.initialize();
		// EVENT CHANGE SPRINT
		Struts.sprint.init();
		// MESSAGES INIT
		Show.init();
		// LOADING FROM AJAX REQUEST
		$.ajaxSetup({
			beforeSend: function(){
				$('#loading').show();
			},
			complete: function(){
				$('#loading').hide();
			}
		});
	},
	sprint: {
		init: function(){
			Struts.sprint.actionMenu();
			Struts.sprint.initSelectAction();
		},
		actionMenu: function(){
			$('img.addSprint').click( Add.sprint );
			$('img.actSprint').click(function(){
				$(this).siblings('div').toggle( 'fast' );
			});
			$('img.defaultSprint').click( Save.defaultSprint );
		},
		initSelectAction: function(){
			$('#sprintSelect').change(function(){
				var option = $('#sprintSelect option:selected');

				$('a.addHistory')[ this.status ? 'show' : 'hide' ]();
				$('img.actSprint')[ this.value ? 'show' : 'hide' ]();

				$('#main > tfoot > tr > td:first')
					.children('span:first').html( option.data('beginDate').dateToPtBr() )
					.children('span:last' ).html( option.data('endDate').dateToPtBr() );

				if( this.value ) {
					Get.historyBySprint( this.value );
				}
			});
		},
		mountSelect: function( dados ){
			var selected = false;
			$('#sprintSelect > optgroup:first > option'+ (
				dados.length ? '' : ':gt(0)'
			) ).remove();

			$('a.addHistory,img.actSprint')[
				 $('#sprintSelect').val( selected ).val() ? 'show' : 'hide'
			]();

			$.each(dados,function(i){
				if( !selected && parseInt( this.status ) ){
					selected = this.id;
				}

				$('#sprintSelect > optgroup:first').append(
					'<option value="'+ this.id +'">#'+ this.id +'</option>'
				).children('option:last')
					.data( 'status',parseInt(this.status) )
					.data( 'beginDate',this.beginDate )
					.data( 'endDate',this.endDate );

				$('a.addHistory,img.actSprint')[
					 $('#sprintSelect').val( selected ).val() ? 'show' : 'hide'
				]();
			});

			if( selected ){
				Get.historyBySprint( selected );
				var option = $('#sprintSelect option:selected');
				$('#main > tfoot > tr > td:first')
					.children('span:first').html( option.data('beginDate').dateToPtBr() )
					.siblings('span:last' ).html( option.data('endDate').dateToPtBr() );
			}
		}
	},
	history: {
		mount: function( dados ){
			// VERIFY IF THE SPRINT IS THE ACTIVE
			var active = $('#sprintSelect :selected').data('status');

			// MOUNT EACH HISTORY LINE
			$.each(dados,function(h,hist){
				$('#main > tbody').append(
					'<tr class="history '+ hist.id +'">' +
						'<td class="description">' +
							( active ? '<img src="images/history/delete.gif" class="deleteHistory" alt="X" title="Delete history" />' : '' ) +
							'<span>'+
								'<sup>'+ hist.estimate +'</sup>&nbsp;'+
								'<b>'+ hist.name +'</b>'+
							'</span>'+
							'<br /><i>' + hist.text + '</i>' +
						'</td>' +
						'<td class="box">'+ ( active ? '<img src="images/notes/new.gif" alt="+" title="1" class="addTask" />' : '' ) +'</td>' +
						'<td class="box">'+ ( active ? '<img src="images/notes/new.gif" alt="+" title="2" class="addTask" />' : '' ) +'</td>' +
						'<td class="box">'+ ( active ? '<img src="images/notes/new.gif" alt="+" title="3" class="addTask" />' : '' ) +'</td>' +
					'</tr>'
				).find('tr:last').data('id',hist.id);

				Get.taskByHistory( hist.id );
			});
			
			// IF !ACTIVE DOESNT INIT THE ACTIONS
			if( !active ) return false;

			// MAKE THE HISTORY ACTIONS
			$('#main > tbody > tr > td.description').each(function(){
				// IMAGE DELETE ACTION
				$(this).children('img.deleteHistory').click( function(){
					var tr = $(this).parent().parent(),
						id = tr.data('id');
				 	Delete.history( id,tr );
				}).hide();
				// IMAGE DELETE MOUSEOVER
				$(this).mouseover(function(){
					$( this ).children('img.deleteHistory').show();
				});
				// IMAGE DELETE MOUSEOUT
				$(this).mouseout(function(){
					$( this ).children('img.deleteHistory').hide();
				});
			});

			// MAKE THE ADD TASK ACTIONS
			$('#main > tbody > tr > td:gt(0)').each(function(){
				// MAKE THE TD A DROPZONE
				$(this).droppable({
					hoverClass: 'hoverBox',
					accept: 'span.dragBox',
					drop: function(ev, ui) {
						// PEGA OS IDS DE HISTORIA
						var id = ui.draggable.data('history');
						var history = ui.element.get(0).parentNode.className.split(' ')[1];

						// CANCELA SE A HISTORIA FOR DIFERENTE
						if( id != history )
							return false;

						// SALVA O STATUS DA TASK
						Save.taskStatus( ui.draggable, ui.element );

						if( window.statusJSON ){
							// INSERE A TASK NA TABELA
							$(this).append($(ui.helper[0]).css({
								'top': 0,
								'left': 0
							}));
						}

						// RETURN THE STATUS
						return window.statusJSON;
					}
				});

				// IMAGE ADD ACTION
				$(this).children('img.addTask').click( function(){
				 	Struts.newTask = {
						history: $(this).parent().parent().data('id'),
						status: $(this).attr('title')
					}; Add.task();
				}).hide();

				// IMAGE ADD MOUSEOVER
				$(this).mouseover(function(){
					$( this ).children('img.addTask').show();
				});

				// IMAGE ADD MOUSEOUT
				$(this).mouseout(function(){
					$( this ).children('img.addTask').hide();
				});
			});
		}
	},
	task: {
		mount: function( dados ){
			var active = $('#sprintSelect :selected').data('status');

			$.each( dados,function(){
				var tds = $('#main > tbody > tr.'+ this.idHistory +' > td:eq('+ this.idStatus +')')
					.append(
						'<span class="dragBox" style="background-color:#'+ this.color +'">' +
							'<span class="text">' + this.text + '</span>' +
							'<span class="name">' + this.name + '</span>' +
							( active ? '<img src="images/notes/delete.gif" class="deleteTask" alt="X" title="Delete task" />' : '' ) +
						'</span>' )
					.find('span.dragBox:last')
					.data( 'history',this.idHistory )
					.data( 'status',this.idStatus )
					.data( 'task',this.id )
					.hide().fadeIn('slow')
					.children('img.deleteTask').hide();
			});

			if( !active )
				return false;

			$('#main > tbody > tr > td:gt(0) > span.dragBox').each(function(){
				var span = $(this);
				span.draggable({
					containment: 'window',
					grid: [10, 10],
					opacity: 0.7,
					revert: true,
					zIndex: 666,
					cursor: 'move'
				}).mouseover(function(){
					$( this ).children('img.deleteTask').show();
				}).mouseout(function(){
					$( this ).children('img.deleteTask').hide();
				}).children('img.deleteTask').click(function(){
					Delete.task(
						$(this).parent().data('task'), $(this).parent()
					);
				});
			});
		}
	}
};

var Add = {
	sprint: function(){
		Modal.load(
			'pages/addSprint.html','Add sprint'
		);
	},
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
	sprint: function(){
		$.ajax({
			cache: false,
			method: 'POST',
			dataType: 'json',
			url: 'includes/ajax.php',
			data: ( 'action=getSprint' ),
			success: function( json ){
				if( json.count && json.count > 0 ){
					Struts.sprint.mountSelect( json.data );
				}
			}
		});
	},
	historyBySprint: function( id ){
		if( !id )
			return false;

		$.ajax({
			cache: false,
			method: 'POST',
			dataType: 'json',
			url: 'includes/ajax.php',
			data: ( 'action=getHistoryBySprint&id=' + id ),
			success: function( json ){
				$('#main > tbody > tr').remove();
				if( json.count && json.count > 0 ){
					Struts.history.mount( json.data );
				}
			}
		});
	},
	history: function( id ){
		if( !id )
			return false;

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
		if( !id )
			return false;

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
		if( !id )
			return false;

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
	sprint: function(){
		$.ajax({
			cache: false,
			method: 'POST',
			dataType: 'json',
			url: 'includes/ajax.php',
			data: $('#content :input').serialize(),
			success: function( json ){
				if( !json.code )
					Modal.close(function(){
						Get.sprint();
					});
			}
		});
	},
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
					Modal.close(function(){
						Get.history( json.id );
					});
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
					Modal.close(function(){
						Get.task( json.id );
					});
				}
			}
		});
		return false;
	},
	taskStatus: function( span,td ){
		var history = span.data('history'),
			status = $('#main > tbody > tr.'+ history +' > td').index( td ),
			param = 'action=saveStatus&id='+ span.data('task') +
					'&status='+ status +'&oldStatus='+ span.data('status');

		if( status == span.data('status') )
			return true;

		$.ajax({
			async: false,
			cache: false,
			method: 'POST',
			dataType: 'json',
			url: 'includes/ajax.php',
			data: param,
			success: function(json,xhr){
				if( json.code == 0 ){
					// SET THE NEW STATUS
					span.data( 'status',status );
				}
				self.statusJSON = json.code == 0;
			}
		});

		return self.statusJSON;
	},
	defaultSprint: function( id ){
		var selected = $('#sprintSelect :selected');

		if( parseInt( selected.data('status') ) ){
			Show.info( 'O Sprint <b>'+ selected.html() +'</b> já é o atual!' );
			return false;
		}

		$.ajax({
			cache: false,
			method: 'POST',
			dataType: 'json',
			url: 'includes/ajax.php',
			data: 'action=defaultSprint&id='+ selected.val(),
			success: function( json ){
				$('#main > tfoot > tr > td:last > div').hide();
				if( json.code == 0 ){
					Show.success( json.message );
					Get.sprint();
				} else {
					Show.error( json.message );
				}
			}
		});
		return false;
	}
};

var Delete = {
	history: function( id,history ) {
		if( confirm( 'Deseja remover a estória?' ) ){
			$.ajax({
				cache: false,
				method: 'POST',
				dataType: 'json',
				url: 'includes/ajax.php',
				data: ( 'action=deleteHistory&id='+ id ),
				success: function( json ){
					if( json.code == 0 ){
						history.fadeOut( 'slow' );
					}
				}
			});
		}
		return false;
	},
	task: function( id,task ){
		if( prompt( 'Deseja remover a task?' ) ){
			$.ajax({
				cache: false,
				method: 'POST',
				dataType: 'json',
				url: 'includes/ajax.php',
				data: ( 'action=deleteTask&id='+ id ),
				success: function( json ){
					if( json.code == 0 ){
						task.fadeOut( 'slow' );
					}
				}
			});
		}
		return false;
	}
};

var Show = {
	init: function(){
		// CONTAINER FOR MESSAGES
		Show.container = $('#main > tfoot > tr > td').eq(1);
		// CLEAR THE CONTAINER MESSAGE
		Show.container.click(function(){ Show.clear(); });
	},
	info: function( msg ){
		this.message( msg,'info' );
	},
	success: function( msg ){
		this.message( msg,'success' );
	},
	error: function( msg ){
		this.message( msg,'error' );
	},
	message: function( msg,css){
		this.clear();
		this.container.html( msg ).addClass( css ).addClass( 'pointer' );
	},
	clear: function(){
		this.container.empty().removeClass();
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
				content.append( response );
				if( $.isFunction( callBack ) ){
					callBack();
				}
			},
			error: function( xhr ){
				content.append('<p>'+ xhr.statusText +'</p>');
			},
			complete: function(){
				loading( true );
			}
		});
	},
	close: function( callBack ){
		$('#content').fadeOut( 'fast',function(){
			$('#content > div.main').empty();
			$('#backGround').fadeOut( 'fast',function(){
				if( $.isFunction( callBack ) ){
					callBack();
				}
			} );
		} );
	}
};

String.prototype.dateToPtBr = function(){
	return this.split( '-' ).reverse().join('/');
}

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