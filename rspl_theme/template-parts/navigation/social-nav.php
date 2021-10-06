<?php
/**
 * Displays Social menu
 *
 * @package RSPL_theme
 */

?>
   <nav class="social-navigation" role="navigation" aria-label="<?php esc_attr_e( 'Social Links Menu', 'rspl_theme' ); ?>">
      <?php
      wp_nav_menu(
         array(
            'theme_location'  => 'social',
            'link_before'     => '<span class="screen-reader-text">',
            'link_after'      => '</span>' . rspl_theme_get_icon_svg( 'link' ),
            'depth'           => 1,
            'container'       => '',
            )
      );
      ?>
   </nav><!-- .social-navigation -->