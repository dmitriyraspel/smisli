<?php
/**
 * Template Name: Template Profile
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

        <!-- <header class="entry-header">
          <?php //the_title( '<h1 class="entry-title">', '</h1>' ); 
          // ПЕРСОНАЛЬНЫЕ ДАННЫЕ
          ?>
        </header> -->
        <!-- .entry-header -->

      <div class="entry-content">
        <?php
        // the_content();
        ?>

        <!-- //////////////////////// -->
        <div class="container profile">

        

      <div class="profile-step-1">
        
        <div class="profile-avatar-wrap">
          <div class="profile-avatar-img">
            <img
              alt="Аватар пользователя Админ"
              src="http://2.gravatar.com/avatar/b4e12e8a19bef2891878531cb56ede32?s=100&amp;d=mm&amp;r=g"
              srcset="http://2.gravatar.com/avatar/b4e12e8a19bef2891878531cb56ede32?s=200&amp;d=mm&amp;r=g 2x" class="avatar avatar-100 photo wp-block-avatar__image" height="100" width="100" style="" loading="lazy" decoding="async"/>
          </div><!-- profile-avatar-img -->
          <p class="profile-avatar-name">Аватар</p>
          <a href="#" class="button profile-avatar-button">Выбрать</a>
        </div>

        <div class="profile-inputs">
          <h3>Персональные данные</h3>
          <div class="profile-input-wrap">
            <label for="profile_name">Имя/Ник</label>
            <input
              type="text"
              name="profile_name"
              class="input-text"
              id="profile_name"
              value="admin"
            />
          </div>
          <div class="profile-input-wrap">
            <label for="profile_tel">Телефон</label>
            <input
              type="tel"
              name="profile_tel"
              class="input-text"
              id="profile_tel"
              value="+7 000 0000000"
            />
          </div>
          <div class="profile-input-wrap">
            <label for="profile_email">Email</label>
            <input 
            type="email" 
            class="input-text account_email" 
            name="profile_email" 
            id="profile_email" 
            autocomplete="email" 
            value="admin@site.ru"
            />
          </div>
        </div>
        <!-- /.profile-inputs -->

        <div class="profile-buttons">
          <p>
            <input type="hidden" id="save-account-details-nonce-test" name="save-account-details-nonce" value="5891d63551">
          </p>
          <a
            class="wp-block-button__link profile-buttons-link"
            id="profile-change-data"
            >Изменить данные</a
          >
        </div><!-- /.profile-buttons -->

      </div><!-- /.profile-step-1 -->

      <div class="profile-step-2">
        <div></div><!-- collumn-1 empty -->

        <div class="profile-inputs">
          <h3>Пароль</h3>

          <div class="profile-input-wrap">
            <label for="password_current">Старый пароль</label>
            <input 
              type="password" 
              class="profile-password_current input-text" 
              name="password_current" 
              id="password_current" 
              autocomplete="off"
              />
          </div>
          <!-- /.profile-input-wrap -->

          <div class="profile-input-wrap">
            <label for="password_1">Новый пароль</label>
            <input 
              type="password" 
              class="profile-password_1 input-text" 
              name="password_1" 
              id="password_1" 
              autocomplete="off"
              />
          </div><!-- /.profile-input-wrap -->
        </div><!-- profile-inputs -->

        <div class="profile-buttons">
          <p>
            <input type="hidden" id="save-account-details-nonce-test-2" name="save-account-details-nonce" value="5891d63551">
          </p>
          <a href="#" class="wp-block-button__link profile-buttons-link" id="profile-change-password">Изменить пароль</a>
        </div><!-- /.profile-buttons -->
      
      </div><!-- /.profile-step-2 -->
      <div class="profile-logout-wrap">
        <a href="#" class="wp-block-button__link profile-buttons-link">Выход</a>
      </div>
    
    </div><!-- /.container -->
        <!-- /////////////////////// -->

      </div><!-- .entry-content -->


			
  <?php
		endwhile; // End of the loop.
		?>

	</main><!-- #main -->

<?php
get_sidebar();
get_footer();
