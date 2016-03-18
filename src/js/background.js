/* background.js */
// var res = [];
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if (request.method == 'GET_LOCAL_STORAGE') {
		sendResponse({data: localStorage[request.key]});
		// for(var i in request.key) {
		// 	res[i] = localStorage[i];
		// }
		// sendResponse({data: res});
		// sendResponse({data: localStorage});
	}
	else {
		sendResponse({data: 'none'}); // snub them.
	}
});
