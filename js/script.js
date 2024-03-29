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
		// MESSAGE
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
			}
		});
		// CENTRALIZE THE LOADING MESSAGE
		$('#loading').css('margin-left','-' + (
			$('#loading').width() / 2
		) + 'px');
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

		// IMAGE ADD TASK
		$('img.addTask').live('click',function(e){
			var offset = $(e.target).offset();

			Modal.status.positionTop =
				offset.top > window.innerHeight ? offset.top : 0;

		 	Struts.task.data = {
				history: $(this).parents('tr').data('id')
			};

			Add.task();
		});

		// IMAGE EDIT TASK
		$('img.editTask').live('click',function(e){
			var offset = $(e.target).offset();

			Modal.status.positionTop =
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
			).toggleClass('ui-corner-all').toggleClass('ui-corner-top');
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
		$( menuDiv + 'a.edtUser').click( Edit.user );
		// SPRINT ACTIONS
		$( menuDiv + 'a.addSprint').click( Add.sprint );
		$( menuDiv + 'a.defaultSprint').click( Save.defaultSprint );
		// HISTORY ACTIONS
		$( menuDiv + 'a.addHistory').click( Add.history );
	},
	colorSet: {
		mountSelect: function( dados,selector,value ){
			$.each(dados,function(){
				var selected = this.id == value ? 'selected="selected"' : '';
				$( selector ).append(
					'<option value="'+ this.id +'" '+ selected +'>'+ this.name +'</option>'
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

				Struts.user.toggleUserLi();
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

			Struts.user.toggleUserLi();
		},
		toggleUserLi: function(){
			$('li.edtUser')[
				$('#userSelect').val() ? 'show' : 'hide'
			]();
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
				$('li.history')[ action ]().prev('li')[ action ]();

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
				var active = $('option:selected',this).data('status'), 
					action = this.value && active ? 'show' : 'hide',
					actDef = this.value && !active ? 'show' : 'hide';

				$('li.history','#options')[ action ]().prev('li')[ action ]();

				$('li.sprint li:last','#options')[ actDef ]();

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
			$('optgroup:first > option','#sprintSelect').remove();

			if( !dados.length )
				$('optgroup:first','#sprintSelect').append(
					'<option value="">...</option>'
				);

			$.each(dados,function(){
				if( !selected && parseInt( this.status ) ){
					selected = this.id;
				}

				$('optgroup:first','#sprintSelect').append(
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

			// GET THE TABLE
			tbody = $('#main > tbody');

			// MOUNT EACH HISTORY LINE
			$.each(dados,function(h,hist){
				tbody.append(
					'<tr class="history '+ hist.id +'">' +
						'<td class="description">' +
							( !active ? '' :
								'<img src="images/notes/add.png" alt="+" title="Add task" class="addTask" />'+
								'<img src="images/history/delete.png" class="deleteHistory" alt="X" title="Delete history" />'
							) +
							'<img src="images/history/history.png" class="colapseHistory" alt="-" title="Colapse history" />' +
							'<span>'+
								'<sup>'+ hist.estimate +'</sup>&nbsp;'+
								'<b>'+ hist.name +'</b>'+
							'</span>'+
							'<br /><i>' + hist.text + '</i>' +
						'</td>' +
						'<td class="box" /><td class="box" /><td class="box" />'+
					'</tr>'
				).find('tr.'+ hist.id).data('id',hist.id);

				// SET THE STATUS IN THE TD
				tbody.find('tr.'+ hist.id +' td.box').each(function(i){
					$(this).data('status',( i + 1 ));
				});

				Get.taskByHistory( hist.id );
			});

			// IF DONT NEED TO SET DE PROPPABLE
			if( !active ) return false;

			// MAKE THE ADD TASK ACTIONS
			$('#main > tbody td.box:not(.ui-droppable)').droppable({
				hoverClass: 'hoverBox',
				accept: 'span.dragBox',
				drop: function(e, ui) {
					// PEGA OS IDS DE HISTORIA
					var id = ui.draggable.data('history');
					var history = ui.draggable.parents('tr').data('id');

					// CANCELA SE A HISTORIA FOR DIFERENTE
					if( id != history )
						return false;

					// SALVA O STATUS DA TASK
					Save.taskStatus( ui.draggable,$(e.target) );

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
		}
	},
	task: {
		data: {},
		mount: function( dados ){
			// GET SPRINT'S ACTIVE STATUS
			var active = $('option:selected','#sprintSelect').data('status'),
				cookieUser = $.cookie('userSelect');

			$.each( dados,function(i){
				if( cookieUser && cookieUser != this.idUser )
					return true;

				$('tr.'+ this.idHistory +' td:eq('+ this.idStatus +')','#main')
					.append(
						'<span id="task_'+ this.id +'" class="dragBox ui-corner-all">' +
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
					.find('img').hide()
					.siblings('span.name').css({
						'border-top' : '1px solid #'+ this.border
					});
			});

			// IF DONT NEDD TO SET THE DRAGGABLE
			if( !active ) return false;

			// MAKE THE TASKS DRAGGABLE
			$('span.dragBox:not(.ui-draggable)').draggable({
				zIndex: 666,
				opacity: 0.7,
				revert: true,
				cursor: 'move',
				grid: [10, 10],
				stop:function(e,ui){
					ui.helper.css({
						'top':'0px',
						'left':'0px'
					}).mouseout();
					// PREVENT FROM THE INSIDE IMAGES STAY VISIBLE
				}
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
				$('input:hidden[name=history]','#content').val( Struts.task.data.history );
			}
		);
	}
};

var Edit = {
	task: function( id ){
		Modal.load(
			( 'pages/edit/task.phtml?id='+ id ),'Edit Task'
		);
	},
	user: function(){
		if( !$('#userSelect').val() )
			return false;

		Modal.load(
			( 'pages/edit/user.phtml?id='+ $('#userSelect').val() ),'Edit User'
		);
	}
};

var Get = {
	dummy: function( callBack ){
		$.get('pages/dummy.php',
			$.isFunction( callBack ) ? callBack : function(){}
		);
	},
	colorSet: function( selector,value ){
		$.ajax({
			cache: false,
			type: 'GET',
			dataType: 'json',
			url: 'includes/ajax.php',
			data: ( 'action=getColorSet' ),
			success: function( json ){
				Struts.colorSet.mountSelect( json.data || [], selector, value );
			}
		});
	},
	team: function( id ){
		$.ajax({
			cache: false,
			type: 'GET',
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
			type: 'GET',
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
		if( !id ) return false;

		$.ajax({
			cache: false,
			type: 'GET',
			dataType: 'json',
			url: 'includes/ajax.php',
			data: ( 'action=getSprintByTeam&id=' + id ),
			success: function( json ){
				$('#main > tbody > tr').remove();
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
			type: 'GET',
			dataType: 'json',
			url: 'includes/ajax.php',
			data: ( 'action=getHistoryBySprint&id=' + id ),
			success: function( json ){
				Struts.history.mount( json.data || [] );
			}
		});
	},
	history: function( id ){
		if( !id ) return false;

		$.ajax({
			cache: false,
			type: 'GET',
			dataType: 'json',
			url: 'includes/ajax.php',
			data: ( 'action=getHistory&id=' + id ),
			success: function( json ){
				Struts.history.mount( json.data || [] );
			}
		});
	},
	task: function( id ){
		if( !id ) return false;

		$.ajax({
			cache: false,
			type: 'GET',
			dataType: 'json',
			url: 'includes/ajax.php',
			data: ( 'action=getTask&id=' + id ),
			success: function( json ){
				Struts.task.mount( json.data || [] );
			}
		});

		return false;
	},
	taskByHistory: function( id ){
		if( !id ) return false;

		$.ajax({
			cache: false,
			type: 'GET',
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
			type: 'POST',
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

		return false;
	},
	user: function(){
		$.ajax({
			cache: false,
			type: 'POST',
			dataType: 'json',
			url: 'includes/ajax.php',
			data: $('#content :input').serialize(),
			success: function( json ){
				if( json.code == 0 ){
					Modal.close(function(){
						$('#sprintSelect').change();
						Get.user();
					});
				} else {
					$('#content div.response').addClass('error').html( json.message );
				}
			}
		});

		return false;
	},
	sprint: function(){
		$.ajax({
			cache: false,
			type: 'POST',
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

		return false;
	},
	history: function(){
		$.ajax({
			cache: false,
			type: 'POST',
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
			type: 'POST',
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
	taskStatus: function( span, td ){
		var status 		= td.data('status'),
			oldStatus 	= span.data('status'),
			param = 'action=saveStatus&id='+ span.data('task') +'&status='+ status +'&oldStatus='+ oldStatus;

		if( status == oldStatus )
			return true;

		$.ajax({
			async: false,
			cache: false,
			type: 'POST',
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
		var selected	= $('#sprintSelect option:selected'),
			team		= $('#teamSelect option:selected');

		if( !selected.val() )
			return false;

		if( parseInt( selected.data('status') ) ){
			Show.info( 'The Sprint <b>'+ selected.html() +'</b> is already the default!' );
			return false;
		}

		$.ajax({
			cache: false,
			type: 'POST',
			dataType: 'json',
			url: 'includes/ajax.php',
			data: ( 'action=defaultSprint&id='+ selected.val()+'&idTeam='+team.val() ),
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
		if( confirm( 'Remove the history?' ) ){
			$.ajax({
				cache: false,
				type: 'POST',
				dataType: 'json',
				url: 'includes/ajax.php',
				data: ( 'action=deleteHistory&id='+ id ),
				success: function( json ){
					Show[ json.code == 0 ? 'success' : 'error' ]( json.message );
					if( json.code == 0 ){
						history.fadeOut( 'slow' );
					}
				}
			});
		}
	},
	task: function( id,task ){
		if( confirm( 'Remove the task?' ) ){
			$.ajax({
				cache: false,
				type: 'POST',
				dataType: 'json',
				url: 'includes/ajax.php',
				data: ( 'action=deleteTask&id='+ id +'&status='+ task.data('status') ),
				success: function( json ){
					if( json.code == 0 ){
						task.fadeOut( 'slow' ).remove();
					}
				}
			});
		}
	}
};

var Show = {
	container: {},
	span: {},
	init: function(){
		// CONTAINER FOR MESSAGES
		Show.container = $('#message');

		// SPAN FOR THE MESSAGES TEXT
		Show.span = $('span','#message');

		// BIND THE ACTION OF THE CLOSE MESSAGE
		Show.span.siblings('img').click(function(){
			// HIDE THE MESSAGE 
			Show.container.fadeOut('fast',function(){
				// CLEAR THE MESSAGE
				Show.clear();
			});
		});
	},
	info: function( msg ){
		// SHOW THE INFO MESSAGE
		Show.message( msg,'info' );
	},
	success: function( msg ){
		// SHOW THE SUCCESS MESSAGE
		Show.message( msg,'success' );
	},
	error: function( msg ){
		// SHOW THE ERROR MESSAGE
		Show.message( msg,'error' );
	},
	message: function( msg,css ){
		// CHECK THE CONTENT OF THE MESSAGE
		if( msg == '' ) return false;

		// CLEAR AND SET THE NEW MESSAGE
		Show.clear().html( msg );

		// CENTRALIZE THE MESSAGE
		Show.centralize();

		// SET THE STYLE AND SHOW
		Show.container.addClass( css +' ui-corner-all' ).fadeIn('fast');
	},
	centralize: function(){
		// GET THE HALF WIDTH OF THE MESSAGE
		var width = Show.container.width() / 2;

		// CENTRALIZE THE CONTAINER
		Show.container.css('margin-left','-'+ width +'px');
	},
	clear: function(){
		// HIDE AND CLEAR THE STYLE
		Show.container.hide().removeClass();
		// CLEAR THE OLD MESSAGE
		return Show.span.html('');
	}
};

var Modal = {
	status: {
		positionTop: 0,
		type: 'small'
	},
	initialize: function(){
		$('#content > a.close').click( Modal.close );
	},
	fixHeight: function(){
		var content = $('#content'),
			main	= $('div.main',content),
			inner	= main.css('height','auto').height(),
			bigger	= inner < content.height(),
			isSmall	= Modal.status.type == 'small';

		// RESET THE MAIN SIZE
		main.css('height','100%');

		// CHECK IF THE CONTENT IS SMALLER
		if( bigger && isSmall && content.is(':visible') ){
			// ANIMATE THE REDUCT OF THE CONTAINER
			content.css('height','50%').animate({ height: inner },'slow');
		}
	},
	loadBigger: function( url,title,callBack ){
		// CHANGE THE MODAL TYPE
		Modal.status.type = 'bigger';

		// FIX THE CSS FOR THE BIGGER MODAL
		$('#content')
			.css({ height:'80%', width: '80%', left: '10%', top: '5%' });

		// LOAD THE PAGE
		Modal.load( url,title,callBack );
	},
	load: function( url,title,callBack ){
		var content = $('#content'),
			main	= content.children('div.main'),
			index 	= url.indexOf('?'),
			param 	= '';

		$('span.header','#content').html( title || '' );

		// VERIFY FOR PARAMETERS
		if( index > -1 ){
			param = url.substr( index + 1 );
			url = url.substr( 0,index )
		}

		$('#backGround').height( $(document).height() ).fadeIn('fast',function(){
				$('html').animate({ scrollTop: 0 }, 'fast', function(){
					content.fadeIn('fast',function(){
						$.ajax({
							url: url,
							data: param,
							dataType: 'html',
							type: ( index > -1 ? 'POST' : 'GET' ),
							beforeSend: function(){
								loading( false );
							},
							success: function( response ){
								main.append( response );

								Modal.fixHeight();

								if( $.isFunction( callBack ) ){
									callBack();
								}
							},
							error: function( xhr ){
								main.append('<p>'+ xhr.statusText +'</p>');
							},
							complete: function(){
								loading( true );
							}
						});
					});
				});
			}
		);
	},
	close: function( callBack ){
		// FADEOUT OF THE CONTENT
		$('#content').fadeOut( 'fast',function(){
			$(this)
				// RESIZE TO NATURAL SIZE
				.css({ height:'50%', width: '50%', left: '25%', top: '25%' })

				// CLEAN THE CONTENT DIV
				.children('div.main').empty();

			// BACK TO SCROLL POSITION
			$('html').animate({ scrollTop: Modal.status.positionTop }, 'fast', function(){
				// FADEOUT OF BACKGROUND
				$('#backGround').fadeOut( 'fast',function(){
					// RESET THE SCROLL POSITION
					Modal.status.positionTop = 0;

					// RESET THE MODAL TYPE
					Modal.status.type = 'small';

					// CALLBACK FUNCTION
					if( $.isFunction( callBack ) ){
						callBack();
					}
				} );
			});
		} );
	}
};

// FIX THE BACKGROUND HEIGHT
window.onresize = function(){
	// FIX THE BACKGROUND HEIGHT
	$('#backGround').height(0).height( $(document).height() );

	// FIX THE MODAL HEIGHT
	Modal.fixHeight();
}

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

// SQL ERROR MESSAGE
function printError(cod,message,sql){
 	if( $.browser.mozilla && typeof window.console == 'object' ){
		console.group('MySQL Error');
			console.error( cod,': ',message );
			if( sql )
				console.info( sql );
		console.groupEnd('MySQL Error');
	} else {
		alert( cod + ': ' + message );
		if( sql ){
			alert( sql );
		}
	}
}

// TOGGLE MODAL LOADING
function loading( remove ){
	var content = $( 'div.main' );
	if( remove ){
		content.find('div.loading').remove();
	} else {
		content.empty().append('<div class="loading">Loading...</div>');
	}
}
