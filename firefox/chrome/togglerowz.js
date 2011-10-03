if (typeof rowzExtensionToggle == "undefined") {  
  var rowzExtensionToggle = {  
	toggle: function() {
		var resultBlock = document.getElementById("RowzFFExtensionDynamicContainer");
		var toggleControl = document.getElementById("RowzFFToggle");
		if (resultBlock.style.display == "block") {
			resultBlock.style.display = "none";
			toggleControl.innerHTML = "<img border=\"0\" src=\"chrome://firefox_extension/content/maximize.png\"/> Open Rowz Search Panel";
		} else {
			resultBlock.style.display = "block";
			toggleControl.innerHTML = "<img border=\"0\" src=\"chrome://firefox_extension/content/minimize.png\"/> Hide Rowz Search Panel";
		}
 	}
   };
 }; 

