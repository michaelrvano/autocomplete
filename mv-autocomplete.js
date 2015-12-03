/*
* Written by Michael Vano
* Front End Developer
* Visit https://github.com/michaelrvano/autocomplete for documentation on usage of this plugin
*/
(function ($) {
	$.fn.mvAutocomplete = function(options) {
		var options = (typeof options !== typeof undefined) ? options : {};
		if (this.length > 0)
		{
			for (i=0; i < this.length; i++)
			{
				new Autocomplete($(this[i]), options);
			}
		}
	};
}(jQuery));

var Autocomplete = function(el, options) {
	// console.log('Build Object');
	var _this = this;
	_this.el = el;
	_this.el.attr('mv-ac', '');
	_this.el.attr('autocomplete', 'off');
	_this.data = (typeof options.data !== typeof undefined) ? options.data : {};
	_this.url = (typeof options.url !== typeof undefined) ? options.url : '';
	_this.container_class = (typeof options.container_class !== typeof undefined) ? options.container_class : 'results';
	_this.result_class = (typeof options.result_class !== typeof undefined) ? options.result_class : 'result';
	_this.loading_html = (typeof options.loading_html !== typeof undefined) ? options.loading_html : 'Loading...';
	_this.results = [];
	_this.post_data = (typeof options.post_data !== typeof undefined) ? options.post_data : {};
	_this.callback = (typeof options.callback !== typeof undefined && typeof options.callback === 'function') ? options.callback : function() {};
	_this.html = $('<div class="'+_this.container_class+'" ac-results></div>');
	window.addEventListener('keyup', _this.keypress.bind(this), true);
	_this.processing;
	if (!_this.el.is('input[type="text"]')) 
	{
		_this.failed = true;
		console.log('This function needs to be placed on an input text box');
	}
	else
	{
		_this.el.keyup(function() { _this.search(); });
	}
};

Autocomplete.prototype.search = function() {
	// console.log('Search');
	var _this = this;
	var value = _this.el.val();
	var top = _this.el.offset().top;
	var left = _this.el.offset().left;
	var height = _this.el.outerHeight();
	var top_position = top+height+5;
	var inline_style = 'position:absolute; top:'+top_position+'px; left:'+left+'px; max-height:300px; overflow:auto;';
	if ($('[ac-results]').length > 0) { $('[ac-results]').remove(); }
	_this.html.attr('style', inline_style);
	if (value != '')
	{
		_this.results = [];
		if (_this.url != undefined && _this.url != '')
		{
			_this.html.html(_this.loading_html);
			_this.post_data.query = value;
			if (_this.processing != undefined) { _this.processing.abort(); }
			_this.processing = $.post(_this.url, _this.post_data, function(data){
				_this.results = data;
				_this.showResults();
			},'JSON');
		}
		else if (_this.data != undefined && !$.isEmptyObject(_this.data) && _this.data != '')
		{
			if (!$.isEmptyObject(_this.data))
			{
				$.each(_this.data, function(k,v) {
					if (v.toLowerCase().indexOf(value.toLowerCase()) > -1) { _this.results.push(v); }
				});
				_this.showResults();
			}
		}
		$('body').append(_this.html);
	}
};

Autocomplete.prototype.showResults = function() {
	var _this = this;
	if (_this.results.length > 0)
	{
		for(i=0; i<_this.results.length; i++) 
		{
			var result = '<div class="'+_this.result_class+'" ac-result="'+i+'">'+_this.results[i]+'</div>';
			if (i == 0) { _this.html.html(result); }
			else { _this.html.append(result); }
		}
		_this.html.find('[ac-result]').unbind('mouseover').mouseover(function() {
			$('[ac-result]').removeAttr('ac-active');
			$('[ac-result]').removeClass('active');
			$(this).attr('ac-active', '');
			$(this).addClass('active');
		});
		_this.html.find('[ac-result]').unbind('click').click(function() { _this.selectResult(); });
	}
	else
	{
		_this.html.html('');
		_this.html.hide();
	}
	
};

Autocomplete.prototype.selectResult = function() {
	console.log('Clicked Option');
	var _this = this;
	var selected = _this.html.find('[ac-active]');
	var text = selected.text();
	_this.el.val(text);
	_this.el.focus();
	_this.html.hide();
	_this.html.remove();
	_this.callback(_this.el, selected);
};

Autocomplete.prototype.keypress = function(e) {
	var _this = this;
	var keycode = e.keyCode;
	if (_this.html.is(':visible'))
	{
		switch(keycode)
		{
			case 40:
				e.preventDefault();
				e.stopPropagation();
				_this.navigate('down');
				console.log('Move Down!');
			break;
			case 38:
				e.preventDefault();
				e.stopPropagation();
				_this.navigate('up');
				console.log('Move Up!');
			break;
			case 13:
				e.preventDefault();
				e.stopPropagation();
				var active = _this.html.find('[ac-active]');			
				active.trigger('click');
			break;
		}
	}
};

Autocomplete.prototype.navigate = function(direction) {
	var _this = this;
	var results = _this.html.find('[ac-result]');
	var selected;
	if (results.length > 0)
	{
		for(i=0; i<results.length; i++) {
			if (results[i].hasAttribute('ac-active')) {
				selected = i;
			}
		}
		if (direction == 'up')
		{
			if (selected == 0) { selected = results.length - 1; }
			else if (selected == undefined) { selected = results.length - 1;}
			else { selected--; }
		}
		else if (direction == 'down')
		{
			if (selected == (results.length - 1)) { selected = 0; }
			else if (selected == undefined) { selected = 0;}
			else { selected++; }
		}
		$(results[selected]).trigger('mouseover');
	}
};

$(document).mouseup(function (e)
{
	var container = $('[ac-results], [mv-ac]');
	if (!container.is(e.target) && container.has(e.target).length === 0) 
	{
		$('[ac-results]').hide();
		$('[ac-results]').remove();
	}
});