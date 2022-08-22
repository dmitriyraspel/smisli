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

    <button id="menu-toggle" class="menu-toggle" aria-controls="primary-menu" aria-expanded="false">
      <div></div>
      <div></div>
      <div></div>
    </button>

    <nav id="site-navigation" class="primary-navigation" role="navigation" aria-label="<?php esc_attr_e( 'Primary menu', 'rspl_theme' ); ?>">
    
      <?php if ( has_nav_menu( 'primary' ) ) : 
      wp_nav_menu(
        array(
          'theme_location'  => 'primary',
          'menu_class'      => 'menu-wrapper',
          'container_class' => 'primary-menu-container',
          'items_wrap'      => '<ul id="primary-menu-list" class="%2$s">%3$s</ul>',
          'fallback_cb'     => false,
          'depth'           => 2,
        )
      );
      endif; 
    
      if ( has_nav_menu( 'social' ) ) :
        ?>
        <div class="follow-bar">
          <p class="follow-bar-text">
          <?php echo __( 'Подписывайтесь', 'rspl_theme' ); ?>
          </p>
        

          <?php
          wp_nav_menu(
            array(
              'theme_location'  => 'social',
              'items_wrap'      => '<ul id="primary-menu-follow-list" class="%2$s">%3$s</ul>',
              'link_before'     => '<span class="screen-reader-text">',
              'link_after'      => '</span>' . rspl_theme_get_icon_svg( 'link' ),
              'depth'           => 1,
              'container'       => '',
              )
          );
        ?>
        </div>
      <?php endif; ?>
      
    </nav><!-- #site-navigation -->

		 
    



	</div><!-- /.header-inner -->
	
	

</header><!-- #masthead -->
