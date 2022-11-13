var accentColor       = document.body.dataset.secondarycolor;
var accentHoverColor  = document.body.dataset.primarycolor;

/**
 * File navigation.js.
 *
 */

function primary_nav() {
	var siteNavigation = document.getElementById( 'site-navigation' );
	var button = document.getElementById( 'menu-toggle' );

	// Return early if the navigation don't exist.
	if (!siteNavigation) {
		return;
	}

	if (!button) {
		return;
	}
	
	siteNavigation.style.backgroundColor = accentHoverColor;

	// Toggle the .primary-navigation-open class and the aria-expanded value.
	button.addEventListener( 'click', function () {
		if (button.getAttribute( 'aria-expanded' ) === 'true' ) {
			rsplthemeCloseSiteNav();
		} else {
			document.body.classList.add( 'primary-navigation-open' );
			button.setAttribute( 'aria-expanded', 'true' );
			setTimeout(function () {
				document.addEventListener( 'click', rsplthemeCollapseSiteNavOnClickOutside )
			}, 700);
		}
	});
}

/**
 * Close if click outside Site-navigation
 */
function rsplthemeCollapseSiteNavOnClickOutside( event ) {
	var siteNavigation = document.getElementById( 'site-navigation' );

	if ( ! siteNavigation.contains( event.target ) ) {
		rsplthemeCloseSiteNav();
	}
}

/**
 * Close opened Primary-navigation
 */
function rsplthemeCloseSiteNav() {
	var button = document.getElementById( 'menu-toggle' );

	document.body.classList.remove("primary-navigation-open");
	button.setAttribute( 'aria-expanded', 'false' );
	document.removeEventListener( 'click', rsplthemeCollapseSiteNavOnClickOutside );
}


/**
 * Close opened submenu.
 */
function rsplthemeCloseSubMenu( li ) {
	if (! li.classList.contains( 'sub-menu-open' ) ) {
		return;
	} else {
		li.classList.remove( 'sub-menu-open' );
	}
}

/**
 * Handle clicks on submenu button.
 */
function rsplthemeExpandSubMenu( el ) {
	// Close other expanded items.
	el.closest( 'nav' ).querySelectorAll( '.sub-menu-toggle' ).forEach( function( button ) {
		if ( button !== el ) {
			button.setAttribute( 'aria-expanded', 'false' );
			rsplthemeCloseSubMenu(button.parentElement);
		}
	} );
	// Toggle aria-expanded on the button.
	rsplthemeToggleAriaExpanded( el, true );
}

/**
 * Close if click outside current element Submenu
 */
 function rsplthemeCollapseSubmenuOnClickOutside( event ) {
	if ( ! document.getElementById( 'site-navigation' ).contains( event.target ) ) {
		document.getElementById( 'site-navigation' ).querySelectorAll( '.sub-menu-toggle' ).forEach( function( button ) {
			button.setAttribute( 'aria-expanded', 'false' );
			rsplthemeCloseSubMenu(button.parentElement);
			document.removeEventListener( 'click', rsplthemeCollapseSubmenuOnClickOutside );
		} );
	}
}

/**
 * Toggle an attribute's value
 *
 * @param {Element} el - The element.
 * @param {boolean} withListeners - Whether we want to add/remove listeners or not.
 */
function rsplthemeToggleAriaExpanded( el, withListeners ) {
	el.parentElement.classList.toggle( 'sub-menu-open' );

	if ( 'true' !== el.getAttribute( 'aria-expanded' ) ) {
		el.setAttribute( 'aria-expanded', 'true' );
		if ( withListeners ) {
			document.addEventListener( 'click', rsplthemeCollapseSubmenuOnClickOutside );
		}
	} else {
		el.setAttribute( 'aria-expanded', 'false' );
		if ( withListeners ) {
			document.removeEventListener( 'click', rsplthemeCollapseSubmenuOnClickOutside );
		}
	}
}

primary_nav();

function rspl_user_menu() {
  
  var userMenu = document.querySelector(".user-menu__wrap");

  if (!userMenu) {
		return;
	}
  
  userMenu.onclick = function(){
    userMenu.classList.toggle("user-menu__wrap__active");
    document.addEventListener( 'click', userMenuOnClickOutside );
  }
  
  function userMenuOnClickOutside( event ) {
    if ( ! userMenu.contains( event.target ) ) {
      userMenu.classList.remove("user-menu__wrap__active");
    }
  }
}

rspl_user_menu();