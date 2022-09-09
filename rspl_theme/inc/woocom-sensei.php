<?php

// Добавляем метабокс курса для товара
add_action( 'add_meta_boxes', 'rspl_add_course_metabox' ); 
 
function rspl_add_course_metabox() {
 
	add_meta_box(
		'rspl_course_metabox', // ID метабокса
    __( 'Связанный продукт', 'rspl_theme' ),
		'rspl_course_metabox_callback', // callback функция
		'course', // тип постов, можно использовать массив
		'normal', // расположение (normal, side, advanced)
		'default' // приоритет (default, low, high, core)
	);
}

// callback функция для метабокса курса
function rspl_course_metabox_callback( $post ) {

  // Получаем мета-данные, если товар уже назначен, выведем его в метабоксе
  $wc_post_id = get_post_meta( $post->ID, 'rspl_course_woocommerce_product', true );
  
	// проверка wp_nonce
	wp_nonce_field( 'rsplcoursesettingsupdate-' . $post->ID, 'rspl_noncename' );
 
	echo '<table class="form-table">
		<tbody>
      <tr>
        <th>Выберите товар из магазина</th>
        <td>
          <select id="rspl_course_woocommerce_product" name="rspl_course_woocommerce_product">';

            if (! $wc_post_id) {
              echo '<option selected value="" >Курс без оплаты</option>';
            } else {
              echo '<option value="" >Курс без оплаты</option>';
            }

            $loop = new WP_Query( array(
              'post_type' => 'product',
              'posts_per_page' => 100,
            ));
            while ( $loop->have_posts() ): $loop->the_post();
              if (get_the_ID() == $wc_post_id) {
                echo '<option selected value="'.get_the_ID().'">'.get_the_title().'</option>';  
              } else {
                echo '<option value="'.get_the_ID().'">'.get_the_title().'</option>';
              }
            endwhile;
          echo '</select> 
        </td>
      </tr>
		</tbody>
	</table>';
}

// Сохраненяем данные из метабокса курса
add_action( 'save_post', 'rspl_course_metabox_save', 10, 2 );
function rspl_course_metabox_save( $post_id, $post ) {
 
	// проверка wp_nonce
	if ( ! isset( $_POST[ 'rspl_noncename' ] ) || ! wp_verify_nonce( $_POST[ 'rspl_noncename' ], 'rsplcoursesettingsupdate-' . $post->ID ) ) {
		return $post_id;
	}
 
	// проверяем права пользователя
	$post_type = get_post_type_object( $post->post_type );
 
	if ( ! current_user_can( $post_type->cap->edit_post, $post_id ) ) {
		return $post_id;
	}
 
	// Автосохранение - не сохраняем, ничего не делаем
	if ( defined('DOING_AUTOSAVE') && DOING_AUTOSAVE ) {
		return $post_id;
	}
 
	// проверяем тип записи
	if( 'course' !== $post->post_type ) {
		return $post_id;
	}

  if( isset( $_POST[ 'rspl_course_woocommerce_product' ] ) ) {
		update_post_meta( $post_id, 'rspl_course_woocommerce_product', sanitize_text_field( $_POST[ 'rspl_course_woocommerce_product' ] ) );
	} else {
		delete_post_meta( $post_id, 'rspl_course_woocommerce_product' );
	}

  // Добавить функцию обновления товара, передать id курса -- rspl_update_product( $wc_post_id, $rspl_course_id );
  // Надо ли??

	return $post_id;
}


// Удаление метабокса сенсей content-drip-promo
add_action( 'add_meta_boxes' , 'rspl_remove_meta_box_content_drip_promo', 99 );
function rspl_remove_meta_box_content_drip_promo(){
	remove_meta_box('content-drip-promo', array('course', 'lesson'), 'normal' );
}


// Замена текста уведомлений:

// Для Лекций
// add_filter('sensei_lesson_course_signup_notice_message', 'rspl_course_signup_notice_message_filter', 10, 3 );

// для Модулей
// add_filter('sensei_module_course_signup_notice_message', 'rspl_course_signup_notice_message_filter', 10, 3 ); 

// для Вопросов/Заданий
// add_filter('sensei_quiz_course_signup_notice_message', 'rspl_course_signup_notice_message_filter', 10, 3 ); 
function rspl_course_signup_notice_message_filter( $message_default, $course_id, $course_link ) {
	
	$course_name 		= get_the_title( $course_id );
	$wc_post_id 		= get_post_meta( $course_id, 'rspl_course_woocommerce_product', true );
	$checkout_url 	= wc_get_checkout_url() . "?add-to-cart=" . $wc_post_id . "&quantity=1";
	
	$checkout_link  = '<a href="' . $checkout_url . '" title="' . esc_attr__( 'Купить курс', 'rspl_theme' ) . '">';
	$checkout_link .= $course_name;
	$checkout_link .= '</a>';
	
	$lesson_get_take_course_url =  esc_url( Sensei()->lesson->get_take_course_url( $course_id ) ); // Проверить quiz и module
  // "http://localhost/smisli/course/testovyj-kurs/"
  // "http://localhost/smisli/course/nachalo-raboty-s-sensei-lms/"

	$course_link  = '<a href="' . $lesson_get_take_course_url . '" title="' . esc_attr__( 'Зарегистрироваться', 'rspl_theme' ) . '">';
	$course_link .= esc_html__( $course_name );
	$course_link .= '</a>';
	//
	if( 0 < $wc_post_id) { // если есть id товара = курс платный
		$message_default = sprintf( esc_html__( 'Пожалуйста, оплатите %1$s, чтобы получить доступ.', 'rspl_theme' ), $checkout_link );
	} else {
		$message_default = sprintf( esc_html__( 'Пожалуйста, запишитесь на %1$s, чтобы получить доступ.', 'rspl_theme' ), $course_link );
	}

	return $message_default;
}

// выводит цену товара/курса. передаем id товара woocommerce, добавить проверку на пустую $wc_post_id 
function rspl_get_price_course($wc_post_id) {
	
	$regular_price = get_post_meta( $wc_post_id, '_regular_price', true);
	$sale = get_post_meta( $wc_post_id, '_price', true);
	
	if (!empty($sale)){
		$price = $sale;
	} else {
		$price = $regular_price;
	}

	$price_html  = '<span class="price">&nbsp;' . $price . '<span class="woocommerce-Price-currencySymbol">₽</span></span>';

	return $price_html;
}

// проверка куплен товар к курсу или нет
function rspl_customer_bought_wc_product_course($wc_post_id, $current_user) {
	if ( wc_customer_bought_product( $current_user->user_email, $current_user->ID, $wc_post_id ) ) {
		return true;
	} else {
		return false;
	}
}

// Фильтр контента курса, если платный, добавляем кнопку "Оплатить"
add_filter( 'the_content', 'rspl_course_content_has_access', 40 );
function rspl_course_content_has_access($content) {
	
	if ( ! is_singular( 'course' ) ) {
		return $content;
	}

	// может надо отключить ??
	// remove_filter( 'the_content', array( 'Sensei_Course', 'single_course_content' ) ); 

	global $post;

	$wc_post_id = get_post_meta( $post->ID, 'rspl_course_woocommerce_product', true );

	if ( 0 < $wc_post_id ) { // если курс платный

    $checkout_url 	= wc_get_checkout_url() . "?add-to-cart=" . $wc_post_id . "&quantity=1";
    $button_text    = __( 'Оплатить курс', 'rspl_theme' ) . rspl_get_price_course($wc_post_id);

    if( ! is_user_logged_in() ) { // если не залогинен

      $my_courses_page_url = esc_url( home_url( 'my-courses' ) );

      $button = '<div class="sensei-block-wrapper">
			          <form method="GET" action="' . $my_courses_page_url . '">
                  <input type="hidden" name="redirect_to" value="' . $checkout_url . '">
                  <div class="wp-block-sensei-lms-button-take-course is-style-default wp-block-sensei-button wp-block-button has-text-align-left rspl-button-take-course">
                    <button class="wp-block-button__link">' . $button_text . '</button>
                  </div>
                </form>
	        		</div>';
      
      return $content .= $button;

    } else { // если залогинен 
      $current_user = wp_get_current_user();

      if(! rspl_customer_bought_wc_product_course($wc_post_id, $current_user) ) { // если user не купил необходимый товар
        // Можно добавить the_excerpt() в теге P
    
        $button = '<div class="sensei-block-wrapper">
                  <div class="wp-block-sensei-lms-button-take-course is-style-default wp-block-sensei-button wp-block-button has-text-align-left rspl-button-take-course">
                    <a href="'.$checkout_url.'" class="wp-block-button__link">' . $button_text . '</a>
                  </div>
	        		  </div>';

        return $content .= $button;
      }

    }

	}

	return $content;

}

// Если пользователь не купил товар, не даем доступ(для lesson, quiz, module).
add_filter('sensei_can_access_course_content', 'rspl_can_access_course_content', 40, 4 );
function rspl_can_access_course_content($can_view_course_content, $course_id, $user_id, $context) {

	if ( ! is_user_logged_in() ) { // если не авторизован – запрещаем
		$can_view_course_content = false;
	} else {
		$current_user = get_user_by('id', $user_id);
		$wc_post_id = get_post_meta( $course_id, 'rspl_course_woocommerce_product', true );

		if ( 0 < $wc_post_id ) { //  если курс платный
			if ( ! rspl_customer_bought_wc_product_course($wc_post_id, $current_user) ) { // если пользователь не купил необходимый товар

				$can_view_course_content = false;
			} 
		} 
		
	}

	return $can_view_course_content;
}

// Выводим кнопку 'Оплатить курс', чтобы не была пустая страница ДЛЯ ЛЕКЦИЙ !!!
add_filter( 'the_content', 'rspl_lesson_content_has_access', 40 );
function rspl_lesson_content_has_access($content) {
	
	if ( ! is_singular( array ('lesson', 'quiz', 'module') ) ) {
		return $content;
	}

	global $post;
	
	$course_id = intval( get_post_meta( $post->ID, '_lesson_course', true ) );
	$wc_post_id = get_post_meta( $course_id, 'rspl_course_woocommerce_product', true );

	if ( 0 < $wc_post_id ) { // если курс платный

    $checkout_url 	= wc_get_checkout_url() . "?add-to-cart=" . $wc_post_id . "&quantity=1";
    $button_text    = __( 'Оплатить курс', 'rspl_theme' ) . rspl_get_price_course($wc_post_id);

    if( ! is_user_logged_in() ) { // если не залогинен

      $my_courses_page_url = esc_url( home_url( 'my-courses' ) );

      $button = '<div class="sensei-block-wrapper">
			          <form method="GET" action="' . $my_courses_page_url . '">
                  <input type="hidden" name="redirect_to" value="' . $checkout_url . '">
                  <div class="wp-block-sensei-lms-button-take-course is-style-default wp-block-sensei-button wp-block-button has-text-align-left rspl-button-take-course">
                    <button class="wp-block-button__link">' . $button_text . '</button>
                  </div>
                </form>
	        		</div>';
      
      return $content .= $button;

    } else { // если залогинен 
      $current_user = wp_get_current_user();

      if(! rspl_customer_bought_wc_product_course($wc_post_id, $current_user) ) { // если user не купил необходимый товар
        // Можно добавить the_excerpt() в теге P
    
        $button = '<div class="sensei-block-wrapper">
                  <div class="wp-block-sensei-lms-button-take-course is-style-default wp-block-sensei-button wp-block-button has-text-align-left rspl-button-take-course">
                    <a href="'.$checkout_url.'" class="wp-block-button__link">' . $button_text . '</a>
                  </div>
	        		  </div>';

        return $content .= $button;
      }

    }

	}

	return $content;

}


//Автоматическое присвоение заказам статуса «Выполнен» // работает. Проверить после подключения платежного шлюза
add_filter( 'woocommerce_payment_complete_order_status', 'rspl_complete_orders_test', 20, 3 );
function rspl_complete_orders_test( $processing, $id, $that ) {
  // $a = $processing;
  // $b = $id;
  // $c = $that;
	// return false; // false – Выполнен, true - Обработка

  if($processing == 'processing') {
    $processing = 'completed';
  }
  return $processing;
}
