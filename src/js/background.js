/* background.js */

// バックグラウンドで実行される

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if (request.method == 'GET_LOCAL_STORAGE') {
		sendResponse({data: localStorage[request.key]})
		// console.log(request.key + " : " + localStorage[request.key])
	}
	else {
		sendResponse({data: 'none'}) // snub them.
	}
})
