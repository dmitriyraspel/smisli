<?php
/**
 * Template Name: Template katalog-produktov
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

        <header class="entry-header">
          <?php the_title( '<h1 class="entry-title katalog-productov-entry-title">', '</h1>' ); ?>
        </header><!-- .entry-header -->
        
        <div class="entry-content">
          <?php
          the_content();
          ?>
          
          <!-- ////////////////////////////// -->
          <!-- <p class="sensei-login-username form-row form-row-wide">

            <label for="sensei_user_login">Имя пользователя или E-mail </label>

            <input type="text" name="log" id="sensei_user_login" class="input" value="" >
            <a href="http://localhost/smisli/my-account/lost-password/" class="button">Забыли пароль?</a>

            </p> -->
            <div class="alignwide katalog-productov-wrap">
    
              <div class="katalog-productov-cart">
                <h2 class="has-text-align-center katalog-productov-cart-title">СМЫСЛЫ</h2>
                <h4 class="has-text-align-center katalog-productov-cart-subtitle">ЛЕКЦИИ САМОПОМОЩИ</h4>
                <figure class="katalog-productov-cart-img">
                  <img decoding="async" src="http://localhost/smisli/wp-content/uploads/2022/11/test1.png" alt=""
                  class="wp-image-982" />
                </figure><!-- /.katalog-productov-cart-img -->

                <div class="wp-block-buttons katalog-productov-cart-buttons">
                  <div class="wp-block-button katalog-productov-cart-button">
                    <a class="wp-block-button__link wp-element-button">каталог лекций</a>
                  </div>

                  <div class="wp-block-button katalog-productov-cart-button katalog-productov-cart-button-line">
                    <a class="wp-block-button__link wp-element-button"></a>
                  </div>
                </div><!-- katalog-productov-cart-buttons -->
              </div><!-- katalog-productov-cart -->

              <div class="katalog-productov-cart">
                <h2 class="has-text-align-center katalog-productov-cart-title">МЫ</h2>
                <h4 class="has-text-align-center katalog-productov-cart-subtitle">ФЛАГМАНСКИЙ ПРОЕКТ</h4>
                <figure class="katalog-productov-cart-img">
                  <img src="http://localhost/smisli/wp-content/uploads/2022/12/estestvennaya-motivacziya.png" alt="" class="wp-image-981" />
                </figure><!-- /.katalog-productov-cart-img -->
                  
                <div class="wp-block-buttons katalog-productov-cart-buttons">
                  <div class="wp-block-button katalog-productov-cart-button">
                    <a class="wp-block-button__link wp-element-button">подробнее</a>
                  </div>

                  <div class="wp-block-button katalog-productov-cart-button">
                    <a class="wp-block-button__link wp-element-button">
                      купить
                      <span class="price">3000 р</span>
                    </a>
                  </div>
                </div><!-- katalog-productov-cart-buttons -->
              </div><!-- katalog-productov-cart -->


              <div class="katalog-productov-cart">
                <h2 class="has-text-align-center katalog-productov-cart-title">СМЫШЛЕНЫШ</h2>
                <h4 class="has-text-align-center katalog-productov-cart-subtitle">СКАЗКОТЕРАПИЯ ДЛЯ ДЕТЕЙ</h4>
                <figure class="katalog-productov-cart-img">
                  <img src="http://localhost/smisli/wp-content/uploads/2022/12/frame-2723.jpg" alt="" class="wp-image-980" />
                </figure><!-- /.katalog-productov-cart-img -->

                <div class="wp-block-buttons katalog-productov-cart-buttons">
                  <div class="wp-block-button katalog-productov-cart-button">
                    <a class="wp-block-button__link wp-element-button">подробнее</a>
                  </div>

                  <div class="wp-block-button katalog-productov-cart-button">
                    <a class="wp-block-button__link wp-element-button">
                      оформить подписку 
                      <span class="price">990 р</span>
                    </a>
                  </div>
                </div><!-- katalog-productov-cart-buttons -->
              </div><!-- katalog-productov-cart -->

            </div><!-- katalog-productov-wrap -->
        </div><!-- .entry-content -->

      </article><!-- #post-<?php the_ID(); ?> -->

			
    <?php
		endwhile; // End of the loop.
		?>

	</main><!-- #main -->

<?php
// get_sidebar();
get_footer();