/* main.js */

var timerid;
//var count = 0;  // for debug

window.addEventListener("load", start);
document.addEventListener("keydown", function(e){
    if(e.keyCode == 13){ // if [RETURN(ENTER)]キーなら
        INCL();
    }
    var locurl = location.href;
    //document.querySelector("h1.Icon").innerHTML += locurl;
    start();
});
document.addEventListener("keyup", start);
document.addEventListener("click", start);

function INCL(){
    var imgurl = [];
    if(!!document.querySelector('.permalink-tweet-container .cards-base img')){ // if 画像ツイートなら
        if(!!(document.querySelector('.cards-media-container .cards-base .multi-photos'))){ // if 複数画像ツイートなら
            for(var i=1; i<=4; i++){
                if(!!document.querySelector('.cards-media-container .cards-base .multi-photos .photo-' + i + ' img')){
                    imgurl[i-1] = document.querySelector('.cards-media-container .cards-base .multi-photos .photo-' + i + ' img').src;
                    //console.log(imgurl[i-1]);  //debug
                }
            }
            for(var i=4; i>0; i--){
                if(!!imgurl[i-1]){ // if 画像URLが取得できたなら
                    window.open(imgurl[i-1] + ':orig');
                }
            }
        }
        else{ // else 単一画像ツイートなら
            imgurl[0] = document.querySelector('.permalink-tweet-container .cards-base img').src;
            if(!!imgurl[0]){ // if 画像URLが取得できたなら
                window.open(imgurl[0] + ':orig');
            }
        }
    }
}

function start(){
    //document.querySelector("h1.Icon").innerHTML = count;  // for debug
    if(!document.getElementById("twioriginput")){ // if まだ処理行ってないなら
        if(!!document.querySelector('.permalink-tweet-container .cards-base img')){ // if 画像ツイートなら
//            var sel = ;
            var sel = document.querySelector(".permalink-tweet-container .ProfileTweet-actionList");
            if(!!document.querySelector(".permalink-tweet p.tweet-text")){ // if ツイート本文のpタグが存在するなら
                //sel.appendChild(document.createElement("br"));
                var divch = document.createElement("div");
                divch.id = "twiorigdiv";
                //spanch.innerHTML = "";
                //spanch.style.fontSize = "12px";
                sel.appendChild(divch);

                var inputch = document.createElement("input");
                inputch.id = "twioriginput";
                inputch.style.width = "70px";
                inputch.type = "button";
                inputch.value = "Original";
                inputch.onclick = INCL;
                document.getElementById("twiorigdiv").appendChild(inputch);
            }
        }
        //var locurl = location.href;
        //document.querySelector("h1.Icon").innerHTML += locurl;
        //count++;  // for debug
        clearTimeout(timerid);
        timerid = setTimeout("start()",1000);
    }
}
