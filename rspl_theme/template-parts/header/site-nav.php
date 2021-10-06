<?php
/**
 * Displays the site navigation.
 *
 * @package RSPL-theme
 */

?>
<?php if ( has_nav_menu( 'primary' ) ) : ?>
  <nav id="site-navigation" class="primary-navigation" role="navigation" aria-label="<?php esc_attr_e( 'Primary menu', 'rspl_theme' ); ?>">
    
    <button class="menu-toggle" aria-controls="primary-menu" aria-expanded="false"><?php esc_html_e( 'Primary Menu', 'rspl_theme' ); ?></button>
    
    <?php
    wp_nav_menu(
      array(
        'theme_location' => 'primary',
        'menu_id'        => 'primary-menu145132',
      )
    );
    ?>
  </nav><!-- #site-navigation -->
<?php endif; ?>
