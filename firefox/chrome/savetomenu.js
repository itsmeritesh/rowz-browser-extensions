if (typeof rowzPopupMenu == "undefined") {  
 var rowzPopupMenu = {
        showFirefoxContextMenu : function(event){
		document.getElementById("save-to-rowz").hidden = gContextMenu.isTextSelected;
	},
	onFirefoxLoad : function(event){
		document.getElementById("contentAreaContextMenu").addEventListener("popupshowing", function (e) {
		 	this.showFirefoxContextMenu(e); 
		 }, false);
	
	}
 };
};

window.addEventListener("load", rowzPopupMenu.onFirefoxLoad, false);

