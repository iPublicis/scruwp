jQuery(function(){
	Modal.initialize();
	
	$('#main tbody tr').remove();

	$.each(dados.history,function(h,hist){
		$('#main > tbody').append(
			'<tr class="'+ hist.id +'">' +
				'<td class="history">' +
					'<b>'+ hist.name +'</b><br />' +
					hist.text +
				'</td>' +
				'<td class="box"></td>' +
				'<td class="box"></td>' +
				'<td class="box"></td>' +
			'</tr>'
		);

		$.each( dados.tasks[h],function(t,task){
			$('#main > tbody > tr:last > td')
				.eq( task.status ).append(
				'<span class="dragBox">' +
					'<span class="text">' + task.text + '</span>' +
					'<span class="name">' + task.name + '</span>' +
				'</span>'
			).find('span.dragBox:last').data(
				'id',hist.id +','+ task.id
			);
		});
	});

	$('span.dragBox').draggable({
		grid: [ 10,10 ],
		opacity: 0.7,
		revert: true,
		zIndex: 666
	});

	$('td.box').droppable({
		accept: 'span.dragBox',
		drop: function(ev, ui) {
			var data = $( ui.draggable.get(0) ).data('id').split(',');
			var history = ui.element.get(0).parentNode.className;

			// CANCELA SE A HISTORIA FOR DIFERENTE
			if( data[0] != history )
				return false;

			// INSERE A TASK NA TABELA
			$(this).append( $(ui.helper[0]).css({
				'top': 0, 'left': 0
			}) );
		}
	});
});

var dados = {
	history: [
//		{ id: 0, name: 'Nome nº1', text: 'Lorem ipsum dolor sit amet' },
//		{ id: 1, name: 'Segunda', text: '$(this).append( $(ui.helper[0]).css({ "top": 0, "left": 0 });' }
	],
	tasks: [
//		[
//			{ id: 0, status: 1, text: 'Lorem ipsum dolor sit amet', name: 'primeiro' },
//			{ id: 1, status: 2, text: 'ipsum dolor sit amet', name: 'segundo' },
//			{ id: 2, status: 3, text: 'dolor sit amet', name: 'terceiro' }
//		],[
//			{ id: 3, status: 1, text: 'sit amet', name: 'quarto' },
//			{ id: 4, status: 2, text: 'amet', name: 'quinto' },
//			{ id: 5, status: 3, text: '...', name: 'sexto' }
//		]
	]
};

function addHistory(){
	Modal.load(
		'pages/addHistory.html','Adicionar História'
	);
}

function saveHistory(){
	var input = $('#content :input').serialize();

	$.ajax({
		url: 'includes/ajax.php',
		method: 'POST',
		data: input,
		dataType: 'json',
		success: function(){
			console.log(arguments);
		}
	});

	return false;
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

function loading( container,remove ){
	if( !remove ){
		$( container || '#content > div.main' ).empty().append('<div class="loading">Loading...</div>');
	} else {
		$( container || '#content > div.main > div.loading' ).remove();
	}
}

var Modal = {
	initialize: function(){
		$('#content > a.close').click( Modal.close );
	},
	open: function(){
		$('#backGround').fadeIn('slow');
		$('#content').fadeIn('fast');
	},
	load: function( url,title ){
		this.open();

		var content = $('#content > div.main');
		$('#content > span.header').html( title || '' );

		$.ajax({
			cache: true,
			url: url,
			dataType: 'html',
			beforeSend: function(){
				loading();
			},
			success: function( response ){
				loading(false,true);
				content.append( response );
			},
			error: function(xhr){
				loading(false,true);
				content.append('<p>'+ xhr.statusText +'</p>');
			}
		});
	},
	close: function(){
		$('#backGround').fadeOut('slow');
		$('#content').fadeOut('fast');
		$('#content > div.main').empty();
	}
};