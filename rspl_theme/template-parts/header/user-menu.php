<?php
/**
 * Displays the site header user menu.
 *
 * @package RSPL-theme
 */

if ( !is_user_logged_in() ) {
  ?>
  <div class="user-menu__wrap">
    <span class="user-menu__avatar"></span>
    <a href="<?php echo home_url( '/login' ) ?>" class="user-menu-login__link"></a>
  </div>
<?php }
else {
  $current_user = wp_get_current_user();
  ?>
    <div class="user-menu__wrap">
      <span class="user-menu__avatar"></span>
      <span class="user-menu__name"><?php echo $current_user->display_name ?></span>
          
          <ul class="user-menu__list">
          
            <li class="user-menu__item">
              <a href="<?php echo home_url( '/lk' ) ?>" class="user-menu__link">
                <?php echo __( 'Кабинет', 'rspl_theme' ) ?>
              </a>
            </li>
            <li class="user-menu__item">
              <a href="<?php echo home_url( '/katalog-produktov' ) ?>" class="user-menu__link">
                <?php echo __( 'Каталог продуктов', 'rspl_theme' ) ?>
              </a>
            </li>
            <li class="user-menu__item">
              <a href="<?php echo home_url( '/izbrannoe' ) ?>" class="user-menu__link">
                <?php echo __( 'Избранное', 'rspl_theme' ) ?>
              </a>
            </li>
            <li class="user-menu__item">
              <a href="<?php echo esc_url( wc_get_cart_url() ); ?>" class="user-menu__link">
               <?php echo __( 'Корзина', 'rspl_theme' ) ?>
              </a>
            </li>
            <li class="user-menu__item">
              <a href="<?php echo home_url( '/profil' ) ?>" class="user-menu__link">
                <?php echo __( 'Профиль', 'rspl_theme' ) ?>
              </a>
            </li>

            <li class="user-menu__item">
              <a href="<?php echo wp_logout_url( home_url( '/my-courses' ) ) ?>" class="user-menu__link user-menu__link user-menu__logout">
                <?php echo __( 'Выход', 'rspl_theme' ) ?>
                
              </a>
            </li>

          </ul>
    </div>
<?php }

