
function frontPageReviewsSlider() {
  console.log( "Привет, function frontPageReviewsSlider запустилась" );
  // front_page_reviews Slider
var front_page_reviews = document.getElementById("front-page-reviews");
var flkty = new Flickity( front_page_reviews, {
// options
wrapAround: true,
  pageDots: true
//   cellAlign: 'left',
//   contain: true
});
};


function frontPageFeedbackForm() {
  console.log( "Привет, function frontPageFeedbackForm запустилась" );
  
  var FrontPageFeedbackForm = document.getElementById( 'front-page-feedback-form' );
  
// Return early if the navigation don't exist.
if ( ! FrontPageFeedbackForm ) {
  return;
}

var FrontPageFeedbackFormInputs = FrontPageFeedbackForm.querySelectorAll( '.border-input' );

// Return early if the button don't exist.
if ( 'undefined' === typeof FrontPageFeedbackFormInputs ) {
  return;
};

// Toggle focus each time a menu link is focused or blurred.
for ( const FrontPageFeedbackFormInput of FrontPageFeedbackFormInputs ) {
  FrontPageFeedbackFormInput.addEventListener( 'focus', inputFocus, true );
  FrontPageFeedbackFormInput.addEventListener( 'blur', inputFocus, true );
};

};

function inputFocus() {
  var borderWrap = this.parentNode;
  borderWrap.classList.toggle( 'animate' );    
};

frontPageReviewsSlider();



// <script src="<?php echo get_stylesheet_directory_uri() ?>/assets/front-page/front-new.js?1"></script>