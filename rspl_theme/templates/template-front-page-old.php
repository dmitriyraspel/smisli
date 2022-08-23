<?php
/**
 * Template Name: Template Front Page old
 * Template Post Type: post, page
 * 
 * @link https://developer.wordpress.org/themes/template-files-section/page-template-files/
 *
 * @package rspl-theme
 */

// ссылка на логотип
$custom_logo_url = wp_get_attachment_image_src( get_theme_mod( 'custom_logo' ), 'full' ); 
?>

<!DOCTYPE html>
<html <?php language_attributes(); ?>>

<head>
  <meta charset="UTF-8" />
  <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" name="viewport" />
  <meta content="ie=edge" http-equiv="X-UA-Compatible" />

  
  <script src="<?php echo get_stylesheet_directory_uri() ?>/assets/front-page/test-front.js?34"></script>
  
  <link href="<?php echo get_stylesheet_directory_uri() ?>/assets/front-page/front.css?33" rel="stylesheet" />
  

  <!-- шрифты тест --> 
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <!-- <link
    href="https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,300;0,400;0,700;1,300;1,400;1,700&family=Lora:ital,wght@0,400;0,700;1,400;1,700&display=swap"
    rel="stylesheet"> -->

  <title><?php bloginfo('name'); ?></title>
  <meta name="description" content="<?php bloginfo('description'); ?>" />
</head>

<body class="home ">
  <canvas id="ribbon"></canvas>

  <div id="logo">
    <a class="no-barba site-title" href="<?php echo get_home_url(); ?>">
      <img src="<?php echo $custom_logo_url[0] ?>" class="custom-logo" alt="">
    </a>
  </div>
  

  <div id="hire-us" class="display-none">
    <a href="#contact">О нас</a>
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

      <ul id="bullets" style="--selection-color: rgba(231, 157, 64, 0.25)">
        <!-- буква экран 1 -->
        <li>
          <a href="#pages-screen-1">
            <span>С</span>
            <span class="project-name">
              <span>С</span>
              мыслы</span>
          </a>
        </li>

        <!-- буква экран 2 -->
        <li>
          <a href="#pages-screen-2">
            <span>И</span>
            <span class="project-name">
              <span>И</span>
              деи</span>
          </a>
        </li>

        <!-- буква экран 3 -->
        <li>
          <a href="#pages-screen-3">
            <span>Л</span>
            <span class="project-name">
              <span>Л</span>
              екция 1</span>
          </a>
        </li>

        <li>
          <a href="#pages-screen-4">
            <span>Л</span>
            <span class="project-name">
              <span>Л</span>
              екция 2</span>
          </a>
        </li>

        <li>
          <a href="#pages-screen-5">
            <span>Л</span>
            <span class="project-name">
              <span>Л</span>
              екция 3</span>
          </a>
        </li>

        <li>
          <a href="#pages-screen-6">
            <span>О</span>
            <span class="project-name">
              <span>О</span>
              тзывы</span>
          </a>
        </li>

        <li>
          <a href="#pages-screen-7">
            <span>Х</span>
            <span class="project-name">
              <span>Х</span>
              Хочу знать</span>
          </a>
        </li>

        <li>
          <a href="#pages-screen-footer">
            <span>П</span>
            <span class="project-name">
              Footer</span>
          </a>
        </li>

      </ul>


      <ul id="pages">

        <!-- Экран 1 Смыслы -->
        <li id="pages-screen-1" class="page" style="
              --highlight-primary: #e79d40;
              --selection-color: rgba(231, 157, 64, 0.25);
            " data-slug="pages-screen-1" data-primarycolor="#F3A748" data-secondarycolor="#DB9338"
          data-midcolor="#e79d40" data-selection-color="rgba(231,157,64,0.25)">
          <a class="pages-inner-block" href="#">
            <h2 class="pages-inner-title">Смыслы</h2>

            <!-- <h3>Про нас</h3> -->

            <p>
              Миссия, описание проекта. Рыбатекст используется дизайнерами, проектировщиками и фронтендерами, когда
              нужно быстро заполнить макеты или прототипы содержимым.
            </p>
            <div class="arrow">
              <div class="circle"></div>
              <img src="<?php echo get_stylesheet_directory_uri() ?>/assets/front-page/home-arrow.svg" />
              <div class="spine"></div>
            </div>
          </a>
        </li>

        <!-- экран 2 Идеи для проекта-->
        <li id="pages-screen-2" class="page" style="
              --highlight-primary: #338fb9;
              --selection-color: rgba(51, 143, 185, 0.25);
            " data-slug="pages-screen-2" data-primarycolor="#389CCA" data-secondarycolor="#2E82A8"
          data-midcolor="#338fb9" data-selection-color="rgba(51,143,185,0.25)">
          <a class="pages-inner-block" href="#">

            <h2 class="pages-inner-title">Идеи для проекта</h2>

            <!-- <h3>Про наши идеи</h3> -->

            <p>
              2 страница- объяснение почему это не видео, почему это не личный бренд/эксперт
              про методологию- как устроено и почему это эффективно про аутогенную тренировку-
              мягкая работа с подсознанием для образования новых нейронных связей.
              Рыбатекст используется дизайнерами, проектировщиками и фронтендерами, когда нужно быстро заполнить макеты
              или прототипы содержимым.
            </p>
            <div class="arrow">
              <div class="circle"></div>
              <img src="<?php echo get_stylesheet_directory_uri() ?>/assets/front-page/home-arrow.svg" />
              <div class="spine"></div>
            </div>

          </a>
        </li>

        <!-- экран 3 Лекция 1-->
        <li id="pages-screen-3" class="page  " style="
              --highlight-primary: #ec8058;
              --selection-color: rgba(236, 128, 88, 0.25);
            " data-slug="pages-screen-3" data-primarycolor="#f5865e" data-secondarycolor="#e37a52"
          data-midcolor="#ec8058" data-selection-color="rgba(236,128,88,0.25)">
          <a class="pages-inner-block" href="#">

            <h2 class="pages-inner-title">Лекция 1</h2>
            <p>
              3 страницa- Тема лекции с кнопкой "подробнее" и стрелкой как в референсе (по стрелке открывается страница
              с подробным описанием лекции)

            </p>
            <div class="arrow">
              <div class="circle"></div>
              <img src="<?php echo get_stylesheet_directory_uri() ?>/assets/front-page/home-arrow.svg" />
              <div class="spine"></div>
            </div>

          </a>
        </li>

        <!-- экран 4 Лекция 2-->
        <li id="pages-screen-4" class="page" style="
              --highlight-primary: #f0c854;
              --selection-color: rgba(240, 200, 84, 0.25);
            " data-slug="pages-screen-4" data-primarycolor="#fcd259" data-secondarycolor="#e3be4f"
          data-midcolor="#f0c854" data-selection-color="rgba(240,200,84,0.25)">
          <a class="pages-inner-block" href="#">
            <h2 class="pages-inner-title">Лекция 2</h2>

            <!-- <h3>Подробнее</h3> -->

            <p>
              4 страницa- Тема лекции с кнопкой "подробнее" и стрелкой как в референсе (по стрелке открывается страница
              с подробным описанием лекции)
            </p>
            <div class="arrow">
              <div class="circle"></div>
              <img src="<?php echo get_stylesheet_directory_uri() ?>/assets/front-page/home-arrow.svg" />
              <div class="spine"></div>
            </div>
          </a>
        </li>

        <!-- экран 5 лекция 3 -->
        <li id="pages-screen-5" class="page" style="
              --highlight-primary: #f152d8;
              --selection-color: rgba(241, 82, 216, 0.25);
            " data-slug="pages-screen-5" data-primarycolor="#fe57e4" data-secondarycolor="#e34dcc"
          data-midcolor="#f152d8" data-selection-color="rgba(241,82,216,0.25)">
          <a class="pages-inner-block" href="#">
            <h2 class="pages-inner-title">Лекция 3</h2>

            <h3>Для друзей</h3>

            <p>
              5 страницa- Тема лекции с кнопкой "подробнее" и стрелкой как в референсе (по стрелке открывается страница
              с подробным описанием лекции)
            </p>
            <div class="arrow">
              <div class="circle"></div>
              <img src="<?php echo get_stylesheet_directory_uri() ?>/assets/front-page/home-arrow.svg" />
              <div class="spine"></div>
            </div>
          </a>
        </li>

        <!-- Экран 6 Отзывы -->
        <li id="pages-screen-6" class="page  " style="
              --highlight-primary: #bbd5dc;
              --selection-color: rgba(187, 213, 220, 0.25);
            " data-slug="pages-screen-6" data-primarycolor="#C6E1E8" data-secondarycolor="#b0c8cf"
          data-midcolor="#bbd5dc" data-selection-color="rgba(187,213,220,0.25)">
          <div class="pages-inner-block">
            <!-- <h3>Отзывы</h3> -->
            <h2 class="pages-inner-title">Отзывы</h2>
            <!-- <h3 class="pages-inner-title">Отзывы</h3> -->

            <p class="display-none">
              <!-- Скрыто через класс, потом убрать -->
              6 страница- отзывы Здесь карусель из 7-8 отзывов (имя, текст). Текст отзыва накладывается на все тот же
              фон с лентой (возможно на полупрозрачную подложку). Листая вправо или влево можно прочитать отзывы.
            </p>

            <div id="front-page-reviews" 
            class="front-page-reviews"
            
            >

              <div class="front-page-review">
                <h6 class="front-page-review_title">Имя</h6>
                <p class="front-page-review_content">Текст отзыва накладывается на все тот же фон с лентой (возможно на
                  полупрозрачную подложку). Листая вправо или влево можно прочитать отзывы.</p>
              </div><!-- front-page-review -->

              <div class="front-page-review">
                <h6 class="front-page-review_title">Имя 2</h6>
                <p class="front-page-review_content">Текст отзыва накладывается на все тот же фон с лентой (возможно на
                  полупрозрачную подложку). Листая вправо или влево можно прочитать отзывы.</p>
              </div><!-- front-page-review -->

              <div class="front-page-review">
                <h6 class="front-page-review_title">Имя 3</h6>
                <p class="front-page-review_content">Текст отзыва накладывается на все тот же фон с лентой (возможно на
                  полупрозрачную подложку). Листая вправо или влево можно прочитать отзывы.</p>
              </div><!-- front-page-review -->


            </div><!-- front-page-reviews для slider -->


            <!-- Скрыто через класс, потом убрать -->
            <div class="arrow">
              <div class="circle"></div>
              <!-- <img src="assets/img/home-arrow.svg" /> -->
              <!-- <div class="spine"></div> -->
            </div><!-- Скрыто через класс, потом убрать -->

          </div><!-- pages-inner-block -->
        </li>

        <!-- Экран 7 Хочу знать -->
        <li id="pages-screen-7" 
            class="page  " 
            style="
              --highlight-primary: #b89360;
              --selection-color: rgba(184, 147, 96, 0.25);" 
            data-slug="pages-screen-7" 
            data-primarycolor="#c5a06d" 
            data-secondarycolor="#aa8652"
            data-midcolor="#b89360" 
            data-selection-color="rgba(184,147,96,0.25)"
            >
            <div class="pages-inner-block" href="#">
              <h2 class="pages-inner-title">Хочу знать</h2>

              <p>
                На какую тему вы хотели бы новую лекцию?
              </p>
              
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
        <li id="pages-screen-footer" class="page page-footer" style="
              --highlight-primary: #f97838;
              --selection-color: rgba(249, 120, 56, 0.25);
            " data-slug="pages-screen-footer" data-primarycolor="#ff874b" data-secondarycolor="#F26924"
          data-midcolor="#f97838" data-selection-color="rgba(249,120,56,0.25)">
          <div class="pages-inner-block">

            <div class="front-inner-block-footer">
              <p class="pages-inner-privacy-policy-title">
              <?php
                if ( function_exists( 'the_privacy_policy_link' ) ) {
                  the_privacy_policy_link();
                } 
              ?>
              </p>
              
              <?php
                if ( has_nav_menu( 'social' ) ) : 
                  get_template_part( 'template-parts/navigation/social-nav' );
                endif; 
              ?>

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
          "pages-screen-3",
          "pages-screen-4",
          "pages-screen-5",
          "pages-screen-6",
          "pages-screen-7",
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
          // Menu.hireCta.classList.add("fixed");
        };
      </script>

    </div>
  </div>


  <div id="menu-modal"></div>

  <script>
    FontCssLoader.init(
      [
        "https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,300;0,400;0,700;1,300;1,400;1,700&family=Lora:ital,wght@0,400;0,700;1,400;1,700&display=swap",
      ],
      function () {
        Menu.init();

        frontPageReviewsSlider();

        frontPageFeedbackForm();

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
        // document.body.classList.remove("fonts-loading");
        // setTimeout(function () {
        //   requestAnimationFrame(function () {
        //     Site.playIntro();
        //   });
        // }, 25);
      }
    );
  </script>



</body>

</html>