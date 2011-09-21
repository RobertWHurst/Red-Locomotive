jQuery(function(){

	var modules = jQuery('#modules'),
		content = jQuery('#content');

	//align sidebar and content
	setInterval(function(){

		var sidebar = jQuery('#sidebar').css('height', 'auto'),
			content = jQuery('#content').css('height', 'auto');

		if(sidebar.height() > content.height()) {
			content.height(sidebar.height());
		} else {
			sidebar.height(content.height());
		}
	}, 100);

	//renders the content pane
	function buildContent(data, breadCrumb) {

		//clear the content
		content.html('');

		var args = '';

		if(data.arguments) {
			for(var i = 0; i < data.arguments.length; i += 1) {
				args += (typeof data.arguments[i]["default"] !== 'undefined' ? '<span class="optional">[' + data.arguments[i].name + ']</span>' : data.arguments[i].name);
				if(i < data.arguments.length - 1) {
					args += ', ';
				}
			}
		}

		//create a content title
		jQuery('<h1>' + (data.isModule && 'Module - ' || '') + data.name + (!data.methods && !data.objects && '()' || !data.isModule && '{}' || '') + '</h1>').appendTo(content);

		//set the description
		if(data.description) {
			jQuery('<h3>Description:</h3><p>' + data.description + '</p>').appendTo(content);
		}

		//add the bread crumb
		if(!data.isModule) {
			jQuery('<h3>Usage:</h3>').appendTo(content);
			jQuery('<h4>' + breadCrumb + '.' + data.name + (data.methods || data.objects ? '' : '(<span class="arguments">' + args + '</span>)') + '</h4>').appendTo(content);
		}

		//build the arguments table
		if(data.arguments) {
			(function(){

				jQuery('<h3>Arguments:</h3>').appendTo(content);
				var table = jQuery('<table><thead><tr><tr><th>Position</th><th>Name</th><th>Accepts</th><th>Default</th><th>Description</th></tr></thead></table>').appendTo(content);

				for(var i = 0; i < data.arguments.length; i += 1) {

					var type = '',
						name = data.arguments[i].name,
						argDefault = (typeof data.arguments[i]["default"] !== 'undefined' ? data.arguments[i]["default"] : 'none'),
						description = (typeof data.arguments[i]["default"] !== 'undefined' ? '(optional) ' : '') + (data.arguments[i].description || '');

					//get the argument types
					if(typeof data.arguments[i].type === 'object') {
						for(var ii = 0; ii < data.arguments[i].type.length; ii += 1) {
							type += data.arguments[i].type[ii];
							if(ii < data.arguments[i].type.length - 1) {
								type += ', ';
							}
						}
					} else {
						type = (data.arguments[i].type || '?');
					}

					jQuery('<tr><td class="position">' + i + '</td><td class="name">' + name + '</td><td class="type">' + type + '</td><td class="default">' + argDefault + '</td><td class="description">' + description + '</td></tr>').appendTo(table);

					args += data.arguments[i].name;
					if(i < data.arguments.length - 1) {
						args += ', ';
					}
				}
			})();
		}

		//build the return table
		if(data.returns) {

			jQuery('<h3>Returns:</h3>').appendTo(content);
			(function(){
				var name = (data.returns.name || '?'),
					type = (data.returns.type || '?'),
					description = (data.returns.description || '');

				jQuery('<table><thead><tr><tr><th>Name</th><th>Type</th><th>Description</th></tr></thead><tr><td class="name">' + name + '</td><td class="type">' + type + '</td><td class="description">' + description + '</td></tr></table>').appendTo(content);

			})();
		}

		//output the doc source
		jQuery('<h3 class="source">Doc Source:</h3><code id="JSONDATA">' + JSON.stringify(data) + '</code>').appendTo(content);

	}

	//renders a link tree for the sidebar
	function handleObject(data, target, heading, breadCrumb) {

		breadCrumb = breadCrumb || '';

		//add the heading
		if(heading) {
			jQuery('<li>' + heading + '</li>').appendTo(target);
			target = jQuery('<ul></ul>').appendTo(target);
		}

		//loop through each module and create a link for it
		for(var i = 0; i < data.length; i += 1) {

			//grab the module data
			var object = data[i],

			//create a list item and link for the current object
			listItem = createLink(object, target, breadCrumb);

			//extend the bread crumb
			var objBreadCrumb = '';
			if(object.name && !object.isModule) {
				objBreadCrumb = breadCrumb + '.' + object.name;
			} else {
				objBreadCrumb = breadCrumb;
			}

			if(object.methods || object.objects) {

				//create a list
				var list = jQuery('<ul></ul>').appendTo(listItem);

				if(object.methods) {
					//the method links
					createMethodLinks(object.methods, list, 'Methods:', objBreadCrumb);
				}

				if(object.objects) {
					//handle any sub elements
					handleObject(object.objects, list, 'Objects:', objBreadCrumb);
				}
			}
		}
	}

	//creates links for an array of methods
	function createMethodLinks(methods, target, heading, breadCrumb) {

		//add the heading
		if(heading) {
			jQuery('<li>' + heading + '</li>').appendTo(target);
			target = jQuery('<ul></ul>').appendTo(target);
		}

		for(var i = 0; i < methods.length; i += 1) {
			var method = methods[i];

			//create a link for the method
			createLink(method, target, breadCrumb);
		}
	}

	//creates a link method the executes a callback when clicked
	function createLink(object, target, breadcrumb) {
		return jQuery('<li><a href="#' + object.name.toLowerCase().replace(/\s/g, '') + '" title="' + (object.description || object.name) + '">' + object.name + '</a></li>')
			.click(function(event) {
				event.stopPropagation();
				buildContent(object, breadcrumb);
			})
			.appendTo(target);
	}

	jQuery.ajax({
		"url": "modules.json",
		"dataType": "json",
		"success": function (data) {
			handleObject(data, modules);
		}
	});

});