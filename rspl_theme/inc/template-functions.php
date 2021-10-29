<?php
/**
 * Functions which enhance the theme by hooking into WordPress
 *
 * @package rspl-theme
 */

/**
 * Adds custom classes to the array of body classes.
 *
 * @param array $classes Classes for the body element.
 * @return array
 */
function rspl_theme_body_classes( $classes ) {

	if ( is_singular() ) {
		// Adds `singular` to singular pages.
		$classes[] = 'singular';
	} else {
		// Adds `hfeed` to non singular pages.
		$classes[] = 'hfeed';
	}

	// Add body class if page has full-width content.
	if ( is_page_template( array( 'templates/template-without-title-and-thumbnail.php' ) ) ) {
		$classes[] = 'rspl-no-post-thumbnail rspl-no-entry-title';
	}

	// Adds a class of no-sidebar when there is no sidebar present.
	if ( ! is_active_sidebar( 'sidebar-1' ) ) {
		$classes[] = 'no-sidebar';
	}

	return $classes;
}
add_filter( 'body_class', 'rspl_theme_body_classes' );

/**
 * Add a pingback url auto-discovery header for single posts, pages, or attachments.
 */
function rspl_theme_pingback_header() {
	if ( is_singular() && pings_open() ) {
		printf( '<link rel="pingback" href="%s">', esc_url( get_bloginfo( 'pingback_url' ) ) );
	}
}
add_action( 'wp_head', 'rspl_theme_pingback_header' );

/**
 * Change the excerpt more string
 */
function rspl_theme_excerpt_more() {

	return '...';
}
add_filter( 'excerpt_more', 'rspl_theme_excerpt_more' );


/**
 * Remove field "URL" from comment_form.
 *
 * @param array $fields
 *
 * @return array
 */
function rspl_theme_comment_form_default_fields( $fields ) {

	if ( get_theme_mod( 'remove_comment_field_url', true ) ) {
		unset( $fields['url'] );
	}
	
	return $fields;
}
add_filter( 'comment_form_default_fields', 'rspl_theme_comment_form_default_fields' );
