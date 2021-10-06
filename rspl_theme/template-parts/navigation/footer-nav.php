<?php
/**
 * Displays Footer menu
 *
 * @package RSPL_theme
 */

?>
   <nav class="footer-navigation" role="navigation" aria-label="<?php esc_attr_e( 'Footer menu', 'rspl_theme' ); ?>">
      <?php
      wp_nav_menu(
         array(
            'theme_location'  => 'footer',
            'depth'           => 1,
            'container'       => '',
         )
      );
      ?>
   </nav><!-- .footer-navigation -->