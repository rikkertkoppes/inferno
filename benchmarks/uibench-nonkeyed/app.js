(function() {
	"use strict";

	/* (flags, type, props, children, key, ref, noNormalise) */
	// Inferno.options.recyclingEnabled = true; // Advanced optimisation
	var createVNode = Inferno.createVNode;
	var linkEvent = Inferno.linkEvent;
	var name = Inferno.version + ' non-keyed';

	uibench.init('Inferno', name);
	document.title = 'Inferno' + name;

	function TreeLeaf(id) {
		return createVNode(1, 'li', 'TreeLeaf', id + '', null, null, null, true);
	}

	var shouldDataUpdate = {
		onComponentShouldUpdate: function (lastProps, nextProps) {
			return true;
		}
	};

	function TreeNode(data) {
		var length = data.children.length;
		var children = new Array(length);

		for (var i = 0; i < length; i++) {
			var n = data.children[i];

			if (n.container) {
				children[i] = createVNode(4, TreeNode, null, null, n, null, shouldDataUpdate, true);
			} else {
				children[i] = createVNode(4, TreeLeaf, null, null, n.id, null, shouldDataUpdate, true);
			}
		}
		return createVNode(66, 'ul', 'TreeNode', children, null, null, null, true);
	}

	var lastTreeData;

	function tree(data) {
		// if (data === lastTreeData) {
		// 	return Inferno.NO_OP;
		// }
		lastTreeData = data;
		return createVNode(1, 'div', 'Tree', createVNode(4, TreeNode, null, null, data.root, null, shouldDataUpdate, true), null, null, null, true);
	}

	function AnimBox(data) {
		var time = data.time % 10;
		var style = 'border-radius:' + (time) + 'px;' +
			'background:rgba(0,0,0,' + (0.5 + ((time) / 10)) + ')';

		return createVNode(1, 'div', 'AnimBox', null, { style: style, 'data-id': data.id }, null, null, true);
	}

	var lastAnimData;

	function anim(data) {
		// if (data === lastAnimData) {
		// 	return Inferno.NO_OP;
		// }
		lastAnimData = data;
		var items = data.items;
		var length = items.length;
		var children = new Array(length);

		for (var i = 0; i < length; i++) {
			var item = items[i];

			children[i] = createVNode(4, AnimBox, null, null, item, null, shouldDataUpdate, true);
		}
		return createVNode(66, 'div', 'Anim', children, null, null, null, true);
	}

	function onClick(text, e) {
		console.log('Clicked', text);
		e.stopPropagation();
	}

	function TableCell(text) {
		return createVNode(1, 'td', 'TableCell', text, { onClick: linkEvent(text, onClick) }, null, null, true);
	}

	function TableRow(data) {
		var classes = 'TableRow';

		if (data.active) {
			classes = 'TableRow active';
		}
		var cells = data.props;
		var length = cells.length + 1;
		var children = new Array(length);

		children[0] = createVNode(4, TableCell, null, null, '#' + data.id, null, shouldDataUpdate, true);

		for (var i = 1; i < length; i++) {
			children[i] = createVNode(4, TableCell, null, null, cells[i - 1], null, shouldDataUpdate, true);
		}
		return createVNode(66, 'tr', classes, children, { 'data-id': data.id }, null, null, true);
	}

	var lastTableData;

	function table(data) {
		// if (data === lastTableData) {
		// 	return Inferno.NO_OP;
		// }
		lastTableData = data;
		var items = data.items;
		var length = items.length;
		var children = new Array(length);

		for (var i = 0; i < length; i++) {
			var item = items[i];

			children[i] = createVNode(4, TableRow, null, null, item, null, shouldDataUpdate, true);
		}
		return createVNode(66, 'table', 'Table', children, null, null, null, true);
	}

	var lastMainData;

	function main(data) {
		// if (data === lastMainData) {
		// 	return Inferno.NO_OP;
		// }
		lastMainData = data;
		var location = data.location;
		var section;

		if (location === 'table') {
			section = table(data.table);
		} else if (location === 'anim') {
			section = anim(data.anim);
		} else if (location === 'tree') {
			section = tree(data.tree);
		}
		return createVNode(1, 'div', 'Main', section, null, null, null, true);
	}

	var i = 0;
	document.addEventListener('DOMContentLoaded', function(e) {
		var container = document.querySelector('#App');

		uibench.run(
			function(state) {
			  i++;

			  if (i === 33) {
			    debugger;
        }
				Inferno.render(main(state), container);

			// 	if (state.table && state.table.items && state.table.items) {
			// 	  var itemsLength = state.table.items.length;
		//
			// 	  if (itemsLength !== void 0 && document.querySelectorAll('tr').length !== itemsLength) {
			// 	    debugger;
        //   }
        // }
			},
			function(samples) {
				Inferno.render(
					createVNode(1, 'pre', null, JSON.stringify(samples, null, ' '), null, null, null, true), container
				);
			}
		);
	});
})();
