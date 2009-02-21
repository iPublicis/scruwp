var Struts = {
	init: function(){
		// LOAD THE MENU ACTIONS
		Struts.menu();
		// LOAD ALL THE SPRINTS
		Get.team();
		// GET ALL USERS
		Get.user();
		// MODAL CORRECTIONS
		Modal.initialize();
		// EVENT CHANGE SPRINT
		Struts.sprint.init();
		// MESSAGES INIT
		Show.init();
		// EVENT CHANGE TEAM
		Struts.team.init();
		// EVENT CHANGE USER
		Struts.user.init();
		// LOAD PROGRESSBAR
		Struts.sprintBar.init();
		// LOAD ALL LIVE EVENTS
		Struts.initLiveEvents();
		// LOADING FROM AJAX REQUEST
		$.ajaxSetup({
			beforeSend: function(){
				$('#loading').fadeIn();
			},
			complete: function(){
				$('#loading').fadeOut();
				Show.clear();
			}
		});
		// COLAPSE ALL HISTORIES
		$('#colapseAll').click(function(){
			$('span.dragBox')[
				$('span.dragBox:visible').size() ? 'hide' : 'show'
			]();
		});
	},
	initLiveEvents: function(){
		// COLAPSE HISTORY
		$('img.colapseHistory').live('click',function(){
			$(this).parent().parent().find('span.dragBox').toggle();
		});

		// DELETE HISTORY
		$('img.deleteHistory').live('click',function(){
			var tr = $(this).parent().parent();
		 	Delete.history(
				tr.data('id'), tr
			);
		});

		// HISTORY IMAGES MOUSE EVENTS
		$('td.description').live('mouseover',function(){
			$( this ).children('img').show();
		}).live('mouseout',function(){
			$( this ).children('img').hide();
		});

		// IMAGE ADD TASK
		$('img.addTask').live('click',function(e){
			var offset = $(e.target).offset();

			Modal.position.top =
				offset.top > window.innerHeight ? offset.top : 0;

		 	Struts.task.data = {
				history: $(this).parent().parent().data('id'),
				status: $(this).data('status')
			};

			Add.task();
		});

		// IMAGE EDIT TASK
		$('img.editTask').live('click',function(e){
			var offset = $(e.target).offset();

			Modal.position.top =
				offset.top > window.innerHeight ? offset.top : 0;

			Edit.task( $(this).parent().data('task') );
		});	

		// DELETE TASK
		$('img.deleteTask').live('click',function(){
			Delete.task(
				$(this).parent().data('task'), $(this).parent()
			);
		});

		// TASK ADD MOUSE EVENTS
		$('td.box').live('mouseover',function(){
			$(this).children('img.addTask').show();
		}).live('mouseout',function(){
			$(this).children('img.addTask').hide();
		});

		// TASK IMAGES MOUSE EVENTS
		$('span.dragBox').live('mouseover',function(){
			$(this).children('img').show();
		}).live('mouseout',function(){
			$(this).children('img').hide();
		});
	},
	sprintBar: {
		init: function(){
			$("#progressbar").progressbar().progressbar('disable');
		},
		setSprintValue: function(){
			var idSprint = $('#sprintSelect').val();
			$.get('includes/ajax.php',( 'action=getSprint&id='+ idSprint ),function(json){
				if( json.data == undefined || json.count == 0 )
					return false;

				var tHead = $('#main > thead > tr:first > th');

				tHead.eq(0).html( json.data[0].beginDate.dateToPtBr() );
				tHead.eq(2).html( json.data[0].endDate.dateToPtBr() );

				$("#progressbar").progressbar(
					'value',Struts.sprintBar.calcDiff(
						json.data[0].beginDate, json.data[0].endDate
					)
				).progressbar('enable');
			},'json');
		},
		calcDiff: function(d1,d2){
			if( d1.split('-').length != 3 || d2.split('-').length != 3 )
				return 0;

			var dt1 = d1.split('-'),
				dt2 = d2.split('-'),

				date  =	new Date(),
				date1 = new Date( dt1[0],dt1[1]-1,dt1[2] ),
				date2 = new Date( dt2[0],dt2[1]-1,dt2[2] );

			if( date1.isGreater( date2 ) )
				return Struts.sprintBar.calcDiff( d2, d1 );

			if( date.isGreater( date2 ) )
				return 100;

			if( date.isLesser( date1 ) )
				return 0;

			var posit = date - date1,
				total = date2 - date1;

			return parseInt( ( posit * 100 ) / total );
		},
		clear: function(){
			console.info( 'clear' );
			var tHead = $('#main > thead > tr:first > th');
				tHead.eq(0).html('');
				tHead.eq(2).html('');

			$("#progressbar").progressbar( 'value',0 ).progressbar('disable');
		}
	},
	menu: function(){
		var thOptions 	= $('#options');
		var spanBtn		= thOptions.children('span.button');

		thOptions.children('div.container').css({
			top: spanBtn.position().top + spanBtn.outerHeight() - 1
		});

		spanBtn.click(function(){
			$(this).css(
				$(this).siblings('div.container').toggle().is(':visible')
					? { 'background-color': '#DDDDDD',
						'border': '1px solid #000000',
						'border-bottom': ' 1px solid #DDDDDD' }
					: { 'border': '1px solid #000000' }
			);
		}).mouseover(function(){
			if( $(this).siblings('div.container').is(':visible') )
				return false;

			$(this).css({
				'background-color': '#DDDDDD',
				'border': '1px solid #000000'
			});
		}).mouseout(function(){
			if( $(this).siblings('div.container').is(':visible') )
				return false;

			$(this).css({
				'background-color': '#FFFFFF',
				'border': '1px solid #FFFFFF'
			});
		});

		var menuDiv = 'div.container ';
		// TEAM ACTIONS
		$( menuDiv + 'a.addTeam').click( Add.team );
		// USER ACTIONS
		$( menuDiv + 'a.addUser').click( Add.user );
		// SPRINT ACTIONS
		$( menuDiv + 'a.addSprint').click( Add.sprint );
		$( menuDiv + 'a.defaultSprint').click( Save.defaultSprint );
		// HISTORY ACTIONS
		$( menuDiv + 'a.addHistory').click( Add.history );
	},
	colorSet: {
		mountSelect: function( dados,selector ){
			$.each(dados,function(){
				$( selector ).append(
					'<option value="'+ this.id +'">'+ this.name +'</option>'
				).children('option:last')
					.data('background',this.background)
					.data('color',this.color);
			});
		}
	},
	user: {
		init: function(){
			Struts.user.initSelectAction();
		},
		initSelectAction: function(){
			$('#userSelect').change(function(){
				$.cookie( 'userSelect', this.value, { expires: 365 } );

				Get.historyBySprint(
					$('#sprintSelect').val()
				);
			});
		},
		mountSelect: function( dados,selector ){
			$( selector +' > optgroup > option').remove();

			var select = $( selector +' > optgroup:first');
			$.each(dados,function(){
				var selected = $.cookie('userSelect') == this.id ? 'selected="selected"' : '';
				select.append(
					'<option value="'+ this.id +'" '+ selected +'>'+ this.name +'</option>'
				);
			});
		}
	},
	team: {
		init: function(){
			Struts.team.initSelectAction();
		},
		initSelectAction: function(){
			$('#teamSelect').change(function(){
				var action = this.value ? 'show' : 'hide';
				$('li.sprint')[ action ]().prev('li')[ action ]();

				if( this.value ){
					$.cookie( 'teamSelect', this.value, { expires: 365 } );
					Get.sprintByTeam( this.value );
				}
			});
		},
		mountSelect: function( dados,id ){
			$('#teamSelect > optgroup:first > option'+ (
				dados.length ? '' : ':gt(0)'
			) ).remove();

			$.each(dados,function(){
				var selected = $.cookie('teamSelect') == this.id ? 'selected="selected"' : '';
				$('#teamSelect > optgroup:first').append(
					'<option value="'+ this.id +'" '+ selected +'>'+ this.name +'</option>'
				);
			});

			if( Struts.progressBar == false )
				// LOAD THE PROGRESSBAR
				Struts.sprintBar.init();

			$('#teamSelect').change();
		}
	},
	sprint: {
		init: function(){
			Struts.sprint.initSelectAction();
		},
		initSelectAction: function(){
			$('#sprintSelect').change(function(){
				var action = this.value ? 'show' : 'hide';
				$('li.history')[ action ]().prev('li')[ action ]();

				if( this.value ){
					Get.historyBySprint( this.value );
					Struts.sprintBar.setSprintValue( this.value );
				} else {
					Struts.sprintBar.clear();
				}
			});
		},
		mountSelect: function( dados ){
			var selected = false;
			$('#sprintSelect > optgroup:first > option').remove();

			if( !dados.length )
				$('#sprintSelect > optgroup:first').append(
					'<option value="">...</option>'
				);

			$.each(dados,function(){
				if( !selected && parseInt( this.status ) ){
					selected = this.id;
				}

				$('#sprintSelect > optgroup:first').append(
					'<option value="'+ this.id +'">#'+ this.id +'</option>'
				).children('option:last')
					.data( 'status',parseInt(this.status) )
					.data( 'beginDate',this.beginDate )
					.data( 'endDate',this.endDate );
			});

			$('#sprintSelect').val( selected ).change();
		}
	},
	history: {
		mount: function( dados ){
			// VERIFY IF THE SPRINT IS THE ACTIVE
			var active = $('#sprintSelect option:selected').data('status'),

			// IMG TEMPLATE
			image = '<img src="images/notes/add.png" alt="+" title="Add task" class="addTask" />',
			
			// TD.BOX TEMPLATE
			tdBox = '<td class="box">'+ ( active ? image : '' ) +'</td>',

			// GET THE TABLE
			tbody = $('#main > tbody');

			// MOUNT EACH HISTORY LINE
			$.each(dados,function(h,hist){
				tbody.append(
					'<tr class="history '+ hist.id +'">' +
						'<td class="description">' +
							( active ? '<img src="images/history/delete.png" class="deleteHistory" alt="X" title="Delete history" />' : '' ) +
							'<img src="images/history/history.png" class="colapseHistory" alt="-" title="Colapse history" />' +
							'<span>'+
								'<sup>'+ hist.estimate +'</sup>&nbsp;'+
								'<b>'+ hist.name +'</b>'+
							'</span>'+
							'<br /><i>' + hist.text + '</i>' +
						'</td>' +
						tdBox + tdBox + tdBox +
					'</tr>'
				).find('tr.'+ hist.id).data('id',hist.id)
				 .find('img').hide();
				 
				// SET THE STATUS IN THE ADD TASK IMAGE
				tbody.find('tr.'+ hist.id +' img.addTask').each(function(i){
					$(this).data('status',( i + 1 ));
				});

				Get.taskByHistory( hist.id );
			});

			// IF DONT NEED TO SET DE PROPPABLE
			if( !active ) return false;

			// MAKE THE ADD TASK ACTIONS
			$('#main > tbody td.box:not(.ui-droppable)').each(function(){
				// MAKE THE TD A DROPZONE
				$(this).droppable({
					hoverClass: 'hoverBox',
					accept: 'span.dragBox',
					drop: function(ev, ui) {
						// PEGA OS IDS DE HISTORIA
						var id = ui.draggable.data('history');
						var history = ui.element.parent().data('id');

						// CANCELA SE A HISTORIA FOR DIFERENTE
						if( id != history )
							return false;

						// SALVA O STATUS DA TASK
						Save.taskStatus( ui.draggable, ui.element );

						if( window.statusJSON ){
							// INSERE A TASK NA TABELA
							$(this).append( ui.helper.css({
								'top':'0px',
								'left':'0px'
							}) );
						}

						// RETURN THE STATUS
						return window.statusJSON;
					}
				});
			});
		}
	},
	task: {
		data: {},
		mount: function( dados ){
			// GET SPRINT'S ACTIVE STATUS
			var active = $('#sprintSelect option:selected').data('status'),
				cookieUser = $.cookie('userSelect');

			$.each( dados,function(){
				if( cookieUser && cookieUser != this.idUser )
					return true;

				var tds = $('#main > tbody > tr.'+ this.idHistory +' > td:eq('+ this.idStatus +')')
					.append(
						'<span id="task_'+ this.id +'" class="dragBox">' +
							'<span class="text">' + this.text + '</span>' +
							'<span class="name">' + this.name + '</span>' +
							( active ? '<img src="images/notes/delete.png" class="deleteTask" alt="X" title="Delete task" />' : '' ) +
							( active ? '<img src="images/notes/edit.png" class="editTask" alt="E" title="Edit task" />' : '' ) +
						'</span>' )
					.find('span.dragBox:last')
					.css({
						'color' : '#' + this.color,
						'border' : '1px solid #'+ this.border,
						'background-color' : '#' + this.background
					})
					.data( 'history',this.idHistory )
					.data( 'status',this.idStatus )
					.data( 'task',this.id )
					.hide().fadeIn('slow')
					.children('img.deleteTask,img.editTask').hide()
					.siblings('span.name').css({
						'border-top' : '1px solid #'+ this.border
					});
			});

			// IF DONT NEDD TO SET THE DRAGGABLE
			if( !active ) return false;

			$('span.dragBox:not(.ui-draggable)').each(function(){
				$(this).draggable({
					zIndex: 666,
					opacity: 0.7,
					revert: true,
					cursor: 'move',
					grid: [10, 10],
					stop:function(e,ui){
						ui.helper.css({
							'top':'0px',
							'left':'0px'
						});
					}
				});
			});
		}
	}
};

var Add = {
	team: function(){
		Modal.load(
			'pages/add/team.html','Add team'
		);
	},
	sprint: function(){
		Modal.load(
			'pages/add/sprint.html','Add sprint'
		);
	},
	history: function(){
		Modal.load(
			'pages/add/history.html','Add history'
		);
	},
	user: function(){
		Modal.load(
			'pages/add/user.html','Add User'
		);
	},
	task: function(){
		Modal.load(
			'pages/add/task.html','Add Task',function(){
				$('#content div.main')
					.find('select').val( Struts.task.data.status ).parent()
					.find('input:hidden[name=history]').val( Struts.task.data.history );
			}
		);
	}
};

var Edit = {
	task: function( id ){
		Modal.load(
			( 'pages/edit/task.phtml?id='+ id ),'Edit Task'
		);
	}
};

var Get = {
	dummy: function( callBack ){
		$.get('pages/dummy.php',
			$.isFunction( callBack ) ? callBack : function(){}
		);
	},
	colorSet: function( selector ){
		$.ajax({
			cache: false,
			method: 'POST',
			dataType: 'json',
			url: 'includes/ajax.php',
			data: ( 'action=getColorSet' ),
			success: function( json ){
				Struts.colorSet.mountSelect( json.data || [], selector );
			}
		});
	},
	team: function( id ){
		$.ajax({
			cache: false,
			method: 'POST',
			dataType: 'json',
			url: 'includes/ajax.php',
			data: ( 'action=getTeam' ),
			success: function( json ){
				Struts.team.mountSelect( json.data || [], id );
			}
		});
	},
	user: function( selector ){
		$.ajax({
			cache: false,
			method: 'POST',
			dataType: 'json',
			url: 'includes/ajax.php',
			data: ( 'action=getUser' ),
			success: function( json ){
				Struts.user.mountSelect(
					json.data || [],
					selector  || '#userSelect'
				);
			}
		});
	},
	sprintByTeam: function( id ){
		$('#main > tbody > tr').remove();

		if( !id )
			return false;

		$.ajax({
			cache: false,
			method: 'POST',
			dataType: 'json',
			url: 'includes/ajax.php',
			data: ( 'action=getSprintByTeam&id=' + id ),
			success: function( json ){
				Struts.sprint.mountSelect( json.data || [] );
			}
		});
	},
	historyBySprint: function( id ){
		$('#main > tbody > tr').remove();

		if( !id )
			return false;

		$.ajax({
			cache: false,
			method: 'POST',
			dataType: 'json',
			url: 'includes/ajax.php',
			data: ( 'action=getHistoryBySprint&id=' + id ),
			success: function( json ){
				Struts.history.mount( json.data || [] );
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
				Struts.history.mount( json.data || [] );
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
				Struts.task.mount( json.data || [] );
			}
		});

		return false;
	},
	taskData: function( id ){
		$.get('includes/ajax.php',( 'action=getTask&id=' + id ),function(){
			console.log( id,arguments )
		},'json');
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
				Struts.task.mount( json.data || [] );
			}
		});
	}
};

var Save = {
	team: function(){
		$.ajax({
			cache: false,
			method: 'POST',
			dataType: 'json',
			url: 'includes/ajax.php',
			data: $('#content :input').serialize(),
			success: function( json ){
				if( json.code == 0 ){
					Modal.close(function(){
						Get.team( json.id );
					});
				} else {
					$('#content div.response').addClass('error').html( json.message );
				}
			}
		});
	},
	user: function(){
		$.ajax({
			cache: false,
			method: 'POST',
			dataType: 'json',
			url: 'includes/ajax.php',
			data: $('#content :input').serialize(),
			success: function( json ){
				if( json.code == 0 ){
					Modal.close(function(){
						Get.user();
					});
				} else {
					$('#content div.response').addClass('error').html( json.message );
				}
			}
		});
	},
	sprint: function(){
		$.ajax({
			cache: false,
			method: 'POST',
			dataType: 'json',
			url: 'includes/ajax.php',
			data: $('#content :input').serialize(),
			success: function( json ){
				if( json.code == 0 ){
					Modal.close(function(){
						Get.sprintByTeam( $('#teamSelect').val() );
					});
				} else {
					$('#content div.response').addClass('error').html( json.message );
				}
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
				if( json.code == 0 ){
					$('#content div.response').addClass('success').html( json.message );
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
				if( json.code == 0 ){
					$('#content div.response').addClass('success').html( json.message );
					Modal.close(function(){
						if( json.action == 'edtTask' ){
							$('#task_'+json.id).fadeOut('fast').remove();
						}
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
	defaultSprint: function(){
		var selected = $('#sprintSelect option:selected');
		if( !selected.val() )
			return false;

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
				Show[ json.code == 0 ? 'success' : 'error' ]( json.message );
				if( json.code == 0 ){
					Get.sprintByTeam( $('#teamSelect').val() );
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
		if( confirm( 'Deseja remover a task?' ) ){
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
		Show.container.click( Show.clear );
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
		Show.container.empty().removeClass();
	}
};

var Modal = {
	position: {
		top: 0
	},
	initialize: function(){
		$('#content > a.close').click( Modal.close );
	},
	open: function(){
		$('#backGround').height( $(document).height() )
			.fadeIn('fast',function(){
				$('html,body').animate({ scrollTop: 0 }, 'fast', function(){
					$('#content').fadeIn('fast');
				});
			}
		);
	},
	load: function( url,title,callBack ){
		this.open();

		var content = $('#content div.main'),
			index = url.indexOf('?'),
			param = '';

		$('#content span.header').html( title || '' );

		// VERIFY FOR PARAMETERS
		if( index > -1 ){
			param = url.substr( index + 1 );
			url = url.substr( 0,index )
		}

		$.ajax({
			url: url,
			data: param,
			cache: false,
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
		$('#content').fadeOut( 'normal',function(){
			$('#content div.main').empty();
			$('html').animate({ scrollTop: Modal.position.top }, 'normal', function(){
				$('#backGround').fadeOut( 'normal',function(){
					Modal.position.top = 0;
					if( $.isFunction( callBack ) ){
						callBack();
					}
				} );
			});
		} );
	}
};

// STRING PROTOTYPES
String.prototype.dateToPtBr = function(){
	return this.split( '-' ).reverse().join('/');
}

// DATE PROTOTYPES
Date.prototype.isSameDay = function( date ){
	return date instanceof Date
		? this.getFullYear() == date.getFullYear() &&
			this.getMonth() == date.getMonth() &&
			this.getDate() == date.getDate()
		: null;
}

Date.prototype.isLesser = function( date ){
	return date instanceof Date
		? date.isGreater( this ) && !this.isSameDay( date )
		: null;
}

Date.prototype.isGreater = function( date ){
	return date instanceof Date
		? this.getFullYear() > date.getFullYear()
			? true
			: this.getFullYear() == date.getFullYear()
				? this.getMonth() > date.getMonth()
					? true
					: this.getMonth() == date.getMonth()
						? this.getDate() > date.getDate()
							? true
							: false
						: false
				: false
		: null;
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
	var content = $( 'div.main' );
	if( remove ){
		content.find('div.loading').remove();
	} else {
		content.empty().append('<div class="loading">Loading...</div>');
	}
}
