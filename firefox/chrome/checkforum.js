window.addEventListener("load", function() { myExtension.init(); }, false);

//make this false to remove all logging
var debug = false;

 function getRequestParameter(URL, name){
   if(name=(new RegExp('[?&]'+encodeURIComponent(name)+'=([^&]*)')).exec(URL))
      return decodeURIComponent(name[1]);
 }
  
 function appendRowzFrame(doc,q, showPanel, count){
		var control = doc.createElement("div");
		control.id = "RowzFFDisplayControl";
		control.style.padding ="0px 3px";
		control.style.position = "fixed";
		control.style.backgroundColor ="#F0F0F0";
		control.style.border ="1px solid #333333";
		control.style.color="#333333";
		control.style.bottom="0";
		control.style.zIndex = "99" ;
		control.style.width ="450px";
		control.style.height="20px";
		control.style.right = "10px";
		doc.body.appendChild(control);

		

		var controlString = "Open Rowz Search Panel";
		var controlImageSrc = "chrome://firefox_extension/content/maximize.png";
		
		if (showPanel == true){
			controlString = "Hide Rowz Search Panel"
			controlImageSrc = "chrome://firefox_extension/content/minimize.png";
			control.innerHTML = "<a id=\"RowzFFToggle\" style=\"text-decoration:none;color:#333333\" href=\"javascript:toggle()\"><img border=\"0\" src=\""+controlImageSrc+"\">"+ controlString +"</a>";
		}
		else {
			var resultsCountSpan = "<span style='padding:3px;background-color:#CC3C29;color:#FFFFFF'><b>"+ count +"</b></span> &nbsp;";
			control.innerHTML = "<a id=\"RowzFFToggle\" style=\"text-decoration:none;color:#333333\" href=\"javascript:toggle()\">"+ resultsCountSpan +"<img border=\"0\" src=\""+controlImageSrc+"\">&nbsp;"+ controlString +"</a>";
			
		}
			
		var n = doc.createElement("div");

		n.style.position = "fixed";

		n.id = "RowzFFExtensionDynamicContainer";			
		n.style.border ="1px solid #333333";
		n.style.backgroundColor = "#F0F0F0";
		n.style.color="#333333";
		n.style.bottom="21px";
		n.style.zIndex = "98" ;
		n.style.width ="450px";
		n.style.height="450px";
		n.style.right="10px";

		n.style.display = "none";	
		if (showPanel == true){
			n.style.display = "block";	
		}				

		n.style.padding ="0px 3px";				
		doc.body.appendChild(n);
		
		n.innerHTML = "<iframe src=\"http://rowz.in/firefox/searchIntegration?query="+ q + "\" width=\"450\" height=\"448\"  style=\"border:0px\"/> " ;		
	 
 }

var myExtension = {
  init: function() {
    var appcontent = document.getElementById("appcontent");   // browser
    if(appcontent)
      appcontent.addEventListener("DOMContentLoaded", myExtension.onPageLoad, true);
    var messagepane = document.getElementById("messagepane"); // mail
    if(messagepane)
      messagepane.addEventListener("load", function() { myExtension.onPageLoad(); }, true);
  },

  onPageLoad: function(aEvent) {
    var doc = aEvent.originalTarget; // doc is document that triggered "onload" event
    // do something with the loaded page.
    // doc.location is a Location object (see below for a link).
    // You can use it to make your code executed on certain pages only.
    
	var togglerowzscript = doc.createElement("script");
	togglerowzscript.type = "application/javascript";
	togglerowzscript.src = "chrome://firefox_extension/content/togglerowz.js";
	var headvar = doc.getElementsByTagName("head")[0];
	headvar.appendChild(togglerowzscript);

	if(debug) Firebug.Console.log("DOM Load done");
    var rex = new RegExp("^(((http|https)(:\/\/))|(www)(\.)|((http|https)(:\/\/))(www)(\.))(google|bing)");
    
    if(debug) Firebug.Console.log("doc.location.href = " + doc.location.href);
    if(debug) Firebug.Console.log("doc.location.search = " + doc.location.search);
    if(debug) Firebug.Console.log("Reg Ex Match: " + rex.test(doc.location.href));
    
    if(rex.test(doc.location.href) && aEvent.originalTarget.nodeName == "#document")
	{
		var q = "";
		q = getRequestParameter(doc.location.search,"q");
		if(debug) Firebug.Console.log("query string =" + q);
		if(q!="" && q!=undefined) { 

			//check if there are any results, only then show the pane
			var req = new XMLHttpRequest();
			req.open('GET', 'http://rowz.in/getNumberOfResultsForQuery?query='+q, true);
			req.onreadystatechange = function (aEvt) {
			  if (req.readyState == 4) {
			     if(req.status == 200){			      
			      var resObject = eval('('+req.responseText+')');			      
				  var showPanel = resObject.min;				  
				  var noOfResults = resObject.nor;				  
			      if(noOfResults!=null && !isNaN(noOfResults) && noOfResults>0){
			    	  appendRowzFrame(doc,q,showPanel,noOfResults);
			      }
			     }			     
			  }
			};
			req.send(null);				
		}
	}      

    
    // add event listener for page unload 
    aEvent.originalTarget.defaultView.addEventListener("unload", function(){ myExtension.onPageUnload(); }, true);
  },

  onPageUnload: function(aEvent) {
    // do something
  }
}

