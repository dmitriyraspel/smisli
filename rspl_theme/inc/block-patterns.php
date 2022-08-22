<?php
/**
 * RSPL Theme: Block Patterns
 *
 * @package RSPL_theme
 */

/**
 * Register Block Pattern Category.
 */
if ( function_exists( 'register_block_pattern_category' ) ) {

	register_block_pattern_category(
		'rspl_blocks',
		array( 'label' => __( 'RSPL blocks', 'rspl_theme' ) )
	);
}

/**
 * Register Block Patterns.
 */
if ( function_exists( 'register_block_pattern' ) ) {

	register_block_pattern(
		'rspl_blocks/latest-posts-alternating-grid',
		array(
			'title'      => __( 'Alternating Grid of Latest Posts', 'rspl_theme' ),
			'categories' => array( 'rspl_blocks' ),
			'content'    => '<!-- wp:latest-posts {
				"postsToShow":3,
				"displayPostContent":false, 
				"displayFeaturedImage":true, 
				"addLinkToFeaturedImage":true, 
				"align":"wide", 
				"className":"is-style-rspl_theme-alternating-grid"
			} /-->',
		)
	);
	
	

}
