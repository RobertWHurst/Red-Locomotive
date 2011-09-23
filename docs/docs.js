jQuery(function(){

	var modules = jQuery('#modules'),
		content = jQuery('#content'),

		pages = {};

	(function MaintainColumnHeight(){

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

	})();

	function LoadCurrentHash() {
		if(location.hash) {
			var page = location.hash.substr(1);
			if(pages[page]) {
				console.log(page);
				content.html('').append(pages[page]);
			}
		}
	}

	//renders the content pane
	function buildContent(data, path) {

		function pageTitle() {
			
			//the suffix
			var suffix = (data.arguments && '()' || ''),

			//the prefix
				prefix = (data.moduleName && 'Module - ' || '');

			//the title
			return jQuery('<h1>' + prefix + (data.name || data.moduleName) + suffix + '</h1>');

		}

		//builds an arguments table for methods
		function argumentsTable() {

			//make sure there are arguments
			if(data.arguments) {

				//create a wrapping div
				var container = jQuery('<div id="argumentsTable"></div>'),

				//create a heading
					heading = jQuery('<h3>Arguments:</h3>'),
				
				//create the table elements
					tableElement = jQuery('<table></table>'),
					tableHead = jQuery('<thead><tr><th></th><th>Name</th><th>Accepts</th><th>Default</th><th>Description</th></tr></thead>'),
					tableBody = jQuery('<tbody></tbody>');

				//create each argument row
				for(var i = 0; i < data.arguments.length; i += 1) {

					//grab the argument
					var argumentData = data.arguments[i],

					//collect some info about the arguments and build table cells
						row = jQuery('<tr id="arg-' + i + '" class="argument"></tr>'),
						position = jQuery('<td class="position">' + i + '</td>'),
						name = jQuery('<td class="argument name">' + argumentData.name + '</td>'),
						description = jQuery('<td class="argument description">' + (argumentData.description || '') + '</td>'),
						defaultValue = jQuery('<td class="argument default">' + (argumentData["default"] || '') + '</td>'),
						allowedTypes = '';

					//generate the allowed 'type' cell
					if(argumentData.type) {
						if(typeof argumentData.type === "object") {
							for(var ii = 0; ii < argumentData.type.length; ii += 1) {
								allowedTypes += argumentData.type[ii];
								if(ii < argumentData.type.length - 1) {
									allowedTypes += ', ';
								}
							}
						} else {
							allowedTypes = argumentData.type;
						}
					} else {
						allowedTypes = '?';
					}
					allowedTypes = jQuery('<td class="type">' + allowedTypes + '</td>');

					//add the row to the table
					tableBody.append(row.append(position, name, allowedTypes, defaultValue, description));
				}

				//assemble and return the new table
				return container.append(heading, tableElement.append(tableHead, tableBody));
			}

			return false;
		}

		//builds an arguments table for methods
		function returnsTable() {

			//make sure there are arguments
			if(data.returns) {

				//create a wrapping div
				var container = jQuery('<div id="returnsTable"></div>'),

				//create a heading
					heading = jQuery('<h3>Returns:</h3>'),
				
				//create the table elements
					tableElement = jQuery('<table></table>'),
					tableHead = jQuery('<thead><tr><th>Name</th><th>Type</th><th>Description</th></tr></thead>'),
					tableBody = jQuery('<tbody></tbody>'),

					//collect some info about the arguments and build table cells
					row = jQuery('<tr id="returns" class="return"></tr>'),
					name = jQuery('<td class="return name">' + data.returns.name + '</td>'),
					desc = jQuery('<td class="return description">' + (data.returns.description || '') + '</td>'),
					type = jQuery('<td class="type">' + data.returns.type + '</td>');

				//assemble and return the new table
				return container.append(heading, tableElement.append(tableHead, tableBody.append(row.append(name, type, desc))));
			}

			return false;
		}

		function methodUsage() {

			if(!data.objects && !data.moduleName) {

				//create a wrapping div
				var container = jQuery('<div id="usageExample"></div>'),

				//create a heading
					heading = jQuery('<h3>Usage:</h3>'),

					usagePath = '.' + path.split('-')[1];

				//create the usage example
					usage = (!data.isGlobal && usagePath || data.name);

				//make sure there are arguments
				if(data.arguments) {
					usage += '(';
					for(var i = 0; i < data.arguments.length; i += 1) {
						var argumentData = data.arguments[i];

						//mash the argument name on to the end of the usage string
						usage += (typeof argumentData["default"] !== 'undefined' && '<span class="argument optional">[' + argumentData.name + ']</span>' || '<span class="argument">' + argumentData.name + '</span>');

						if(i < data.arguments.length - 1) {
							usage += ', '
						}
					}
					usage += ')';
				} else {
					usage = usage.substring(0, usage.length - 1);
				}

				//wrap the usage example in a heading 4 tag
				usage = jQuery('<h4>' + usage + '</h4>');

				//assemble and return
				return container.append(heading, usage);

			}

			return false;
		}

		function parseDescription() {
			
			//create a wrapper
			var container = jQuery('<div id="description"></div>'),

			//TODO: Parse with markdown
			//	description = jQuery('<p>' + markdown(data.description) + '</p>');
				description = jQuery('<p>' + data.description + '</p>');

			return container.append(description);
		}

		function pageJSONBlock() {
			return jQuery('<div class="JSON"><h3 class="source">Doc Source:</h3><code id="JSONDATA">' + JSON.stringify(data) + '</code></div>');
		}

		function parseBody() {
			if(data.body) {

				//create a wrapper
				var container = jQuery('<div id="body"></div>'),

				//TODO: Parse with markdown
				//	body = jQuery('<p>' + markdown(data.body) + '</p>');
					body = jQuery('<p>' + data.body + '</p>');

				return container.append(body);
			}

			return false;
		}

		function pageJSONBlock() {
			return jQuery('<div class="JSON"><h3 class="source">Doc Source:</h3><code id="JSONDATA">' + JSON.stringify(data) + '</code></div>');
		}

		var page = jQuery('<div></div>'),
			title = pageTitle(),
			description = parseDescription(),
			body = parseBody(),
			usage = methodUsage(),
			args = argumentsTable(),
			returns = returnsTable(),
			json = pageJSONBlock();

			page.append(title, description);

			if(usage) {
				page.append(usage);
			}

			if(args) {
				page.append(args);
			}

			if(returns) {
				page.append(returns);
			}

			if(body) {
				page.append(body);
			}

			page.append(json);

			//return the new page
			return page.children();

	}

	function createSection(heading) {

		//set the heading
		var heading = jQuery('<li>' + heading + '</li>'),
			listElement = jQuery('<ul></ul>');

		//add the heading to the list element
		heading.append(listElement);

		//return the section
		return heading;
	}

	//renders a link tree for the sidebar
	function createObjectLinks(data, parent, parentPath) {

		//if the tree has not started create it
		parentPath = parentPath || '';

		//create a heading for the object
		if(parentPath) {

			//create a section
			var list = createSection('Objects:');
			parent.append(list);

			//shift the parenthood to the new section
			parent = list.find('ul:first');

		}

		//loop through each object and create a link for it
		for(var i = 0; i < data.length; i += 1) {

			//grab the object data
			var objectData = data[i],

			//add this object to the tree
				path = parentPath + (objectData.name && objectData.name + '.' || objectData.moduleName + '-'),

			//create a list item and link for the current object
				listItem = createLink(objectData, path);

			//build the page content
			pages[path] = buildContent(objectData, path);

			//append the list item to the document
			parent.append(listItem);

			if(objectData.methods || objectData.objects) {

				//create a list
				var list = jQuery('<ul></ul>').appendTo(listItem);

				if(objectData.methods) {
					//the method links
					createMethodLinks(objectData.methods, list, path);
				}

				if(objectData.objects) {
					//handle any sub elements
					createObjectLinks(objectData.objects, list, path);
				}
			}
		}
	}

	//creates links for an array of methods
	function createMethodLinks(data, parent, parentPath) {

		//create a section
		var list = createSection('Methods:');
		parent.append(list);

		//shift the parenthood to the new section
		parent = list.find('ul:first');

		for(var i = 0; i < data.length; i += 1) {
			var methodData = data[i],

				//update the path
				path = parentPath + methodData.name,

			//create a link for the method
				listItem = createLink(methodData, path);

			//build the page content
			pages[path] = buildContent(methodData, path);

			//attach the new list item
			parent.append(listItem);

		}
	}

	//creates a link method the executes a callback when clicked
	function createLink(data, path) {

		//set some variables
		var hash = '#' + path,
			title = data.description || data.name,
			name = data.name || data.moduleName,

		//create the new dom nodes
			listItemElement = jQuery('<li></li>'),
			anchorElement = jQuery('<a href="' + hash + '" title="' + title + '">' + name + '</a>');

		//pair the list item and the anchor
		listItemElement.append(anchorElement);

		//return the list item
		return listItemElement;
	}

	//get the json data
	jQuery.ajax({
		"url": "modules.json",
		"dataType": "json",
		"success": function (data) {
			createObjectLinks(data, modules);
			LoadCurrentHash();
			jQuery(window).bind('hashchange', LoadCurrentHash);
		}
	});

});