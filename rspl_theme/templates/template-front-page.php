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

    <script src="<?php echo get_stylesheet_directory_uri() ?>/assets/front-page/course-promo.js?44"></script>
    <link href="<?php echo get_stylesheet_directory_uri() ?>/assets/front-page/front.css?44" rel="stylesheet" />

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
              <span><?php echo get_post_meta($post-> ID, 'rspl_theme_frontpage_screen_1_letter', true ); ?></span>
              <!-- <span class="project-name">
                <span>С</span>
                мыслы</span> -->
            </a>
          </li>

          <!-- буква экран 2 -->
          <li>
            <a href="#pages-screen-2">
              <span><?php echo get_post_meta($post-> ID, 'rspl_theme_frontpage_screen_2_letter', true ); ?></span>
              <!-- <span class="project-name">
                <span>И</span>
                деи</span> -->
            </a>
          </li>
          
          <!-- буква экран 3 -->
          <li>
            <a href="#course-promo-1">
              <span><?php echo get_post_meta($post-> ID, 'rspl_theme_frontpage_screen_3_letter', true ); ?></span>
              <!-- <span class="project-name">
                <span>Л</span>
                екция 2</span> -->
            </a>
          </li>

          <!-- буква экран 4 -->
          <li>
            <a href="#course-promo-2">
              <span><?php echo get_post_meta($post-> ID, 'rspl_theme_frontpage_screen_4_letter', true ); ?></span>
              <!-- <span class="project-name">
                <span>Л</span>
                екция 2</span> -->
            </a>
          </li>

          <!-- буква экран 5 -->
          <li>
            <a href="#course-promo-3">
              <span><?php echo get_post_meta($post-> ID, 'rspl_theme_frontpage_screen_5_letter', true ); ?></span>
              <!-- <span class="project-name">
                <span>Л</span>
                екция 3</span
              > -->
            </a>
          </li>

          <!-- буква экран 6 review -->
          <li>
            <a href="#pages-screen-review">
              <span><?php echo get_post_meta($post-> ID, 'rspl_theme_frontpage_screen_6_letter', true ); ?></span>
              <!-- <span class="project-name">
                <span>О</span>
                тзывы</span
              > -->
            </a>
          </li>

          <!-- буква экран 7 -->
          <li>
            <a href="#pages-screen-feedback">
              <span><?php echo get_post_meta($post-> ID, 'rspl_theme_frontpage_screen_7_letter', true ); ?></span>
              <!-- <span class="project-name">
                <span>Х</span>
                Хочу знать</span
              > -->
            </a>
          </li>

          <!-- буква экран 8 -->
          <li>
            <a href="#pages-screen-footer">
              <span><?php echo get_post_meta($post-> ID, 'rspl_theme_frontpage_screen_8_letter', true ); ?></span>
              <!-- <span class="project-name"> Footer</span> -->
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
          <div class="pages-inner-block" href="#pages-screen-1">
            <h2 class="pages-inner-title"><?php echo get_post_meta($post-> ID, 'rspl_theme_frontpage_screen_1_title', true ); ?></h2>
            <!-- <h3>Про нас</h3> -->
            <p>
              <?php echo get_post_meta($post-> ID, 'rspl_theme_frontpage_screen_1_description', true ); ?>
            </p>
        
            <div class="arrow display-none">
              <!-- Если нужна стрелка, убрать класс display-none -->
              <div class="circle"></div>
              <img src="<?php echo get_stylesheet_directory_uri() ?>/assets/front-page/home-arrow.svg" />
              <div class="spine"></div>
            </div>
          </div>
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
          <div class="pages-inner-block" href="#pages-screen-2">
            <h2 class="pages-inner-title"><?php echo get_post_meta($post-> ID, 'rspl_theme_frontpage_screen_2_title', true ); ?></h2>

            <!-- <h3>Про наши идеи</h3> -->

            <p>
            <?php echo get_post_meta($post-> ID, 'rspl_theme_frontpage_screen_2_description', true ); ?>
            </p>
            <div class="arrow display-none">
              <!-- Если нужна стрелка, убрать класс display-none -->
              <div class="circle"></div>
              <img src="<?php echo get_stylesheet_directory_uri() ?>/assets/front-page/home-arrow.svg" />
              <div class="spine"></div>
            </div>
          </div>
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
          <a class="pages-inner-block" href="<?php echo get_home_url(); ?>/course-promo-1/">
            <h2 class="pages-inner-title"><?php echo get_post_meta($post-> ID, 'rspl_theme_frontpage_screen_3_title', true ); ?></h2>
            <p>
            <?php echo get_post_meta($post-> ID, 'rspl_theme_frontpage_screen_3_description', true ); ?>
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
          <a class="pages-inner-block" href="<?php echo get_home_url(); ?>/course-promo-2/">
            <h2 class="pages-inner-title"><?php echo get_post_meta($post-> ID, 'rspl_theme_frontpage_screen_4_title', true ); ?></h2>

            <!-- <h3>Подробнее</h3> -->

            <p>
              <?php echo get_post_meta($post-> ID, 'rspl_theme_frontpage_screen_4_description', true ); ?>
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
          <a class="pages-inner-block" href="<?php echo get_home_url(); ?>/course-promo-3/">
            <h2 class="pages-inner-title"><?php echo get_post_meta($post-> ID, 'rspl_theme_frontpage_screen_5_title', true ); ?></h2>

            <h3 class=" ">Для друзей</h3>

            <p>
              <?php echo get_post_meta($post-> ID, 'rspl_theme_frontpage_screen_5_description', true ); ?>
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
            <h3><?php echo get_post_meta($post-> ID, 'rspl_theme_frontpage_screen_6_title', true ); ?></h3>
            <!-- <h2 class="pages-inner-title">Отзывы</h2> -->
            <!-- <h3 class="pages-inner-title">Отзывы</h3> -->

            <p class="display-none">
              <!-- Скрыто через класс, потом убрать -->
              6 страница- отзывы Здесь карусель из 7-8 отзывов (имя, текст).
              Текст отзыва накладывается на все тот же фон с лентой (возможно
              на полупрозрачную подложку). Листая вправо или влево можно
              прочитать отзывы.
            </p>

            <!-- Разметка для слайдера -->
          <div id="front-page-reviews" class="front-page-reviews itcss"> 
            <div class="front-page-review__wrapper itcss__wrapper">
              <div class="front-page-review__items itcss__items">
                
                <div class="front-page-review__item itcss__item">
                  <h6 class="front-page-review__item_title">Имя 1</h6>
                  <p class="front-page-review__item_content">
                    Текст отзыва накладывается на все тот же фон с лентой
                    (возможно на полупрозрачную подложку). Листая вправо или
                    влево можно прочитать отзывы.
                  </p>
                </div>

                <div class="front-page-review__item itcss__item">
                  <h6 class="front-page-review__item_title">Имя 2</h6>
                  <p class="front-page-review__item_content">
                    Текст отзыва накладывается на все тот же фон с лентой
                    (возможно на полупрозрачную подложку). Листая вправо или
                    влево можно прочитать отзывы.
                  </p>
                </div>

                <div class="front-page-review__item itcss__item">
                  <h6 class="front-page-review__item_title">Имя 3</h6>
                  <p class="front-page-review__item_content">
                    Текст отзыва накладывается на все тот же фон с лентой
                    (возможно на полупрозрачную подложку). Листая вправо или
                    влево можно прочитать отзывы.
                  </p>
                </div>
                
              </div>
            </div>
          </div>
            
            

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
            <h2 class="pages-inner-title"><?php echo get_post_meta($post-> ID, 'rspl_theme_frontpage_screen_7_title', true ); ?></h2>

            <p><?php echo get_post_meta($post-> ID, 'rspl_theme_frontpage_screen_7_description', true ); ?></p>

            <form 
            name="feedback"
            method="post"
            action="<?php echo esc_url( admin_url('admin-ajax.php') ); ?>"
            id="front-page-feedback-form" 
            class="front-page-form"
            >            
              <div class="input-block">
                <span class="border">
                  <input
				  name="name"				  
                  id="front-page-form-name-input" 
                  class="border-input"
                  type="name" 
                  placeholder="Ваше имя"
				  data-validate="require" >
                </span>
              </div>
			  
			  <div class="input-block">
                <span class="border">
                  <input 
				  name="email"
                  id="front-page-form-email-input"
                  class="border-input" 
                  type="email" 
                  placeholder="Ваш email"
				  data-validate="require">
                </span>
              </div>

              <div class="input-block">
                <div class="border">
                  <textarea 
				  name="message" 
				  id="front-page-form-textarea" 
				  class="border-input" 
				  placeholder="Введите ваше предложение"
				  data-validate="require"
				  ></textarea>
                </div>
              </div>


              <div class="input-button">
                <button type="submit" id="front-page-form-button" class="front-page-form-button disabled" >Отправить
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
                
              <?php 
                if ( function_exists( 'the_privacy_policy_link' ) ) {
                  the_privacy_policy_link();
                } ?>
              </p>
              <div class="page-inner-social-links-wrap">

              <?php
                if ( has_nav_menu( 'social' ) ) :
        
                  wp_nav_menu(
                    array(
                      'theme_location'  => 'social',
                      'items_wrap'      => '<ul id="front-page-footer-social-menu" class="%2$s">%3$s</ul>',
                      'link_before'     => '<span class="screen-reader-text">',
                      'link_after'      => '</span>' . rspl_theme_get_icon_svg( 'link' ),
                      'depth'           => 1,
                      'container'       => '',
                      )
                  );
                endif; ?> 
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

    

    <script src="<?php echo get_stylesheet_directory_uri() ?>/assets/simple-adaptive-slider/simple-adaptive-slider.js?40"></script>
    
    <script src='<?php echo home_url(); ?>/wp-includes/js/jquery/jquery.min.js?ver=3.6.0' id='jquery-core-js'></script>
    
	<script type="text/javascript">

	///// переменные:
	var feedbackForm = document.forms.feedback;
	// var formAction 	= feedbackForm.getAttribute("action");
  var formAction = '<?php echo esc_url( admin_url('admin-ajax.php') ); ?>';

	var formButton	= document.getElementById('front-page-form-button');
	var formName = feedbackForm.name;
	var formEmail = feedbackForm.email;
	var formMessage = feedbackForm.message;


	// Имя
	formName.addEventListener('focusout', (event) => {
		validateName();
	});
	formName.addEventListener('focus', (event) => {
		formName.classList.remove("_error");
		formName.setAttribute( 'data-validate', 'require' );
	});
	// Email
	formEmail.addEventListener('focusout', (event) => {
		validateEmail();
	});
	formEmail.addEventListener('focus', (event) => {
		formEmail.classList.remove("_error");
		formEmail.setAttribute( 'data-validate', 'require' );
	});
	// Сообщение
	formMessage.addEventListener('focusout', (event) => {
		validateMessage();
	});
	formMessage.addEventListener('focus', (event) => {
		formMessage.classList.remove("_error");
		formMessage.setAttribute( 'data-validate', 'require' );
	});

	// Проверка имени
	function validateName() {
		var val = formName.value;
		
		if (val === "") {
			formName.setAttribute( 'data-validate', 'require' );
			formName.classList.add("_error");
		} else {
			formName.classList.remove("_error");
			formName.setAttribute( 'data-validate', 'success' );
		}
		removeDisabled();
	} 

	// проверка Email
	function validateEmail() {
		if (emailTest(formEmail)) {
			formEmail.classList.add("_error");
			formEmail.setAttribute( 'data-validate', 'require' );
			return false;
		} else {
			formEmail.classList.remove("_error");
			formEmail.setAttribute( 'data-validate', 'success' );
		return true;
		}
		removeDisabled();
	}
	//Функция тест email
	function emailTest(input) {
	return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(input.value);
	}

	// Проверка Сообщения
	function validateMessage() {
		var val = formMessage.value;
		if (val === "") {
			formMessage.classList.add("_error");
			formMessage.setAttribute( 'data-validate', 'require' );
		} else {
			formMessage.classList.remove("_error");
			formMessage.setAttribute( 'data-validate', 'success' );
		}
		removeDisabled();
	}

	// Убираем Disabled класс с кнопки
	function removeDisabled() {
		if ( formName.getAttribute( 'data-validate' ) === 'success' && formMessage.getAttribute( 'data-validate' ) === 'success' && formEmail.getAttribute( 'data-validate' ) === 'success' ) {
			formButton.classList.remove("disabled");
		} else {
			formButton.classList.add("disabled");
		}
	}





	// только отправка
	jQuery( function( $ ){
	$( '#front-page-form-button' ).click(function(){
		event.preventDefault();

		var nameVal = $( '#front-page-form-name-input' ).val();
		var messageVal = $( '#front-page-form-textarea' ).val();
		var emailVal = $( '#front-page-form-email-input' ).val();

			if ( $( '#front-page-form-button' ).hasClass("disabled") ) {
			// console.log('button disabled');
		} else {
			var formData = {
				action: 'tgform',
				name: nameVal,
				email: emailVal,
				message: messageVal
			};
			
			$.ajax({
				url: formAction, // 
				type: 'POST',
				data: formData, 
				beforeSend: function( xhr ) {
					$( '#front-page-feedback-form' ).addClass(" _sending");
					$( '#front-page-form-button' ).addClass("disabled");
					$( '#front-page-form-button' ).text( 'Отправка...' );
				},
				success: function( data ) {
					$( '#front-page-feedback-form' ).removeClass(" _sending");
					$( '#front-page-form-button' ).text( 'Отправлено' );
				}
			});
		}
	});
});
// отправлено

</script>
	
  </body>
</html>
