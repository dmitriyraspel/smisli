<?php
/**
 * Displays the site header branding.
 *
 * @package RSPL-theme
 */

$blog_info          = get_bloginfo( 'name' );
$description        = get_bloginfo( 'description', 'display' );
$show_title         = ( true === get_theme_mod( 'display_site_title', true ) );
$show_description   = ( true === get_theme_mod( 'display_site_tagline' ) );
$title_class        = $show_title ? 'site-title' : 'screen-reader-text';
$description_class  = $show_description ? 'site-description' : 'screen-reader-text';
?>

<div class="site-branding">

  <?php
  /* Show only site logo without title & description */
  if ( has_custom_logo() && ! $show_title && ! $show_description ) : ?>
    <div class="site-logo"><?php the_custom_logo(); ?></div>

    <?php if ( $blog_info ) : ?>
      <?php if ( is_front_page() && ! is_paged() ) : ?>
        <h1 class="<?php echo esc_attr( $title_class ); ?>"><?php echo esc_html( $blog_info ); ?></h1>
      <?php elseif ( is_front_page() && ! is_home() ) : ?>
        <h1 class="<?php echo esc_attr( $title_class ); ?>"><a href="<?php echo esc_url( home_url( '/' ) ); ?>"><?php echo esc_html( $blog_info ); ?></a></h1>
      <?php else : ?>
        <p class="<?php echo esc_attr( $title_class ); ?>"><a href="<?php echo esc_url( home_url( '/' ) ); ?>"><?php echo esc_html( $blog_info ); ?></a></p>
      <?php endif; ?>
	  <?php endif; ?>

    <?php if ( $description ) : ?>
      <p class="<?php echo esc_attr( $description_class ); ?>"><?php echo $description; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?></p>
    <?php endif; ?>
  
  <?php
  // Show site logo with title & description
  else : ?>

    <?php if ( has_custom_logo() ) : ?>
      <div class="site-logo"><?php the_custom_logo(); ?></div>
    <?php endif; ?>

    <?php if ( has_custom_logo() && ( $show_title && $show_description ) ) : ?>
      <div class="site-title-wrapper">
    <?php endif; ?>

      <?php if ( $blog_info ) : ?>
        <?php if ( is_front_page() && ! is_paged() ) : ?>
          <h1 class="<?php echo esc_attr( $title_class ); ?>"><?php echo esc_html( $blog_info ); ?></h1>
        <?php elseif ( is_front_page() && ! is_home() ) : ?>
          <h1 class="<?php echo esc_attr( $title_class ); ?>"><a href="<?php echo esc_url( home_url( '/' ) ); ?>"><?php echo esc_html( $blog_info ); ?></a></h1>
        <?php else : ?>
          <p class="<?php echo esc_attr( $title_class ); ?>"><a href="<?php echo esc_url( home_url( '/' ) ); ?>"><?php echo esc_html( $blog_info ); ?></a></p>
        <?php endif; ?>
      <?php endif; ?>

      <?php if ( $description ) : ?>
        <p class="<?php echo esc_attr( $description_class ); ?>"><?php echo $description; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?></p>
      <?php endif; ?>

      <?php if ( $show_title && $show_description ) : ?>
      </div><!-- /.site-title-wrapper -->
      <?php endif; ?>

  <?php endif; ?>
</div><!-- /.site-branding -->
