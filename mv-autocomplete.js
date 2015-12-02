/*
* Written by Michael Vano
* Front End Developer
*/


/* ===================
- OPTIONS -
data: an array or object with a list of data already loaded. Should not be multidimensional array

url: use this to grab from a url that will return a list of an array or list of object based on the query sent.
	URL should accept 'query' as a POST field name.

container_class: class used on the container displaying the results

result_class: class to be used on each of the result items

=====================*/
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
	_this.data = (typeof options.data !== typeof undefined) ? options.data : {};
	_this.url = (typeof options.url !== typeof undefined) ? options.url : '';
	_this.container_class = (typeof options.container_class !== typeof undefined) ? options.container_class : '';
	_this.result_class = (typeof options.result_class !== typeof undefined) ? options.result_class : '';
	_this.results = [];
	_this.post_data = (typeof options.post_data !== typeof undefined) ? options.post_data : {};
	_this.callback = (typeof options.callback !== typeof undefined && typeof options.callback === 'function') ? options.callback : '';
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
	if (value != '')
	{
		_this.results = [];
		if (_this.url != undefined && _this.url != '')
		{
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
					if (v.indexOf(value) > -1) { _this.results.push(v); }
				});
				_this.showResults();
			}
		}
	}
};

Autocomplete.prototype.showResults = function() {
	var _this = this;
	if (_this.results.length > 0)
	{
		console.log('Results!!');
	}
	else
	{
		console.log('No Results');
	}
};