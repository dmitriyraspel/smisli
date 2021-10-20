<?php
/**
 * The template for displaying all single posts
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/#single-post
 *
 * @package rspl-theme
 */

get_header();
?>

	<main id="primary" class="site-main">
		<h2>single.php</h2> 

		<?php
		while ( have_posts() ) :
			the_post();

			get_template_part( 'template-parts/content/content', get_post_type() );

			if ( get_theme_mod( 'display_post_navigation_campaign_page', true ) ) {
				the_post_navigation(
					array(
						'prev_text' => '<span class="nav-subtitle">' . esc_html__( 'Previous:', 'rspl_theme' ) . '</span> <span class="nav-title">%title</span>',
						'next_text' => '<span class="nav-subtitle">' . esc_html__( 'Next:', 'rspl_theme' ) . '</span> <span class="nav-title">%title</span>',
					)
				);
			} else {
				if ( 'post' == get_post_type() ) {
					the_post_navigation(
						array(
							'prev_text' => '<span class="nav-subtitle">' . esc_html__( 'Previous:', 'rspl_theme' ) . '</span> <span class="nav-title">%title</span>',
							'next_text' => '<span class="nav-subtitle">' . esc_html__( 'Next:', 'rspl_theme' ) . '</span> <span class="nav-title">%title</span>',
						)
					);
				}

			}

			// If comments are open or we have at least one comment, load up the comment template.
			if ( comments_open() || get_comments_number() ) :
				comments_template();
			endif;

		endwhile; // End of the loop.
		?>

	</main><!-- #main -->

<?php
get_sidebar();
get_footer();
