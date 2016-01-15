/* background.js */
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if (request.method == "getLocalStorage")
	  sendResponse({data: localStorage[request.key]});
	else
	  sendResponse({data: "none"}); // snub them.
});
