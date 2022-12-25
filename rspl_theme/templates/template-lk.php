<?php
/**
 * Template Name: Template LK
 * Template Post Type: page
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

        <header class="entry-header lk-entry-header">
          <?php the_title( '<h1 class="entry-title lk-entry-title">', '</h1>' ); ?>
        </header><!-- .entry-header -->
        
        <div class="entry-content">
          <?php
          the_content();
          ?>
          
            <div class="alignwide lk-wrap">
              <section id="lk-menu-content-toggle" class="lk-menu">

                <a href="" id="lk-menu-lekcii" class="lk-menu-link lk-menu-lekcii active">
                  <h2>СМЫСЛЫ</h2>
                  <h4>ЛЕКЦИИ САМОПОМОЩИ</h4>
                </a>
              
                <a href="" id="lk-menu-flagman" class="lk-menu-link lk-menu-flagman inactive">
                  <h2>МЫ</h2>
                  <h4>ФЛАГМАНСКИЙ ПРОЕКТ</h4>
                </a>
                
                <a href="" id="lk-menu-skazki" class="lk-menu-link lk-menu-skazki inactive">
                  <h2>СМЫШЛЕНЫШ</h2>
                  <h4>СКАЗКОТЕРАПИЯ ДЛЯ ДЕТЕЙ</h4>
                </a>

              </section><!-- /.lk-menu -->
    
            </div><!-- alignwide lk-wrap -->

        </div><!-- .entry-content -->

      </article><!-- #post-<?php the_ID(); ?> -->

			
    <?php
		endwhile; // End of the loop.
		?>

	</main><!-- #main -->

<?php
// get_sidebar();
get_footer();