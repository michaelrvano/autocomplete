# jQuery Auto Complete function
A simple autocomplete function to use on any text input. jQuery required. 

###Live Demo:
http://af13.ca/autocomplete

###Example code to initialize the autocomplete:

```
$(el).mvAutocomplete(options);
```


##The options that can be passed into the function are as follows:

callback: A function to run when a result has been clicked/selected

container_class: The class that will be used on the container element holding the results. Default is "results".

data: An array of string that will be searched through. Default is an empty object.

loading_html: The HTML that will be shown in the results container while waiting for the return of the post data. Default is "Loading...".

post_data: To go together with the url option. Pass an object that will be passed along with the value inputted into the text box. "{query: string}" will be appended to this post_data object. Default is just {query: string}.

result_class: The class that will be used on each individual result. Default is "result".

url: The url to send a post request at, which, will, return the results. Default is an empty string. This takes priority over the "data" option.



##Sample Code with all Options:
```
$(el).mvAutocomplete({
	callback: function() {
		console.log('Click Back!');
	},
	container_class: 'special-results',
	data: ['string', 'another one', 'city name', 'someone name'], //can be variable used here as well
	loading_html: 'Loading...Spinner',
	post_data: {
		name: 'Something',
		field: 'Another',
		category: 2
	},
	result_class: 'my-result',
	url: '/api/query'
});
```


##Other notes:
- Still working on create a keypress action to navigate through the results.
- Works only on text inputs. 
- by default, I have the class "active" being placed on the result that gets selected or hovered over. Used mainly to highlight the selected item.
- also by default, I attached the "autocomplete" attribute to the input text box to disable the browser's default auto complete
- The url should return a single array of strings. No multi-dimensional arrays. Too complex. :p
- Can work on multiple text inputs, if for example, if two input elements have the class "ac" and you used that to run the function ( i.e $('.ac').mvAutocomplete(); ). Both of those inputs will have the exact same functionality
- To have 2 separate text inputs do separate autocomplete searches, each one has to be referenced differently. 
- This is mainly for my own use, but feel free to grab it and modify it. I don't mind. All open source. Would be nice if you kept my name in the javascript file. :p
- May try and add more options in the future, like method type and Headers to pass if using straight Ajax request
