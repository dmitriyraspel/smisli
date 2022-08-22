<?php
/**
 * Template Name: Template Front Page
 * Template Post Type: page
 * 
 * @link https://developer.wordpress.org/themes/template-files-section/page-template-files/
 *
 * @package rspl-theme
 */

// ссылка на логотип
$custom_logo_url = wp_get_attachment_image_src( get_theme_mod( 'custom_logo' ), 'full' ); 

?>

<!DOCTYPE html>
<html lang="ru-RU">

  <head>
    <meta charset="UTF-8" />
    <meta
      content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"
      name="viewport"
    />
    <meta content="ie=edge" http-equiv="X-UA-Compatible" />

    <script src="<?php echo get_stylesheet_directory_uri() ?>/assets/front-page/course-promo.js?37"></script>
    <link href="<?php echo get_stylesheet_directory_uri() ?>/assets/front-page/front.css?37" rel="stylesheet" />

    <title><?php bloginfo('name'); ?></title>
    <meta name="description" content="<?php bloginfo('description'); ?>" />
  </head>

  <body class="home ">
    <canvas id="ribbon"></canvas>

    <div id="logo">
      <a class="no-barba site-title" href="<?php echo get_home_url(); ?>">
        <img 
        src="<?php echo $custom_logo_url[0] ?>" 
        class="custom-logo"
        alt="">
      </a>
    </div>

    <div id="hire-us" class="display-none">
      <a href="#contact">O нас</a>
    </div>

    <a href="#" id="menu-button">
      <div></div>
      <div></div>
      <div></div>
    </a>

    <!-- меню -->
  <div id="menu">    
    <?php
    wp_nav_menu(
      array(
        'theme_location'  => 'primary',
				'menu_class'      => 'menu-wrapper',
				'container_id' => 'menu-wrapper',
				'items_wrap'      => '<ul id="menu-items" class="%2$s">%3$s</ul>',
				'fallback_cb'     => false,
        'depth'           => 1,
			)
		);
    ?>

    <div id="follow-bar">
      <div id="follow">
        <p><?php echo __( 'Подписывайтесь', 'rspl_theme' ); ?></p>
        <span></span>
      </div>

      <?php
        if ( has_nav_menu( 'social' ) ) :
        
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
         endif; ?> 
    </div>
  </div>
  <!-- меню -->

    <script>
      Ribbon.init(document.getElementById("ribbon"));
    </script>

    <div id="wrapper">
      <div class="page-content home-page">
        
        <ul id="bullets" style="--selection-color: rgba(231, 157, 64, 0.25)" >
          
          <!-- буква экран 1 -->
          <li>
            <a href="#pages-screen-1">
              <span>С</span>
              <span class="project-name">
                <span>С</span>
                мыслы</span
              >
            </a>
          </li>

          <!-- буква экран 2 -->
          <li>
            <a href="#pages-screen-2">
              <span>И</span>
              <span class="project-name">
                <span>И</span>
                деи</span
              >
            </a>
          </li>
          
          <!-- буква экран 3 -->
          <li>
            <a href="#course-promo-1">
              <span>Л</span>
              <span class="project-name">
                <span>Л</span>
                екция 2</span
              >
            </a>
          </li>

          <!-- буква экран 4 -->
          <li>
            <a href="#course-promo-2">
              <span>Л</span>
              <span class="project-name">
                <span>Л</span>
                екция 2</span
              >
            </a>
          </li>

          <!-- буква экран 5 -->
          <li>
            <a href="#course-promo-3">
              <span>Л</span>
              <span class="project-name">
                <span>Л</span>
                екция 3</span
              >
            </a>
          </li>

          <!-- буква экран 6 review -->
          <li>
            <a href="#pages-screen-review">
              <span>О</span>
              <span class="project-name">
                <span>О</span>
                тзывы</span
              >
            </a>
          </li>

          <!-- буква экран 7 -->
          <li>
            <a href="#pages-screen-feedback">
              <span>Х</span>
              <span class="project-name">
                <span>Х</span>
                Хочу знать</span
              >
            </a>
          </li>

          <!-- буква экран 8 -->
          <li>
            <a href="#pages-screen-footer">
              <span>П</span>
              <span class="project-name"> Footer</span>
            </a>
          </li>
        </ul>
        
        
        <ul id="pages">

          <!-- Экран 1 Смыслы -->
          <li
            id="pages-screen-1"
            class="page"
            style="
              --highlight-primary: #e79d40;
              --selection-color: rgba(231, 157, 64, 0.25);
            "
            data-slug="pages-screen-1"
            data-primarycolor="#F3A748"
            data-secondarycolor="#DB9338"
            data-midcolor="#e79d40"
            data-selection-color="rgba(231,157,64,0.25)"
          >
          <a class="pages-inner-block" href="#pages-screen-1">
            <h2 class="pages-inner-title">Смыслы</h2>
            <!-- <h3>Про нас</h3> -->
            <p>
              Миссия, описание проекта. Рыбатекст используется дизайнерами,
              проектировщиками и фронтендерами, когда нужно быстро заполнить
              макеты или прототипы содержимым.
            </p>
            <div class="arrow">
              <div class="circle"></div>
              <img src="<?php echo get_stylesheet_directory_uri() ?>/assets/front-page/home-arrow.svg" />
              <div class="spine"></div>
            </div>
          </a>
          </li>

          <!-- экран 2 Идеи для проекта-->
          <li
            id="pages-screen-2"
            class="page"
            style="
              --highlight-primary: #338fb9;
              --selection-color: rgba(51, 143, 185, 0.25);
            "
            data-slug="pages-screen-2"
            data-primarycolor="#389CCA"
            data-secondarycolor="#2E82A8"
            data-midcolor="#338fb9"
            data-selection-color="rgba(51,143,185,0.25)"
          >
          <a class="pages-inner-block" href="#pages-screen-2">
            <h2 class="pages-inner-title">Идеи для проекта</h2>

            <!-- <h3>Про наши идеи</h3> -->

            <p>
              2 страница- объяснение почему это не видео, почему это не личный
              бренд/эксперт про методологию- как устроено и почему это
              эффективно про аутогенную тренировку- мягкая работа с
              подсознанием для образования новых нейронных связей. Рыбатекст
              используется дизайнерами, проектировщиками и фронтендерами,
              когда нужно быстро заполнить макеты или прототипы содержимым.
            </p>
            <div class="arrow">
              <div class="circle"></div>
              <img src="<?php echo get_stylesheet_directory_uri() ?>/assets/front-page/home-arrow.svg" />
              <div class="spine"></div>
            </div>
          </a>
          </li>

           <!-- экран 3 Лекция 1-->
          <li
            id="course-promo-1"
            class="page "
            style="
              --highlight-primary: #ec8058;
              --selection-color: rgba(236, 128, 88, 0.25);
            "
            data-slug="course-promo-1"
            data-primarycolor="#f5865e"
            data-secondarycolor="#e37a52"
            data-midcolor="#ec8058"
            data-selection-color="rgba(236,128,88,0.25)"
          >
          <a class="pages-inner-block" href="<?php echo get_home_url(); ?>/lekcziya-1-promo/">
            <h2 class="pages-inner-title">Лекция 1</h2>
            <p>
              3 страницa- Тема лекции с кнопкой "подробнее" и стрелкой как в
              референсе (по стрелке открывается страница с подробным описанием
              лекции)
            </p>
            <div class="arrow">
              <div class="circle"></div>
              <img src="<?php echo get_stylesheet_directory_uri() ?>/assets/front-page/home-arrow.svg" />
              <div class="spine"></div>
            </div>
          </a>
          </li>

          <!-- экран 4 Лекция 2-->
          <li
            id="course-promo-2"
            class="page"
            style="
              --highlight-primary: #f0c854;
              --selection-color: rgba(240, 200, 84, 0.25);
            "
            data-slug="course-promo-2"
            data-primarycolor="#fcd259"
            data-secondarycolor="#e3be4f"
            data-midcolor="#f0c854"
            data-selection-color="rgba(240,200,84,0.25)"
          >
          <a class="pages-inner-block" href="<?php echo get_home_url(); ?>/lekcziya-2-promo/">
            <h2 class="pages-inner-title">Лекция 2</h2>

            <!-- <h3>Подробнее</h3> -->

            <p>
              4 страницa- Тема лекции с кнопкой "подробнее" и стрелкой как в
              референсе (по стрелке открывается страница с подробным описанием
              лекции)
            </p>
            <div class="arrow">
              <div class="circle"></div>
              <img src="<?php echo get_stylesheet_directory_uri() ?>/assets/front-page/home-arrow.svg" />
              <div class="spine"></div>
            </div>
          </a>
          </li>

          <!-- экран 5 Лекция 3-->
          <li
            id="course-promo-3"
            class="page"
            style="
              --highlight-primary: #f152d8;
              --selection-color: rgba(241, 82, 216, 0.25);
            "
            data-slug="course-promo-3"
            data-primarycolor="#fe57e4"
            data-secondarycolor="#e34dcc"
            data-midcolor="#f152d8"
            data-selection-color="rgba(241,82,216,0.25)"
          >
          <a class="pages-inner-block" href="<?php echo get_home_url(); ?>/lekcziya-3-promo/">
            <h2 class="pages-inner-title">Лекция 3</h2>

            <h3 class=" ">Для друзей</h3>

            <p>
              5 страницa- Тема лекции с кнопкой "подробнее" и стрелкой как в
              референсе (по стрелке открывается страница с подробным описанием
              лекции)
            </p>
            <div class="arrow">
              <div class="circle"></div>
              <img src="<?php echo get_stylesheet_directory_uri() ?>/assets/front-page/home-arrow.svg" />
              <div class="spine"></div>
            </div>
          </a>
          </li>

          <!-- Экран 6 Отзывы -->
          <li
            id="pages-screen-review"
            class="page "
            style="
              --highlight-primary: #bbd5dc;
              --selection-color: rgba(187, 213, 220, 0.25);
            "
            data-slug="pages-screen-review"
            data-primarycolor="#C6E1E8"
            data-secondarycolor="#b0c8cf"
            data-midcolor="#bbd5dc"
            data-selection-color="rgba(187,213,220,0.25)"
          >
          <div class="pages-inner-block">
            <!-- <h3>Отзывы</h3> -->
            <h2 class="pages-inner-title">Отзывы</h2>
            <!-- <h3 class="pages-inner-title">Отзывы</h3> -->

            <p class="display-none">
              <!-- Скрыто через класс, потом убрать -->
              6 страница- отзывы Здесь карусель из 7-8 отзывов (имя, текст).
              Текст отзыва накладывается на все тот же фон с лентой (возможно
              на полупрозрачную подложку). Листая вправо или влево можно
              прочитать отзывы.
            </p>

            <div id="front-page-reviews" class="front-page-reviews">
              <div class="front-page-review">
                <h6 class="front-page-review_title">Имя</h6>
                <p class="front-page-review_content">
                  Текст отзыва накладывается на все тот же фон с лентой
                  (возможно на полупрозрачную подложку). Листая вправо или
                  влево можно прочитать отзывы.
                </p>
              </div>
              <!-- front-page-review -->

              <!-- <div class="front-page-review">
                <h6 class="front-page-review_title">Имя 2</h6>
                <p class="front-page-review_content">
                  Текст отзыва накладывается на все тот же фон с лентой
                  (возможно на полупрозрачную подложку). Листая вправо или
                  влево можно прочитать отзывы.
                </p>
              </div> -->
              <!-- front-page-review -->

              <!-- <div class="front-page-review">
                <h6 class="front-page-review_title">Имя 3</h6>
                <p class="front-page-review_content">
                  Текст отзыва накладывается на все тот же фон с лентой
                  (возможно на полупрозрачную подложку). Листая вправо или
                  влево можно прочитать отзывы.
                </p>
              </div> -->
              <!-- front-page-review -->

            </div>
            <!-- front-page-reviews для slider -->

            <!-- Скрыто через класс, потом убрать -->
            <div class="arrow">
              <div class="circle"></div>
              <!-- <img src="<?php echo get_stylesheet_directory_uri() ?>/assets/front-page/home-arrow.svg" /> -->
              <!-- <div class="spine"></div> -->
            </div>
            <!-- Скрыто через класс, потом убрать -->
          </div><!-- pages-inner-block -->
          </li>

          <!-- Экран 7 Хочу знать - feedback  -->
          <li
            id="pages-screen-feedback"
            class="page "
            style="
              --highlight-primary: #b89360;
              --selection-color: rgba(184, 147, 96, 0.25);
            "
            data-slug="pages-screen-feedback"
            data-primarycolor="#c5a06d"
            data-secondarycolor="#aa8652"
            data-midcolor="#b89360"
            data-selection-color="rgba(184,147,96,0.25)"
          >
          <div class="pages-inner-block" href="#">
            <h2 class="pages-inner-title">Хочу знать</h2>

            <p>На какую тему вы хотели бы новую лекцию?</p>

            <form 
            action=""
            id="front-page-feedback-form" 
            class="front-page-form"
            >
              <div class="input-block">
                <span class="border">
                  <input 
                  id="front-page-form-email-input"
                  class="border-input" 
                  type="email" 
                  placeholder="Ваш email">
                </span>
              </div>
              <div class="input-block">
                <span class="border">
                  <input 
                  id="front-page-form-name-input" 
                  class="border-input"
                  type="name" 
                  placeholder="Ваше имя">
                </span>
              </div>
              <div class="input-block">
                <div class="border">
                  <textarea 
                  id="front-page-form-textarea"
                  class="border-input" placeholder="Введите ваше предложение"></textarea>
                </div>
              </div>
              <div class="input-button">
                <button type="submit" class="front-page-form-button disabled " >Отправить
                  <span class="button-line"></span>
                </button>
              </div>
            </form>    

            <div class="arrow display-none">
              <!-- Если нужна стрелка, убрать класс display-none -->
              <div class="circle"></div>
              <img src="<?php echo get_stylesheet_directory_uri() ?>/assets/front-page/home-arrow.svg" />
              <div class="spine"></div>
            </div>
          </div>
          </li>

          <!-- Экран 8 Footer -->
          <li
            id="pages-screen-footer"
            class="page page-footer"
            style="
              --highlight-primary: #7401f0;
              --selection-color: rgba(116, 1, 240, 0.25);
            "
            data-slug="pages-screen-footer"
            data-primarycolor="#7b00ff"
            data-secondarycolor="#6d02e0"
            data-midcolor="#7401f0"
            data-selection-color="rgba(116,1,240,0.25)"
          >
          <div class="pages-inner-block">
            <div class="front-inner-block-footer">
              <p class="pages-inner-privacy-policy-title">
                <a class="privacy-policy-link" href="https://client.raspel.ru/privacy-policy/"
                  >Политика конфиденциальности</a
                >
              </p>
              <div class="page-inner-social-links-wrap">
                <ul class="pages-screen-footer-social-links">
                  <li
                    class="wp-social-link wp-social-link-telegram wp-block-social-link"
                  >
                    <a
                      target="_blank" 
                      href="https://t.me/Dmitriy_Raspel"
                      class="wp-block-social-link-anchor"
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 128 128"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                        focusable="false"
                      >
                        <path
                          d="M28.9700376,63.3244248 C47.6273373,55.1957357 60.0684594,49.8368063 66.2934036,47.2476366 C84.0668845,39.855031 87.7600616,38.5708563 90.1672227,38.528 C90.6966555,38.5191258 91.8804274,38.6503351 92.6472251,39.2725385 C93.294694,39.7979149 93.4728387,40.5076237 93.5580865,41.0057381 C93.6433345,41.5038525 93.7494885,42.63857 93.6651041,43.5252052 C92.7019529,53.6451182 88.5344133,78.2034783 86.4142057,89.5379542 C85.5170662,94.3339958 83.750571,95.9420841 82.0403991,96.0994568 C78.3237996,96.4414641 75.5015827,93.6432685 71.9018743,91.2836143 C66.2690414,87.5912212 63.0868492,85.2926952 57.6192095,81.6896017 C51.3004058,77.5256038 55.3966232,75.2369981 58.9976911,71.4967761 C59.9401076,70.5179421 76.3155302,55.6232293 76.6324771,54.2720454 C76.6721165,54.1030573 76.7089039,53.4731496 76.3346867,53.1405352 C75.9604695,52.8079208 75.4081573,52.921662 75.0095933,53.0121213 C74.444641,53.1403447 65.4461175,59.0880351 48.0140228,70.8551922 C45.4598218,72.6091037 43.1463059,73.4636682 41.0734751,73.4188859 C38.7883453,73.3695169 34.3926725,72.1268388 31.1249416,71.0646282 C27.1169366,69.7617838 23.931454,69.0729605 24.208838,66.8603276 C24.3533167,65.7078514 25.9403832,64.5292172 28.9700376,63.3244248 Z"
                        ></path>
                      </svg>
                      <span class="display-none">Телеграмм</span>
                    </a>
                  </li>

                  <li
                    class="wp-social-link wp-social-link-vk wp-block-social-link"
                  >
                    <a
                      target="_blank" 
                      href="https://vk.com/dmitriy_raspel"
                      class="wp-block-social-link-anchor"
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                        focusable="false"
                      >
                        <path
                          d="M22,7.1c0.2,0.4-0.4,1.5-1.6,3.1c-0.2,0.2-0.4,0.5-0.7,0.9c-0.5,0.7-0.9,1.1-0.9,1.4c-0.1,0.3-0.1,0.6,0.1,0.8 c0.1,0.1,0.4,0.4,0.8,0.9h0l0,0c1,0.9,1.6,1.7,2,2.3c0,0,0,0.1,0.1,0.1c0,0.1,0,0.1,0.1,0.3c0,0.1,0,0.2,0,0.4 c0,0.1-0.1,0.2-0.3,0.3c-0.1,0.1-0.4,0.1-0.6,0.1l-2.7,0c-0.2,0-0.4,0-0.6-0.1c-0.2-0.1-0.4-0.1-0.5-0.2l-0.2-0.1 c-0.2-0.1-0.5-0.4-0.7-0.7s-0.5-0.6-0.7-0.8c-0.2-0.2-0.4-0.4-0.6-0.6C14.8,15,14.6,15,14.4,15c0,0,0,0-0.1,0c0,0-0.1,0.1-0.2,0.2 c-0.1,0.1-0.2,0.2-0.2,0.3c-0.1,0.1-0.1,0.3-0.2,0.5c-0.1,0.2-0.1,0.5-0.1,0.8c0,0.1,0,0.2,0,0.3c0,0.1-0.1,0.2-0.1,0.2l0,0.1 c-0.1,0.1-0.3,0.2-0.6,0.2h-1.2c-0.5,0-1,0-1.5-0.2c-0.5-0.1-1-0.3-1.4-0.6s-0.7-0.5-1.1-0.7s-0.6-0.4-0.7-0.6l-0.3-0.3 c-0.1-0.1-0.2-0.2-0.3-0.3s-0.4-0.5-0.7-0.9s-0.7-1-1.1-1.6c-0.4-0.6-0.8-1.3-1.3-2.2C2.9,9.4,2.5,8.5,2.1,7.5C2,7.4,2,7.3,2,7.2 c0-0.1,0-0.1,0-0.2l0-0.1c0.1-0.1,0.3-0.2,0.6-0.2l2.9,0c0.1,0,0.2,0,0.2,0.1S5.9,6.9,5.9,7L6,7c0.1,0.1,0.2,0.2,0.3,0.3 C6.4,7.7,6.5,8,6.7,8.4C6.9,8.8,7,9,7.1,9.2l0.2,0.3c0.2,0.4,0.4,0.8,0.6,1.1c0.2,0.3,0.4,0.5,0.5,0.7s0.3,0.3,0.4,0.4 c0.1,0.1,0.3,0.1,0.4,0.1c0.1,0,0.2,0,0.3-0.1c0,0,0,0,0.1-0.1c0,0,0.1-0.1,0.1-0.2c0.1-0.1,0.1-0.3,0.1-0.5c0-0.2,0.1-0.5,0.1-0.8 c0-0.4,0-0.8,0-1.3c0-0.3,0-0.5-0.1-0.8c0-0.2-0.1-0.4-0.1-0.5L9.6,7.6C9.4,7.3,9.1,7.2,8.7,7.1C8.6,7.1,8.6,7,8.7,6.9 C8.9,6.7,9,6.6,9.1,6.5c0.4-0.2,1.2-0.3,2.5-0.3c0.6,0,1,0.1,1.4,0.1c0.1,0,0.3,0.1,0.3,0.1c0.1,0.1,0.2,0.1,0.2,0.3 c0,0.1,0.1,0.2,0.1,0.3s0,0.3,0,0.5c0,0.2,0,0.4,0,0.6c0,0.2,0,0.4,0,0.7c0,0.3,0,0.6,0,0.9c0,0.1,0,0.2,0,0.4c0,0.2,0,0.4,0,0.5 c0,0.1,0,0.3,0,0.4s0.1,0.3,0.1,0.4c0.1,0.1,0.1,0.2,0.2,0.3c0.1,0,0.1,0,0.2,0c0.1,0,0.2,0,0.3-0.1c0.1-0.1,0.2-0.2,0.4-0.4 s0.3-0.4,0.5-0.7c0.2-0.3,0.5-0.7,0.7-1.1c0.4-0.7,0.8-1.5,1.1-2.3c0-0.1,0.1-0.1,0.1-0.2c0-0.1,0.1-0.1,0.1-0.1l0,0l0.1,0 c0,0,0,0,0.1,0s0.2,0,0.2,0l3,0c0.3,0,0.5,0,0.7,0S21.9,7,21.9,7L22,7.1z"
                        ></path>
                      </svg>
                      <span class="display-none">Вконтакте</span>
                    </a>
                  </li>

                  <li
                    class="wp-social-link wp-social-link-instagram wp-block-social-link"
                  >
                    <a
                      target="_blank" 
                      href="https://www.instagram.com/dmitriy_raspel"
                      class="wp-block-social-link-anchor"
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                        focusable="false"
                      >
                        <path
                          d="M12,4.622c2.403,0,2.688,0.009,3.637,0.052c0.877,0.04,1.354,0.187,1.671,0.31c0.42,0.163,0.72,0.358,1.035,0.673 c0.315,0.315,0.51,0.615,0.673,1.035c0.123,0.317,0.27,0.794,0.31,1.671c0.043,0.949,0.052,1.234,0.052,3.637 s-0.009,2.688-0.052,3.637c-0.04,0.877-0.187,1.354-0.31,1.671c-0.163,0.42-0.358,0.72-0.673,1.035 c-0.315,0.315-0.615,0.51-1.035,0.673c-0.317,0.123-0.794,0.27-1.671,0.31c-0.949,0.043-1.233,0.052-3.637,0.052 s-2.688-0.009-3.637-0.052c-0.877-0.04-1.354-0.187-1.671-0.31c-0.42-0.163-0.72-0.358-1.035-0.673 c-0.315-0.315-0.51-0.615-0.673-1.035c-0.123-0.317-0.27-0.794-0.31-1.671C4.631,14.688,4.622,14.403,4.622,12 s0.009-2.688,0.052-3.637c0.04-0.877,0.187-1.354,0.31-1.671c0.163-0.42,0.358-0.72,0.673-1.035 c0.315-0.315,0.615-0.51,1.035-0.673c0.317-0.123,0.794-0.27,1.671-0.31C9.312,4.631,9.597,4.622,12,4.622 M12,3 C9.556,3,9.249,3.01,8.289,3.054C7.331,3.098,6.677,3.25,6.105,3.472C5.513,3.702,5.011,4.01,4.511,4.511 c-0.5,0.5-0.808,1.002-1.038,1.594C3.25,6.677,3.098,7.331,3.054,8.289C3.01,9.249,3,9.556,3,12c0,2.444,0.01,2.751,0.054,3.711 c0.044,0.958,0.196,1.612,0.418,2.185c0.23,0.592,0.538,1.094,1.038,1.594c0.5,0.5,1.002,0.808,1.594,1.038 c0.572,0.222,1.227,0.375,2.185,0.418C9.249,20.99,9.556,21,12,21s2.751-0.01,3.711-0.054c0.958-0.044,1.612-0.196,2.185-0.418 c0.592-0.23,1.094-0.538,1.594-1.038c0.5-0.5,0.808-1.002,1.038-1.594c0.222-0.572,0.375-1.227,0.418-2.185 C20.99,14.751,21,14.444,21,12s-0.01-2.751-0.054-3.711c-0.044-0.958-0.196-1.612-0.418-2.185c-0.23-0.592-0.538-1.094-1.038-1.594 c-0.5-0.5-1.002-0.808-1.594-1.038c-0.572-0.222-1.227-0.375-2.185-0.418C14.751,3.01,14.444,3,12,3L12,3z M12,7.378 c-2.552,0-4.622,2.069-4.622,4.622S9.448,16.622,12,16.622s4.622-2.069,4.622-4.622S14.552,7.378,12,7.378z M12,15 c-1.657,0-3-1.343-3-3s1.343-3,3-3s3,1.343,3,3S13.657,15,12,15z M16.804,6.116c-0.596,0-1.08,0.484-1.08,1.08 s0.484,1.08,1.08,1.08c0.596,0,1.08-0.484,1.08-1.08S17.401,6.116,16.804,6.116z"
                        ></path>
                      </svg>
                      <span class="display-none">instagram</span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <h2 class="pages-inner-title display-none">Контакты:</h2>

            <div class="arrow display-none">
              <div class="circle"></div>
              <img src="<?php echo get_stylesheet_directory_uri() ?>/assets/front-page/home-arrow.svg" />
              <div class="spine"></div>
            </div>
          </div>
          </li>

        </ul>

        <script>
          let anchors = [
            "pages-screen-1",
            "pages-screen-2",
            "course-promo-1",
            "course-promo-2",
            "course-promo-3",
            "pages-screen-review",
            "pages-screen-feedback",
            "pages-screen-footer",
          ];

          Site.previousPage = Site.currentPage;
          Site.currentPage = new Home(anchors);

          Site.currentPage.firstRun = function () {
            Site.currentPage.addListeners();
            Site.smoothScroll.scrollToY(
              Site.currentPage.currentIndex * (Site.height || innerHeight)
            );

            let page = Site.currentPage.pages[Site.currentPage.currentIndex];
            Site.currentPage.ribbonColor = {
              primary: Color.hexToRgb(page.dataset.primarycolor),
              secondary: Color.hexToRgb(page.dataset.secondarycolor),
            };
            Ribbon.drawArea = { top: 0, height: innerHeight };
            Ribbon.primaryColor = Site.currentPage.ribbonColor.primary;
            Ribbon.secondaryColor = Site.currentPage.ribbonColor.secondary;
            Ribbon.setMode(Ribbon.Mode.HOME);
            Menu.logo.classList.add("fixed");
            Menu.hireCta.classList.add("fixed");
          };
        </script>
      </div>
    </div>

    <div id="menu-modal"></div>

    <script src="archive_V1/assets/front-page.js"></script>
    <script>
      FontCssLoader.init(
        [
          "https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,300;0,400;0,700;1,300;1,400;1,700&family=Lora:ital,wght@0,400;0,700;1,400;1,700&display=swap",
        ],
        function () {
          Menu.init();

          Site.init();
          if (Site.smoothScroll) {
            Site.smoothScroll.paginate = Site.currentPage.paginate;
            Site.smoothScroll.paginateModifier =
              Site.currentPage.paginateModifier || 1;
          }

          if (Site.currentPage && Site.currentPage.firstRun) {
            Site.currentPage.firstRun();
          }

          Site.startRendering();

          // Site.prepareForIntro();

          // frontPageReviewsSlider();

          // frontPageFeedbackForm();


          document.body.classList.remove("fonts-loading");
          setTimeout(function () {
            requestAnimationFrame(function () {
              Site.playIntro();
            });
          }, 25);
        }
      );

      
    </script>

  </body>
</html>
