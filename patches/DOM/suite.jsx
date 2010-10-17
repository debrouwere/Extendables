Submenu.prototype.get_or_add = function (menu_title) {
	var item = this.menuItems.item(menu_title);
	
	if (!item.hasOwnProperty('title')) {
		var action = app.scriptMenuActions.add(menu_title);	
		item = this.menuItems.add(action);		
	}

	return item;
}