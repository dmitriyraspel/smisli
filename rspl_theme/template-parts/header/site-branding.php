<?php
/**
 * Displays the site header.
 *
 * @package RSPL-theme
 */

$blog_info    = get_bloginfo( 'name' );
$description  = get_bloginfo( 'description', 'display' );
$show_title   = ( true === get_theme_mod( 'display_title_and_tagline', true ) );
$header_class = $show_title ? 'site-title' : 'screen-reader-text';

?>

<?php
/* Show site logo */
if (has_custom_logo()) : ?>
  <div class="site-logo"><?php the_custom_logo(); ?></div>
<?php endif; ?>

<div class="site-branding">  
  <?php
  if ( is_front_page() || is_home() ) :
    ?>
    <h1 class="site-title"><a href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home"><?php bloginfo( 'name' ); ?></a></h1>
    <?php
  else :
    ?>
    <p class="site-title"><a href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home"><?php bloginfo( 'name' ); ?></a></p>
    <?php
  endif;

  $rspl_theme_description = get_bloginfo( 'description', 'display' );
  if ( $rspl_theme_description || is_customize_preview() ) :
    ?>
    <p class="site-description"><?php echo $rspl_theme_description; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?></p>
  <?php endif; ?>

</div><!-- .site-branding -->
