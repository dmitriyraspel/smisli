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
        <a href="<?php echo home_url( '/my-courses' ) ?>" class="after-header-menu__link">
        <span class="after-header-menu__icon after-header-menu__icon-user"></span>
          Вход в личный кабинет
        </a>
      </li>
      <li class="after-header-menu__item">
        <a href="<?php echo home_url( '/katalog-produktov' ) ?>" class="after-header-menu__link">
        <span class="after-header-menu__icon after-header-menu__icon-tree"></span>
          Каталог продуктов
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
        <a href="<?php echo home_url( 'my-courses' ) ?>" class="after-header-menu__link">
          <span class="after-header-menu__icon after-header-menu__icon-user"></span>
          Кабинет
        </a>
      </li>
      <li class="after-header-menu__item">
        <a href="<?php echo home_url( '/katalog-produktov' ) ?>" class="after-header-menu__link">
          <span class="after-header-menu__icon after-header-menu__icon-tree"></span>
          Каталог продуктов
        </a>
      </li>
      <li class="after-header-menu__item">
        <a href="<?php echo home_url( '/izbrannoe' ) ?>" class="after-header-menu__link">
        <span class="after-header-menu__icon after-header-menu__icon-fav "></span>
          Избранное
        </a>
      </li>
      <li class="after-header-menu__item">
        <a href="<?php echo esc_url( wc_get_cart_url() ); ?>" class="after-header-menu__link">
        <span class="after-header-menu__icon after-header-menu__icon-cart"></span>
          Корзина
        </a>
      </li>
      <li class="after-header-menu__item">
        <a href="<?php echo home_url( '/profil' ) ?>" class="after-header-menu__link">
          <span class="after-header-menu__icon after-header-menu__icon-gear"></span>
          Профиль
        </a>
      </li>
    </ul>
  </nav>

<?php }