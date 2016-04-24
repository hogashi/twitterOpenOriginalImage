/* popup.js */
var showOnTweetDetail = document.getElementById('SHOW_ON_TWEET_DETAIL');
var showOnTimeline = document.getElementById('SHOW_ON_TIMELINE');
var openWithKeyPress = document.getElementById('OPEN_WITH_KEY_PRESS');
var showOnTweetdeckTimeline = document.getElementById('SHOW_ON_TWEETDECK_TIMELINE');
var stripImageSuffix = document.getElementById('STRIP_IMAGE_SUFFIX');

window.onload = function(){
	// 最初はどっちも機能オンであってほしい
	// 最初は値が入っていないので、「if isfalseでないなら機能オン」とする
	if(localStorage['SHOW_ON_TWEET_DETAIL'] != 'isfalse') {
		showOnTweetDetail.checked = true;
	}
	else {
		showOnTweetDetail.checked = false;
	}
	if(localStorage['SHOW_ON_TIMELINE'] != 'isfalse') {
		showOnTimeline.checked = true;
	}
	else {
		showOnTimeline.checked = false;
	}
	if(localStorage['OPEN_WITH_KEY_PRESS'] != 'isfalse') {
		openWithKeyPress.checked = true;
	}
	else {
		openWithKeyPress.checked = false;
	}
	if(localStorage['SHOW_ON_TWEETDECK_TIMELINE'] != 'isfalse') {
		showOnTweetdeckTimeline.checked = true;
	}
	else {
		showOnTweetdeckTimeline.checked = false;
	}
	if(localStorage['STRIP_IMAGE_SUFFIX'] != 'isfalse') {
		stripImageSuffix.checked = true;
	}
	else {
		stripImageSuffix.checked = false;
	}
	// document.getElementById('res').innerHTML = showOnTweetDetail.checked.toString() + showOnTimeline.checked.toString() + ':' + localStorage['SHOW_ON_TWEET_DETAIL'] + localStorage['SHOW_ON_TIMELINE'];
}

document.getElementById('save').onclick = function() {
	localStorage['SHOW_ON_TWEET_DETAIL'] = 'is' + (showOnTweetDetail.checked.toString());
	localStorage['SHOW_ON_TIMELINE'] = 'is' + (showOnTimeline.checked.toString());
	localStorage['OPEN_WITH_KEY_PRESS'] = 'is' + (openWithKeyPress.checked.toString());
	localStorage['SHOW_ON_TWEETDECK_TIMELINE'] = 'is' + (showOnTweetdeckTimeline.checked.toString());
	localStorage['STRIP_IMAGE_SUFFIX'] = 'is' + (stripImageSuffix.checked.toString());
	chrome.tabs.query({}, function(result) {
		console.log(result);
		for(i=0; i<result.length; i++) {
			console.log(result[i].id);
			chrome.tabs.sendMessage(result[i].id, {method: 'OPTION_UPDATED'}, function(response) {console.log('res: ' + response)});
		}
	});
	// document.getElementById('res').innerHTML = showOnTweetDetail.checked.toString() + showOnTimeline.checked.toString() + ':' + localStorage['SHOW_ON_TWEET_DETAIL'] + localStorage['SHOW_ON_TIMELINE'];
}
