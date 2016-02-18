/* popup.js */
var showInDetailpage = document.getElementById("showInDetailpage");
var showInTimeline = document.getElementById("showInTimeline");
var openWithReturnKey = document.getElementById("openWithReturnKey");

window.onload = function(){
	// 最初はどっちも機能オンであってほしい
	// 最初は値が入っていないので、「if isfalseでないなら機能オン」とする
	if(localStorage["showInDetailpage"] != "isfalse") {
		showInDetailpage.checked = true;
	}
	else {
		showInDetailpage.checked = false;
	}
	if(localStorage["showInTimeline"] != "isfalse") {
		showInTimeline.checked = true;
	}
	else {
		showInTimeline.checked = false;
	}
	if(localStorage["openWithReturnKey"] != "isfalse") {
		openWithReturnKey.checked = true;
	}
	else {
		openWithReturnKey.checked = false;
	}
	// document.getElementById("res").innerHTML = showInDetailpage.checked.toString() + showInTimeline.checked.toString() + ":" + localStorage["showInDetailpage"] + localStorage["showInTimeline"];
}

document.getElementById("save").onclick = function() {
	localStorage["showInDetailpage"] = "is" + (showInDetailpage.checked.toString());
	localStorage["showInTimeline"] = "is" + (showInTimeline.checked.toString());
	localStorage["openWithReturnKey"] = "is" + (openWithReturnKey.checked.toString());
	chrome.tabs.query(null, function(result) {
		for(i=0; i<result.length; i++) {
			chrome.tabs.sendMessage(result[i], {method: "OPTION_UPDATED"});
		}
	});
	// document.getElementById("res").innerHTML = showInDetailpage.checked.toString() + showInTimeline.checked.toString() + ":" + localStorage["showInDetailpage"] + localStorage["showInTimeline"];
}
