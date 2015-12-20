/* popup.js */
var showInDetailpage = document.getElementById("showInDetailpage");
var showInTimeline = document.getElementById("showInTimeline");

window.onload = function(){
	// 最初はどっちもtrueであってほしい
	// 最初は値が入っていないので、「if falseでなければ」としておく
	if(localStorage.showInDetailpage != "false") {
		showInDetailpage.checked = true;
	}
	else {
		showInDetailpage.checked = false;
	}
	if(localStorage.showInTimeline != "false") {
		showInTimeline.checked = true;
	}
	else {
		showInTimeline.checked = false;
	}
}

document.getElementById("save").onclick = function() {
	localStorage.showInDetailpage = showInDetailpage.checked.toString();
	localStorage.showInTimeline = showInTimeline.checked.toString();
}


