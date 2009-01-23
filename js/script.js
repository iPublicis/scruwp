var Struts = {
	newTask: {},
	init: function(){
		// LOAD ALL THE SPRINTS
		Get.sprint();
		// MODAL CORRECTIONS
		Modal.initialize();
		// EVENT CHANGE SPRINT
		Struts.sprint.initSelectAction();
		// LOADING FROM AJAX REQUEST
		$.ajaxSetup({
			beforeSend: function(){
				$('#loading').show();
			},
			complete: function(){
				$('#loading').hide();
			}
		});
		// CONTAINER FOR MESSAGES
		Show.container = $('#main > tfoot > tr > td:last');
	},
	sprint: {
		initSelectAction: function(){
			$('#sprintSelect').change(function( select ){
				if( this.value ) {
					Get.historyBySprint( this.value );
				}
			});
		},
		mountSelect: function( dados ){
			var selected = false;
			$('#sprintSelect > optgroup:first > option:gt(0)').remove();

			$.each(dados,function(i){
				if( !selected )
					selected = this.status ? this.id : selected;

				$('#sprintSelect > optgroup:first').append(
					'<option value="'+ this.id +'">#'+ this.id +'</option>'
				);

				$('#sprintSelect').val( selected );
			});

			if( selected ){
				Get.historyBySprint( selected );
			}
		}
	},
	history: {
		mount: function( dados ){
			$.each(dados,function(h,hist){
				$('#main > tbody').append(
					'<tr class="history '+ hist.id +'">' +
						'<td class="description">' +
							'<img src="images/history/delete.gif" class="deleteHistory" alt="X" title="Delete history" />' +
							'<span>'+
								'<i>'+ hist.estimate +'</i>&nbsp;'+
								'<b>'+ hist.name +'</b>'+
							'</span>'+
							'<br /><i>' + hist.text + '</i>' +
						'</td>' +
						'<td class="box"><img src="images/notes/new.gif" alt="+" title="1" class="addTask" /></td>' +
						'<td class="box"><img src="images/notes/new.gif" alt="+" title="2" class="addTask" /></td>' +
						'<td class="box"><img src="images/notes/new.gif" alt="+" title="3" class="addTask" /></td>' +
					'</tr>'
				).find('tr:last').data('id',hist.id).children('td.box')
				.droppable({
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
						Save.status( ui.draggable, ui.element );

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

				Get.taskByHistory( hist.id );
			});				

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
			$.each( dados,function(){
				$('#main > tbody > tr.'+ this.idHistory +' > td:eq('+ this.idStatus +')')
				.append(
					'<span class="dragBox" style="background-color:#'+ this.color +'">' +
						'<span class="text">' + this.text + '</span>' +
						'<span class="name">' + this.name + '</span>' +
						'<img src="images/notes/delete.gif" class="deleteTask" alt="X" title="Delete task" />' +
					'</span>'
				).find('span.dragBox:last')
					.data( 'status',this.idStatus )
					.data( 'history',this.idHistory )
					.data( 'task',this.id ).hide().fadeIn('slow')
					.draggable({
				 		containment: 'window',
						grid: [ 10,10 ],
						opacity: 0.7,
						revert: true,
						zIndex: 666,
						cursor: 'move'
					}
				).children('img.deleteTask').hide().click(function(){
					Delete.task(
						$(this).parent().data('task'), $(this).parent()
					);
				});
			});

			$('#main > tbody > tr > td:gt(0) > span.dragBox').each(function(){
				$(this).mouseover(function(){
					$( this ).children('img.deleteTask').show();
				});
				$(this).mouseout(function(){
					$( this ).children('img.deleteTask').hide();
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
		if( $('#sprintSelect').val() ){
			Modal.load(
				'pages/addHistory.html','Add history'
			);
		}
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
	sprint: function(){
		$.ajax({
			cache: false,
			method: 'POST',
			dataType: 'json',
			url: 'includes/ajax.php',
			data: $('#content :input').serialize(),
			success: function( json ){
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
	status: function( span,td ){
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
	}
};

var Delete = {
	history: function( id,history ) {
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
		return false;
	},
	task: function( id,task ){
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
		return false;
	}
};

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