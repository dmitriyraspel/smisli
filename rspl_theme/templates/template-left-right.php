<?php
/**
 * Template Name: Template thumbnail - left, Title and content - right
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

        <?php rspl_theme_post_thumbnail(); ?>

        <div class="entry-content">

          <?php the_title( '<h1 class="entry-title">', '</h1>' ); ?>

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
