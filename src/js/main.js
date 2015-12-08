/* main.js */

var timerid;
window.addEventListener("load", start);
document.addEventListener("keydown", function(e){
    // if [RETURN(ENTER)]キーなら
    if(e.keyCode == 13){
        INCL();
    }
    start();
});
document.addEventListener("keyup", start);
document.addEventListener("click", start);

function INCL(){
    // .permalink-tweet-container: ツイート詳細ページのメインツイート
    // .AdaptiveMedia-photoContainer: 画像
    if(!!document.querySelector('.permalink-tweet-container')){
        var mediatags = document.querySelector('.permalink-tweet-container').getElementsByClassName('AdaptiveMedia-photoContainer');
        for(var i=mediatags.length-1; i>=0; i--){
            var imgurl = mediatags[i].getElementsByTagName('img')[0].src;
             // if 画像URLが取得できたなら
            if(!!imgurl){
                window.open(imgurl + ':orig');
            }
        }
    }
}

function start(){
    // if まだ処理を行っていないなら
    if(!document.getElementById("twioriginput")){
         // if ツイート詳細ページかつメインツイートが画像ツイートなら
        if(!!document.querySelector('.permalink-tweet-container')){
            // メインツイートの操作ボタン
            var sel = document.querySelector(".permalink-tweet-container .ProfileTweet-actionList");
            var divch = document.createElement("div");
            divch.id = "twiorigdiv";
            sel.appendChild(divch);
            document.getElementById("twiorigdiv").className = "ProfileTweet-action";
            // Originalボタン
            var inputch = document.createElement("input");
            inputch.id = "twioriginput";
            inputch.style.width = "70px";
            inputch.type = "button";
            inputch.value = "Original";
            inputch.onclick = INCL;
            document.getElementById("twiorigdiv").appendChild(inputch);
        }
        clearTimeout(timerid);
        timerid = setTimeout("start()",1000);
    }
}
