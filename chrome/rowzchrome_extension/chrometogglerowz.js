function toggle() {	
	var resultBlock = document.getElementById("RowzFFExtensionDynamicContainer");
	var toggleControl = document.getElementById("RowzFFToggle");
	if (resultBlock.style.display == "") {
		document.getElementById("RowzFFExtensionDynamicContainer").style.display = "none";
		toggleControl.innerHTML = "<img src=\"http://rowz.in/images/maximize.png\"/> Open Rowz Search Panel";
	} else {
		document.getElementById("RowzFFExtensionDynamicContainer").style.display = "";
		toggleControl.innerHTML = "<img src=\"http://rowz.in/images/minimize.png\"/> Hide Rowz Search Panel";
	}
 };