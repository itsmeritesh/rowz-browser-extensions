selectedtextsearchcontextmenu.onFirefoxLoad = function(event){
	document.getElementById("contentAreaContextMenu")
	.addEventListener("popupshowing", function (e){ selectedtextsearchcontextmenu.showFirefoxContextMenu(e); }, false);
	
};

selectedtextsearchcontextmenu.showFirefoxContextMenu = function(event){
	document.getElementById("save-to-rowz").hidden = gContextMenu.isTextSelected;
};

window.addEventListener("load", selectedtextsearchcontextmenu.onFirefoxLoad, false);

