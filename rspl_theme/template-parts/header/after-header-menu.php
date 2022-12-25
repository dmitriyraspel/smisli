<?php
/**
 * Displays After header menu
 *
 * @package RSPL_theme
 */

if ( !is_user_logged_in() ) { 
  ?>

  <nav class="after-header-menu__wrap after-header-menu_not-authorized">
    <ul class="after-header-menu__list">
      <li class="after-header-menu__item">
        <a href="<?php echo home_url( '/lk' ) ?>" class="after-header-menu__link">
        <span class="after-header-menu__icon after-header-menu__icon-user"></span>
        <?php echo __( 'Вход в личный кабинет', 'rspl_theme' ) ?>
        </a>
      </li>
      <li class="after-header-menu__item">
        <a href="<?php echo home_url( '/katalog-produktov' ) ?>" class="after-header-menu__link">
        <span class="after-header-menu__icon after-header-menu__icon-tree"></span>
        <?php echo __( 'Каталог продуктов', 'rspl_theme' ) ?>
        </a>
      </li>   
    </ul>
  </nav>

<?php }
else {
  $current_user = wp_get_current_user();
  ?>

  <nav class="after-header-menu__wrap after-header-menu_authorized">
    <ul class="after-header-menu__list">
      <li class="after-header-menu__item">
        <a href="<?php echo home_url( '/lk' ) ?>" class="after-header-menu__link">
          <span class="after-header-menu__icon after-header-menu__icon-user"></span>
          <?php echo __( 'Кабинет', 'rspl_theme' ) ?>
        </a>
      </li>
      <li class="after-header-menu__item">
        <a href="<?php echo home_url( '/katalog-produktov' ) ?>" class="after-header-menu__link">
          <span class="after-header-menu__icon after-header-menu__icon-tree"></span>
          <?php echo __( 'Каталог продуктов', 'rspl_theme' ) ?>
        </a>
      </li>
      <li class="after-header-menu__item">
        <a href="<?php echo home_url( '/izbrannoe' ) ?>" class="after-header-menu__link">
        <span class="after-header-menu__icon after-header-menu__icon-fav "></span>
          <?php echo __( 'Избранное', 'rspl_theme' ) ?>
        </a>
      </li>
      <li class="after-header-menu__item">
        <a href="<?php echo esc_url( wc_get_cart_url() ); ?>" class="after-header-menu__link">
        <span class="after-header-menu__icon after-header-menu__icon-cart"></span>
          <?php echo __( 'Корзина', 'rspl_theme' ) ?>
        </a>
      </li>
      <li class="after-header-menu__item">
        <a href="<?php echo home_url( '/profil' ) ?>" class="after-header-menu__link">
          <span class="after-header-menu__icon after-header-menu__icon-gear"></span>
          <?php echo __( 'Профиль', 'rspl_theme' ) ?>
        </a>
      </li>
    </ul>
  </nav>

<?php }