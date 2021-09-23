<?php
/**
 * Displays the site header widget aria.
 *
 * @package RSPL-theme
 */

if ( ! is_active_sidebar( 'sidebar-4' ) ) {
	return;
}
?>

<div class="header-top-widget-area">
	<?php dynamic_sidebar( 'sidebar-4' ); ?>
</div><!-- #secondary -->