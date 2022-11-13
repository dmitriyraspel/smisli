
function rspl_share_button() {
  
  var buttonShare = document.querySelector(".button-share");

  if (!buttonShare) {
		return;
	}
  
  buttonShare.onclick = function(){
    buttonShare.classList.toggle("button-share__active");
    document.addEventListener( 'click', buttonShareOnClickOutside );
  }
  
  function buttonShareOnClickOutside( event ) {
    if ( ! buttonShare.contains( event.target ) ) {
      buttonShare.classList.remove("button-share__active");
    }
  }
}

rspl_share_button();