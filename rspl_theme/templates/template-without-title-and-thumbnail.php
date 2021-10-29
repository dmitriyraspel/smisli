<?php
/**
 * Template Name: Template without title and thumbnail
 * Template Post Type: post, page, leyka_campaign
 * 
 * @link https://developer.wordpress.org/themes/template-files-section/page-template-files/
 *
 * @package rspl-theme
 */

get_header();
?>

	<main id="primary" class="site-main">
		
		<?php
		while ( have_posts() ) :
			the_post();
      ?>
      <article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>

        <div class="entry-content">
          <?php
          the_content();

          wp_link_pages(
            array(
              'before' => '<div class="page-links">' . esc_html__( 'Pages:', 'rspl_theme' ),
              'after'  => '</div>',
            )
          );
          ?>
        </div><!-- .entry-content -->

      </article><!-- #post-<?php the_ID(); ?> -->

    <?php
		endwhile; // End of the loop.
		?>

	</main><!-- .site-main -->

<?php
get_footer();
