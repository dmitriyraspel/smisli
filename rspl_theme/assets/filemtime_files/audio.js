function rspl_audiopleer_hide_controle() {
	var audiopleer = document.querySelector('audio');	

	// Return 
	if (!audiopleer) {
		return;
	}

  var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if ('attributes' === mutation.type &&
        'controlslist' === mutation.attributeName &&
        !audiopleer.getAttribute('controlslist')
      ) {
        // alert('Попытка изменить атрибут "controlslist"');
        audiopleer.setAttribute('controlslist', 'nodownload');
      }
    });
  });
  
  observer.observe(audiopleer, {
    attributes: true
  });
  
  setTimeout(function() {
    audiopleer.setAttribute('controlslist', '');
  }, 2000)
}

rspl_audiopleer_hide_controle();
