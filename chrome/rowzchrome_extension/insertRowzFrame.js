var isRunning = false;
function getRequestParameter(URL, name){
	   if(name=(new RegExp('[?&]'+encodeURIComponent(name)+'=([^&]*)')).exec(URL))
	      return decodeURIComponent(name[1]);
	 };
	 
function integrateToggleScript(){
	var togglerowzscript = document.createElement("script");
	var toggleScript = chrome.extension.getURL('chrometogglerowz.js');

	togglerowzscript.type = "application/javascript";
	togglerowzscript.src = toggleScript;
	var headvar = document.getElementsByTagName("head")[0];
	headvar.appendChild(togglerowzscript);
};

function showRowzFrame(query,showPanel, noOfResults){
	
	var control = document.createElement("div");
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
	document.body.appendChild(control);
	
	var controlString = "Open Rowz Search Panel";
	var controlImageSrc = "chrome://firefox_extension/content/maximize.png";
	
	if (showPanel == true){
		controlString = "Hide Rowz Search Panel"
		controlImageSrc = "chrome://firefox_extension/content/minimize.png";
		control.innerHTML = "<a id=\"RowzFFToggle\" style=\"cursor:pointer;text-decoration:none;color:#333333\" onclick=\"javascript:toggle()\"><img border=\"0\" src=\""+controlImageSrc+"\">"+ controlString +"</a>";
	}
	else{
		var resultsCountSpan = "<span style='padding:3px;background-color:#CC3C29;color:#FFFFFF'><b>"+ noOfResults +"</b></span> &nbsp;";
		control.innerHTML = "<a id=\"RowzFFToggle\" style=\"cursor:pointer;text-decoration:none;color:#333333\" onclick=\"javascript:toggle()\">"+ resultsCountSpan +"<img border=\"0\" src=\""+controlImageSrc+"\">&nbsp;"+ controlString +"</a>";
	}
	
	
	var n = document.createElement("div");

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
	n.innerHTML = "<iframe src=\"http://rowz.in/firefox/searchIntegration?query="+ query + "\" width=\"450\" height=\"448\"  style=\"border:0px\"/> " ;		
	document.body.appendChild(n);
};
	 
function checkForValidQuery(){
	var url = window.location.href;
	var query = getRequestParameter(url,'q');
	if(query!= undefined && query!='' && document.getElementById('RowzFFDisplayControl')==null){
		log('Query is =' + query);		
		
		proxyXHR({
			  method: 'GET',
			  url: 'http://rowz.in/getNumberOfResultsForQuery?query='+query,
			  onComplete: function(status, data) {
			    if (status == 200) {
			      log(data);
			      var resObject = eval('('+data+')');			      
				  var showPanel = resObject.min;				  
				  var noOfResults = resObject.nor; 
			      log('noOfResults =' + noOfResults);
			      if(noOfResults!=null && !isNaN(noOfResults) && noOfResults>0){
			    	  log('inside');
			    	  integrateToggleScript();
			  		  showRowzFrame(query,showPanel, noOfResults);
			      }
			    } 
			  }
		});						
	}
};


function init(){	
		checkForValidQuery();
};
// Change to true to get debug logs
function log(message){
	if(false)
		alert(message);
}
init();
