<?php
/**
 * Template Name: Template LK
 * Template Post Type: page
 * 
 * @link https://developer.wordpress.org/themes/template-files-section/page-template-files/
 *
 * @package rspl-theme
 */

get_header();
?>

	<main id="primary" class="site-main">

		<?php
		while ( have_posts() ) :
			the_post();
      ?>
			
      <article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>

        <header class="entry-header lk-entry-header">
          <?php the_title( '<h1 class="entry-title lk-entry-title">', '</h1>' ); ?>
        </header><!-- .entry-header -->
        
        <div class="entry-content">
          <?php
          the_content();
          ?>
          
            <div class="alignwide lk-wrap">
              
              <section id="lk-menu-content-toggle" class="lk-menu">

                <a 
                href="#" id="lk-menu-lekcii" 
                class="lk-menu-link lk-menu-lekcii active "
                aria-controls="lk-content-lekcii"
                aria-expanded="true"
                onclick="changeCurrentContent(this)"
                >
                  <h2>СМЫСЛЫ</h2>
                  <h4>ЛЕКЦИИ САМОПОМОЩИ</h4>
                </a>
              
                <a 
                href="#lk-content-flagman" 
                id="lk-menu-flagman" 
                class="lk-menu-link lk-menu-flagman "
                aria-controls="lk-content-flagman"
                aria-expanded="false"
                onclick="changeCurrentContent(this)"
                >
                  <h2>МЫ</h2>
                  <h4>ФЛАГМАНСКИЙ ПРОЕКТ</h4>
                </a>
                
                <a 
                href="#" 
                id="lk-menu-skazki" 
                class="lk-menu-link lk-menu-skazki "
                aria-controls="lk-content-skazki"
                aria-expanded="false"
                onclick="changeCurrentContent(this)"
                >
                  <h2>СМЫШЛЕНЫШ</h2>
                  <h4>СКАЗКОТЕРАПИЯ ДЛЯ ДЕТЕЙ</h4>
                </a>

              </section><!-- /.lk-menu -->

              <div class="lk-content">

                <div id="lk-content-lekcii" class="lk-content-items lk-content-lekcii active ">
                  
                  <div class="lk-content-item">
                      
                    <a href="#" class="lk-content-item-thumbnail">
                      <img src="http://localhost/smisli/wp-content/uploads/2022/12/estestvennaya-motivacziya.png" class="" alt="" decoding="async" loading="lazy">
                    </a>
                    
                    <div class="lk-content-item-description">
                      <a href="#" class="lk-content-item-title">СТРАХ БУДУЩЕГО. ЖИЗНЕСТОЙКОСТЬ</a>
                      <span class="lk-content-item-subtitle">КАК ЖИТЬ И БЫТЬ В НОВОЙ РЕАЛЬНОСТИ</span>
                      <span class="lk-content-item-access">ЛЕКЦИЯ ДОСТУПНА 30 ДНЕЙ</span>
                      
                      <a 
                      onclick="addToWishlist(this)"
                      href="#1"
                      class="lk-content-item-wishlist-btn " 
                      >
                      <span class="screen-reader-text">добавить в избранное</span>
                      </a>

                      <a href="#" class="button lk-content-item-button">ИЗУЧИТЬ</a>
                    
                    </div><!-- /.lk-content-item-description -->
                  </div><!-- /.lk-content-item -->

                    <div class="lk-content-item">
                      
                        <a href="#" class="lk-content-item-thumbnail">
                          <img src="http://localhost/smisli/wp-content/uploads/2022/11/test1.png" class="" alt="" decoding="async" loading="lazy">
                        </a>
                      
                      <div class="lk-content-item-description">
                        <a href="#" class="lk-content-item-title">КЕМ Я СТАНУ, КОГДА ВЫРАСТУ</a>
                        <span class="lk-content-item-subtitle">ПРЕДНАЗНАЧЕНИЕ? САМОРЕАЛИЗАЦИЯ ДЛЯ ВЗРОСЛЫХ</span>
                        <span class="lk-content-item-access">ЛЕКЦИЯ ДОСТУПНА 30 ДНЕЙ</span>

                        <a 
                        onclick="addToWishlist(this)"
                        href="#1"
                        class="lk-content-item-wishlist-btn active" 
                        >
                          <span class="screen-reader-text">добавить в избранное</span>
                        </a>

                        <a href="#" class="button lk-content-item-button">ИЗУЧИТЬ</a>
            
                        
                        
                      </div><!-- /.lk-content-item-description -->
                    </div><!-- /.lk-content-item -->

                  <div class="lk-content-item">
                    
                    <a href="#" class="lk-content-item-thumbnail">
                      <img src="http://localhost/smisli/wp-content/uploads/2022/08/gallery1-1.jpg" class="" alt="" decoding="async" loading="lazy">
                    </a>
                  
                    <div class="lk-content-item-description">
                      <a href="#" class="lk-content-item-title">СТРАХ БУДУЩЕГО. ЖИЗНЕСТОЙКОСТЬ</a>
                      <span class="lk-content-item-subtitle">КАК ЖИТЬ И БЫТЬ В НОВОЙ РЕАЛЬНОСТИ</span>
                      <span class="lk-content-item-access">ЛЕКЦИЯ ДОСТУПНА 30 ДНЕЙ</span>
                      
                      <a 
                      onclick="addToWishlist(this)"
                      href="#1"
                      class="lk-content-item-wishlist-btn " 
                      >
                      <span class="screen-reader-text">добавить в избранное</span>
                      </a>

                      <a href="#" class="button lk-content-item-button">ИЗУЧИТЬ</a>
                    
                    </div><!-- /.lk-content-item-description -->
                  </div><!-- /.lk-content-item -->

                  <div class="lk-content-item finished">

                      <a href="#" class="lk-content-item-thumbnail">
                        <img src="http://localhost/smisli/wp-content/uploads/2022/08/client2-1.png" class="" alt="" decoding="async" loading="lazy">
                      </a>
                    
                    <div class="lk-content-item-description">
                      <a href="#" class="lk-content-item-title">КЕМ Я СТАНУ, КОГДА ВЫРАСТУ</a>
                      <span class="lk-content-item-subtitle">ПРЕДНАЗНАЧЕНИЕ? САМОРЕАЛИЗАЦИЯ ДЛЯ ВЗРОСЛЫХ</span>
                      <span class="lk-content-item-access">ЗАВЕРШЕНО</span>
                      
                      <a 
                      onclick="addToWishlist(this)"
                      href="#1"
                      class="lk-content-item-wishlist-btn " 
                      >
                      <span class="screen-reader-text">добавить в избранное</span>
                    </a>
                    
                    <a href="#" class="button lk-content-item-button">ИЗУЧИТЬ</a>
                    
                    </div><!-- /.lk-content-item-description -->
                  </div><!-- /.lk-content-item -->

                </div><!-- /.lk-content-lekcii -->



                <div id="lk-content-flagman" class="lk-content-items lk-content-flagman ">

                  <div class="lk-content-item">
                    <a href="#" class="lk-content-item-thumbnail">
                      <img src="http://localhost/smisli/wp-content/uploads/2022/12/frame-2726.jpg" class="" alt="" decoding="async" loading="lazy">
                    </a>
                  
                    <a href="" class="lk-content-item-description">
                      <span class="lk-content-item-title">СЕССИЯ 1. ЛУЧШИЙ ДЕНЬ СЕГОДНЯ</span>
                    </a><!-- /.lk-content-item-description -->

                    <a 
                      onclick="addToWishlist(this)"
                      href="#1"
                      class="lk-content-item-wishlist-btn  " 
                      >
                      <span class="screen-reader-text">добавить в избранное</span>
                    </a>
                  </div><!-- /.lk-content-item -->

                  <div class="lk-content-item">
                    <a href="#" class="lk-content-item-thumbnail">
                      <img src="http://localhost/smisli/wp-content/uploads/2022/12/frame-2726.jpg" class="" alt="" decoding="async" loading="lazy">
                    </a>
                    
                    <div class="lk-content-item-description">
                      <span class="lk-content-item-title">СЕССИЯ 2. ЭМОЦИОНАЛЬНЫЙ ИММУНИТЕТ</span>
                      <span class="lk-content-item-access">Завершено</span>
                    </div><!-- /.lk-content-item-description -->

                    <a 
                      onclick="addToWishlist(this)"
                      href="#1"
                      class="lk-content-item-wishlist-btn active " 
                      >
                      <span class="screen-reader-text">добавить в избранное</span>
                    </a>
                  </div><!-- /.lk-content-item -->

                  <div class="lk-content-item inactive">
                    <a href="#" class="lk-content-item-thumbnail">
                      <img src="http://localhost/smisli/wp-content/uploads/2022/12/frame-2726.jpg" class="" alt="" decoding="async" loading="lazy">
                    </a>
                  
                    <div class="lk-content-item-description">
                      <span class="lk-content-item-title">СЕССИЯ 3. ПРЕДЛАГАЕМЫЕ ОБСТОЯТЕЛЬСТВА</span>
                      <span class="lk-content-item-access">Раздел откроется после выполнения задания к предыдущей сессии</span>
                    </div><!-- /.lk-content-item-description -->

                    <a 
                      onclick="addToWishlist(this)"
                      href="#"
                      class="lk-content-item-wishlist-btn " 
                      >
                        <span class="screen-reader-text">добавить в избранное</span>
                    </a>
                  </div><!-- /.lk-content-item -->

                  <div class="lk-content-item inactive">
                    <a href="#" class="lk-content-item-thumbnail">
                      <img src="http://localhost/smisli/wp-content/uploads/2022/12/frame-2726.jpg" class="" alt="" decoding="async" loading="lazy">
                    </a>
                    
                    <div class="lk-content-item-description">
                      <span class="lk-content-item-title">СЕССИЯ 4. ДОВЕРЯЙ И ДЕЛАЙ</span>
                      <span class="lk-content-item-access">Раздел откроется после выполнения задания к предыдущей сессии</span>
                    </div><!-- /.lk-content-item-description -->

                    <a 
                      onclick="addToWishlist(this)"
                      href="#"
                      class="lk-content-item-wishlist-btn active " 
                      >
                        <span class="screen-reader-text">добавить в избранное</span>
                    </a>
                  </div><!-- /.lk-content-item -->

                  <div class="lk-content-item">
                    
                    <a href="#" class="lk-content-item-thumbnail">
                      <img src="http://localhost/smisli/wp-content/uploads/2022/12/frame-2726.jpg" class="" alt="" decoding="async" loading="lazy">
                    </a>
                    
                    <a href="" class="lk-content-item-description">
                      <span class="lk-content-item-title">ЗАВЕРШЕНИЕ: ОБРАТНАЯ СВЯЗЬ, БОНУС</span>
                    </a><!-- /.lk-content-item-description -->

                    <a 
                      onclick="addToWishlist(this)"
                      href="#"
                      class="lk-content-item-wishlist-btn " 
                      >
                        <span class="screen-reader-text">добавить в избранное</span>
                    </a>
                  </div><!-- /.lk-content-item -->

                  <div class="progress-wrap">
                    <span>ПРОГРЕСС: 1/4</span>
                    <div role="progressbar" class="lk-content-progress-bar">
                      <div class="lk-content-progress-bar-progress" style="width: 20%"></div>
                    </div>
                  </div><!-- progress-wrap -->

                </div><!-- /.lk-content-flagman -->


                <div id="lk-content-skazki" class="lk-content-items lk-content-skazki ">

                  <nav class="lk-content-skazki-nav">
                    <a 
                    href="#alltales" id="lk-content-skazki_alltales" 
                    class="button lk-content-skazki_nav-button active"
                    aria-controls="lk-content-skazki_alltales-content"
                    aria-expanded="true"
                    onclick="changeTalesContent(this)"
                    >
                    ВСЕ СКАЗКИ
                    </a>
                    
                    <a 
                    href="#sptales" id="lk-content-skazki_sptales" 
                    class="button lk-content-skazki_nav-button "
                    aria-controls="lk-content-skazki_sptales-content"
                    aria-expanded="false"
                    onclick="changeTalesContent(this)"
                    >
                    ОСОБЕННЫЕ СКАЗКИ
                    </a>
                  </nav>

                  <p class="lk-content-skazki-title" >Здесь будет текстовое описание раздела «Особенные сказки»</p>
                  
                  <div class="lk-content-item ">
                      <a href="#" class="lk-content-item-thumbnail">
                        <img src="http://localhost/smisli/wp-content/uploads/2023/01/skazki_1.jpg" class="" alt="" decoding="async" loading="lazy">
                      </a>
                    
                    <div class="lk-content-item-description">
                      <a href="#" class="lk-content-item-title">КАК СМЫШЛЕНЫШ ПОДРУЖИЛСЯ СО СТРАШИЛКОЙ</a>
                      <span class="lk-content-item-subtitle">СТРАХ ТЕМНОТЫ</span>
                      <span class="lk-content-item-access">ЛЕКЦИЯ ДОСТУПНА 30 ДНЕЙ</span>
                      
                      <a 
                      onclick="addToWishlist(this)"
                      href="#1"
                      class="lk-content-item-wishlist-btn " 
                      >
                      <span class="screen-reader-text">добавить в избранное</span>
                    </a>

                    <a href="#" class="button lk-content-item-button">ПЕРЕЙТИ К СКАЗКЕ</a>
                    
                    </div><!-- /.lk-content-item-description -->
                  </div><!-- /.lk-content-item -->

                  <div class="lk-content-item sptales">
                      <a href="#" class="lk-content-item-thumbnail">
                        <img src="http://localhost/smisli/wp-content/uploads/2023/01/skazki_2.jpg" class="" alt="" decoding="async" loading="lazy">
                      </a>
                    
                    <div class="lk-content-item-description">
                      <a href="#" class="lk-content-item-title">ОСОБЕННАЯ СКАЗКА 1</a>
                      <span class="lk-content-item-subtitle">ПРО СМЕРТЬ</span>
                      <span class="lk-content-item-access">ЛЕКЦИЯ ДОСТУПНА 30 ДНЕЙ</span>

                      <a 
                      onclick="addToWishlist(this)"
                      href="#1"
                      class="lk-content-item-wishlist-btn active" 
                      >
                        <span class="screen-reader-text">добавить в избранное</span>
                      </a>

                      <a href="#" class="button lk-content-item-button">ПЕРЕЙТИ К СКАЗКЕ</a>
                    </div><!-- /.lk-content-item-description -->
                  </div><!-- /.lk-content-item -->

                  <div class="lk-content-item sptales">
                      <a href="#" class="lk-content-item-thumbnail">
                        <img src="http://localhost/smisli/wp-content/uploads/2023/01/skazki_3.jpg" class="" alt="" decoding="async" loading="lazy">
                      </a>
                    <div class="lk-content-item-description">
                      <a href="#" class="lk-content-item-title">ОСОБЕННАЯ СКАЗКА 2</a>
                      <span class="lk-content-item-subtitle">ПРО ОСОБЕННЫХ ДЕТЕЙ</span>
                      <span class="lk-content-item-access">ЛЕКЦИЯ ДОСТУПНА 30 ДНЕЙ</span>
                      
                      <a 
                      onclick="addToWishlist(this)"
                      href="#1"
                      class="lk-content-item-wishlist-btn " 
                      >
                      <span class="screen-reader-text">добавить в избранное</span>
                    </a>
                    <a href="#" class="button lk-content-item-button">ПЕРЕЙТИ К СКАЗКЕ</a>
                    </div><!-- /.lk-content-item-description -->
                  </div><!-- /.lk-content-item -->

                  <div class="lk-content-item">

                      <a href="#" class="lk-content-item-thumbnail">
                        <img src="http://localhost/smisli/wp-content/uploads/2022/12/frame-2723.jpg" class="" alt="" decoding="async" loading="lazy">
                      </a>
                    
                    <div class="lk-content-item-description">
                      <a href="#" class="lk-content-item-title">КАК СМЫШЛЕНЫШ ПОПАЛ В ЦАРСТВО ОБИДКИ</a>
                      <span class="lk-content-item-subtitle">ПРО ОБИДЫ</span>
                      <span class="lk-content-item-access">ЛЕКЦИЯ ДОСТУПНА 30 ДНЕЙ</span>
                      
                      <a 
                      onclick="addToWishlist(this)"
                      href="#1"
                      class="lk-content-item-wishlist-btn " 
                      >
                      <span class="screen-reader-text">добавить в избранное</span>
                    </a>
                    
                    <a href="#" class="button lk-content-item-button">ПЕРЕЙТИ К СКАЗКЕ</a>
                    
                    </div><!-- /.lk-content-item-description -->
                  </div><!-- /.lk-content-item -->

                </div><!-- /.lk-content-skazki -->

              </div><!-- /.lk-content -->
    
            </div><!-- alignwide lk-wrap -->

        </div><!-- .entry-content -->

        <script>
          function addToWishlist(button) {
            event.preventDefault();
            setTimeout(() => {
              button.classList.toggle("active");
            }, 400);
          };

          function changeCurrentContent(button) {
            event.preventDefault();
            if (button.getAttribute( 'aria-expanded' ) === 'false' ) {
              var currentContentId = button.getAttribute( 'aria-controls' );
              var currentContentWrap = document.getElementById( currentContentId );
              
              allButtonInactiv();
              button.setAttribute( 'aria-expanded', 'true' );
              button.classList.add("active");
              AllDivContentHidden();
              currentContentWrap.classList.add("active"); 
            }  
          }

          function allButtonInactiv(){
            document.querySelectorAll( '.lk-menu-link' ).forEach( function( button ) {
              if (button.getAttribute( 'aria-expanded' ) === 'true' ) {
                button.setAttribute( 'aria-expanded', 'false' );
                button.classList.remove("active");
              }
            });
          }

          function AllDivContentHidden(){
            document.querySelectorAll( '.lk-content-items' ).forEach( function( ContentWrap ) { 
                ContentWrap.classList.remove("active");
            });
          }

          function changeTalesContent(button) {
            event.preventDefault();
            if (! button.classList.contains('active') ) {

              var lkContentSkazki = document.getElementById( 'lk-content-skazki' );
              var alltalesBtn = document.getElementById( 'lk-content-skazki_alltales' );
              var sptalesBtn = document.getElementById( 'lk-content-skazki_sptales' );

              if (button.getAttribute( 'aria-controls' )  === 'lk-content-skazki_sptales-content' ) {
              lkContentSkazki.classList.add("sptales");
              lkContentSkazki.classList.remove("alltales");
              button.classList.add("active");
              alltalesBtn.classList.remove("active");
              }

              if (button.getAttribute( 'aria-controls' )  === 'lk-content-skazki_alltales-content' ) {
              lkContentSkazki.classList.add("alltales");
              lkContentSkazki.classList.remove("sptales");
              button.classList.add("active");
              sptalesBtn.classList.remove("active");
              }
            }
          }

        </script>


      </article><!-- #post-<?php the_ID(); ?> -->

			
    <?php
		endwhile; // End of the loop.
		?>

	</main><!-- #main -->

<?php
// get_sidebar();
get_footer();