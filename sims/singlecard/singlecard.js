window.front_only = _getQueryVariable("front_only");
window.FRONT_ONLY = (front_only && front_only=="yes");

var flashcard = $("#flashcard");
var FLIPPED = false;
if(!FRONT_ONLY){
	flashcard.onclick = function(){

		// Flip!
		var flip = flashcard.getAttribute("flip");
		if(flip=="yes"){
			flashcard.setAttribute("flip","no");
		}else{
			flashcard.setAttribute("flip","yes");

			// HACK: PLAY AUDIO (if any)
			var a = $("#HACK_audio");
			if(a){
				a.play();
				if(!a.onclick){
					a.onclick = function(e){
						e.stopPropagation();
					};
				}
			}

		}

		// Also, send message (when flipped for first time)
		if(!FLIPPED && window.top.broadcastMessage){
			FLIPPED = true;
			setTimeout(function(){
				window.top.broadcastMessage("flip_"+cardname);
			},1000);

			// AND REMOVE UI
			clicky.kill();

		}

	};
}else{

	

}

window.cardname = _getQueryVariable("card");
var frontHTML = _getLabel("flashcard_"+cardname+"_front");
var backHTML = _getLabel("flashcard_"+cardname+"_back");
$("#front").innerHTML = frontHTML;
$("#back").innerHTML = backHTML;

_modifyFlashCard($("#front"));
_modifyFlashCard($("#back"));

// Refresh in real time...
if(_getQueryVariable("refresh")=="yes"){

	var dom = back.querySelector(".fcard_center");

	dom.style.top = "auto";
	dom.style.bottom = "auto";

	var _reAlign = function(){
		var bounds = dom.getBoundingClientRect();
		dom.style.top = (((240-bounds.height-10)/2)) +"px";
	};
	_reAlign();

	window.top.subscribe("answer_edit_"+cardname, function(new_answer){
		dom.innerText = new_answer;
		_reAlign();
	});

}

/////////////////////////////////////////
/////////////////////////////////////////

var clicky = new createAnimatedUIHelper({
	x: 355,
	y: 195,
	width: 100,
	height: 100,
	img: "../../pics/ui_click.png"
});

