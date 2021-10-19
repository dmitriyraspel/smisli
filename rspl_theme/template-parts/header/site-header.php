<?php
/**
 * Displays the site header.
 *
 * @package RSPL-theme
 */
$wrapper_classes  = 'site-header';
$wrapper_classes .= has_custom_logo() ? ' has-logo' : '';
$wrapper_classes .= ( true === get_theme_mod( 'display_site_title', true ) ) ? ' has-site-title' : '';
$wrapper_classes .= ( true === get_theme_mod( 'display_site_tagline', true ) ) ? ' has-site-tagline' : '';
$wrapper_classes .= is_active_sidebar( 'sidebar-4' ) ? ' has-header-top' : '';
$wrapper_classes .= is_active_sidebar( 'sidebar-3' ) ? ' has-header-widget-area' : '';
$wrapper_classes .= has_nav_menu( 'primary' ) ? ' has-primary-menu' : '';
?>


<header id="masthead" class="<?php echo esc_attr( $wrapper_classes ); ?>" role="banner">

	<?php get_template_part( 'template-parts/header/site-header-top' ); ?>

	<div class="container header-inner">

		

      <?php if ( is_active_sidebar( 'sidebar-3' ) ) : ?>
        <div class="widget-area header-widget-area">
            <?php dynamic_sidebar( 'sidebar-3' ); ?>
        </div><!-- .header-widget-area -->
      <?php endif; ?>

    <?php get_template_part( 'template-parts/header/site-branding' ); ?>

    <?php get_template_part( 'template-parts/navigation/site-nav' ); ?>

		<button id="primary-menu-toggle" class="menu-toggle" aria-controls="primary-menu-list" aria-expanded="false">
      <span class="screen-reader-text"><?php esc_html_e( 'Primary Menu', 'rspl_theme' ); ?></span>
      <div class="burger">
        <div class="burger__inner">
        </div>
      </div>
    </button>


	</div><!-- /.header-inner -->
	
	

</header><!-- #masthead -->
