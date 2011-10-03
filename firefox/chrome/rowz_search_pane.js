window.addEventListener("load", function() { myExtension.init(); }, false);

if (typeof rowzExtension == "undefined") {  
  var rowzExtension = {  
   //make this false to remove all logging//make this false to remove all logging
   debug:false,
   
   
   appendToggleScriptToHead : function(doc){
  	var togglerowzscript = doc.createElement("script");
	togglerowzscript.type = "application/javascript";
	togglerowzscript.src = "chrome://firefox_extension/content/togglerowz.js";
	
	var headvar = doc.getElementsByTagName("head")[0];
   	headvar.appendChild(togglerowzscript);
  },
   
   //function that creates the popup when people hit Save to Rowz
   bookmarkThisPage:function(){

	var doc = window.content.document; //this gets the current window's document.
	
	Q=doc.selection?doc.selection.createRange().text:doc.getSelection();

	var title=doc.title;
	var url=window.content.location.href;

 
	var callString='http://rowz.in/firefox/save?'; //edit this to required url
	callString+='title='+encodeURIComponent(title);
	callString+='&url='+encodeURIComponent(url);
	callString+='&description='+encodeURIComponent(Q);

	newWin = window.open(callString,'newWin','toolbar=no,status=no,menubar=no,location=no,scrollbars=no,resizable=no,height=440,width=610');

	newWin.opener = top;

   },
   
   
   //function to get request parameters from a url
   getRequestParameter: function(URL, name){
   	if(name=(new RegExp('[?&]'+encodeURIComponent(name)+'=([^&]*)')).exec(URL))
      return decodeURIComponent(name[1]);
   },
	
   
   //function to populate the Control element for the search pane
   populateControlPanel: function(doc, showPanel, count){
   	//creates the appropriate elements for Control if minimized mode is selected	

	var toggleLink = doc.createElement('a');
	toggleLink.id = "RowzFFToggle";
	toggleLink.setAttribute('href', 'javascript:rowzExtensionToggle.toggle()');
	toggleLink.style.textDecoration = "none";
	toggleLink.style.color="#333333";
	
	if(showPanel == true){		
		var ig = doc.createElement('img');
		ig.setAttribute('src','chrome://firefox_extension/content/minimize.png');
		ig.setAttribute('border','0');		
		toggleLink.appendChild(ig);
		toggleLink.appendChild(doc.createTextNode('Hide Rowz Search Panel'));
		return toggleLink;		
	}
	else{
		var resultCount = doc.createElement('span');
		resultCount.style.padding = "3px";
		resultCount.style.backgroundColor ="#CC3C29";
		resultCount.style.color="#FFFFFF";
		resultCount.style.marginRight = "3px";

		var boldContent = doc.createElement('b');
		boldContent.appendChild(doc.createTextNode(count));
		resultCount.appendChild(boldContent);
		
		toggleLink.appendChild(resultCount);
		
		var ig = doc.createElement('img');
		ig.setAttribute('src','chrome://firefox_extension/content/maximize.png');
		ig.setAttribute('border','0');
		toggleLink.appendChild(ig);	
		
		toggleLink.appendChild(doc.createTextNode(' Open Rowz Search Panel'));
	}
	return toggleLink;
   },
   
   
   createPaneForQuery: function(doc, query){
	var pane = doc.createElement('iframe');
	pane.setAttribute('src','http://rowz.in/firefox/searchIntegration?query='+ query); 
	pane.setAttribute('width','450px');
	pane.setAttribute('height','448px');
	pane.style.border = "0px";
	return pane;
   },
  
  
   appendRowzFrame: function(doc,q, showPanel, count){
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
		
		var controlContent = this.populateControlPanel(doc, showPanel, count);
		control.appendChild(controlContent);
					
		var searchPaneDiv = doc.createElement("div");

		searchPaneDiv.style.position = "fixed";

		searchPaneDiv.id = "RowzFFExtensionDynamicContainer";			
		searchPaneDiv.style.border ="1px solid #333333";
		searchPaneDiv.style.backgroundColor = "#F0F0F0";
		searchPaneDiv.style.color="#333333";
		searchPaneDiv.style.bottom="21px";
		searchPaneDiv.style.zIndex = "98" ;
		searchPaneDiv.style.width ="450px";
		searchPaneDiv.style.height="450px";
		searchPaneDiv.style.right="10px";

		searchPaneDiv.style.display = "none";	
		if (showPanel == true){
			searchPaneDiv.style.display = "block";	
		}				

		searchPaneDiv.style.padding ="0px 3px";				
		doc.body.appendChild(searchPaneDiv);
		
		searchPaneDiv.appendChild(this.createPaneForQuery(doc,q));	
   }
	
  };    
};  

 
var myExtension = {		
		
  init: function() {
    var appcontent = document.getElementById("appcontent");   // FF only
    if(appcontent)
      appcontent.addEventListener("DOMContentLoaded", myExtension.onPageLoad, true);    
  },
  


  onPageLoad: function(aEvent) {
     var doc = aEvent.originalTarget; 
    // doc is document that triggered "onload" event
    // do something with the loaded page.
    // doc.location is a Location object (see below for a link).
    // You can use it to make your code executed on certain pages only.
    
	

	if(rowzExtension.debug) Firebug.Console.log("DOM Load done");
	
    var rex = new RegExp("^(((http|https)(:\/\/))|(www)(\.)|((http|https)(:\/\/))(www)(\.))(google|bing)");
    
    if(rowzExtension.debug) Firebug.Console.log("doc.location.href = " + doc.location.href);
    if(rowzExtension.debug) Firebug.Console.log("doc.location.search = " + doc.location.search);
    if(rowzExtension.debug) Firebug.Console.log("Reg Ex Match: " + rex.test(doc.location.href));
    
    if(rex.test(doc.location.href) && aEvent.originalTarget.nodeName == "#document")
	{
	        rowzExtension.appendToggleScriptToHead(doc);
		var q = "";
		q = rowzExtension.getRequestParameter(doc.location.search,"q");
		if(rowzExtension.debug) Firebug.Console.log("query string =" + q);
		if(q!="" && q!=undefined) { 

			//check if there are any results, only then show the pane
			var req = new XMLHttpRequest();
			req.open('GET', 'http://rowz.in/getNumberOfResultsForQuery?query='+q, true);
			req.onreadystatechange = function (aEvt) {
			  if (req.readyState == 4) {
			     if(req.status == 200){			      
			      var resObject = JSON.parse(req.responseText);			      
				  var showPanel = resObject.min;				  
				  var noOfResults = resObject.nor;				  
			      if(noOfResults!=null && !isNaN(noOfResults) && noOfResults>0){
			    	  rowzExtension.appendRowzFrame(doc,q,showPanel,noOfResults);
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

