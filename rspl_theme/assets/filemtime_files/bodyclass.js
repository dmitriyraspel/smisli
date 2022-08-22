function bodyClassTouch() {
  var isMobile = {
     Android: function () {
        return navigator.userAgent.match(/Android/i);
     },
     BlackBerry: function () {
        return navigator.userAgent.match(/BlackBerry/i); // проверить, в эмуляторе хрома не определяется  
     },
     iOS: function () {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
     },
     Opera: function () {
        return navigator.userAgent.match(/Opera Mini/i);
     },
     Windows: function () {
        return navigator.userAgent.match(/IEMobile/i);
     },
     Any: function () {
        return (
           isMobile.Android() ||
           isMobile.BlackBerry() ||
           isMobile.iOS() ||
           isMobile.Opera() ||
           isMobile.Windows());
     }
  };
  var body = document.body;

  if (isMobile.Any()) {
     body.classList.add('_touch');
  } else {
     body.classList.add('_desktop');
  };
}

bodyClassTouch();