function bookmarkThisPage(){

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

}

