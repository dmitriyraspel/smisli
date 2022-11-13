
function pspl_share_button() {

  
  var buttonShare = document.querySelector(".button-share");
  
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

pspl_share_button();