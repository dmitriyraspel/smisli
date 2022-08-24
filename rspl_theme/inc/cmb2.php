<?php

function rspl_theme_metabox_show_if_front_page( $cmb ) {
	// Don't show this metabox if it's not the front page template.
	if ( get_option( 'page_on_front' ) !== $cmb->object_id ) {
		return false;
	}
	return true;
}

add_action( 'cmb2_admin_init', 'rspl_theme_register_frontpage_metabox' );
/**
 * Hook in and add a demo metabox. Can only happen on the 'cmb2_admin_init' or 'cmb2_init' hook.
 */
function rspl_theme_register_frontpage_metabox() {
	/**
	 * Metabox to Front page
	 */
	$cmb_demo = new_cmb2_box( array(
		'id'            => 'rspl_theme_frontpage_metabox',
		'title'         => esc_html__( 'Метабокс для главной', 'cmb2' ),
		'object_types'  => array( 'page' ), // Post type
		'show_on_cb' => 'rspl_theme_metabox_show_if_front_page', // function should return a bool value
	) );

	/*    Letters   */
	$cmb_demo->add_field( array(
		'name' => esc_html__( 'Экран 1 Буква', 'cmb2' ),
		// 'desc' => esc_html__( 'field description (optional)', 'cmb2' ),
		'id'   => 'rspl_theme_frontpage_screen_1_letter',
		'type' => 'text_small',
	) );

	$cmb_demo->add_field( array(
		'name' => esc_html__( 'Экран 2 Буква', 'cmb2' ),
		// 'desc' => esc_html__( 'field description (optional)', 'cmb2' ),
		'id'   => 'rspl_theme_frontpage_screen_2_letter',
		'type' => 'text_small',
	) );

	$cmb_demo->add_field( array(
		'name' => esc_html__( 'Экран 3 Буква', 'cmb2' ),
		'id'   => 'rspl_theme_frontpage_screen_3_letter',
		'type' => 'text_small',
	) );

	$cmb_demo->add_field( array(
		'name' => esc_html__( 'Экран 4 Буква', 'cmb2' ),
		'id'   => 'rspl_theme_frontpage_screen_4_letter',
		'type' => 'text_small',
	) );

	$cmb_demo->add_field( array(
		'name' => esc_html__( 'Экран 5 Буква', 'cmb2' ),
		'id'   => 'rspl_theme_frontpage_screen_5_letter',
		'type' => 'text_small',
	) );

	$cmb_demo->add_field( array(
		'name' => esc_html__( 'Экран 6 Буква', 'cmb2' ),
		'id'   => 'rspl_theme_frontpage_screen_6_letter',
		'type' => 'text_small',
	) );

	$cmb_demo->add_field( array(
		'name' => esc_html__( 'Экран 7 Буква', 'cmb2' ),
		'id'   => 'rspl_theme_frontpage_screen_7_letter',
		'type' => 'text_small',
	) );

	$cmb_demo->add_field( array(
		'name' => esc_html__( 'Экран 8 Буква (footer)', 'cmb2' ),
		'id'   => 'rspl_theme_frontpage_screen_8_letter',
		'type' => 'text_small',
	) );


	/*    Screen 1   */
	$cmb_demo->add_field( array(
		'name' => esc_html__( 'Экран 1 Заголовок', 'cmb2' ),
		// 'desc' => esc_html__( 'field description (optional)', 'cmb2' ),
		'id'   => 'rspl_theme_frontpage_screen_1_title',
		'type' => 'text_medium',
	) );

	$cmb_demo->add_field( array(
		'name' => esc_html__( 'Экран 1 Описание', 'cmb2' ),
		// 'desc' => esc_html__( 'field description (optional)', 'cmb2' ),
		'id'   => 'rspl_theme_frontpage_screen_1_description',
		'type' => 'textarea',
	) );

	/*    Screen 2   */
	$cmb_demo->add_field( array(
		'name' => esc_html__( 'Экран 2 Заголовок', 'cmb2' ),
		'id'   => 'rspl_theme_frontpage_screen_2_title',
		'type' => 'text_medium',
	) );

	$cmb_demo->add_field( array(
		'name' => esc_html__( 'Экран 2 Описание', 'cmb2' ),
		'id'   => 'rspl_theme_frontpage_screen_2_description',
		'type' => 'textarea',
	) );

	/*    Screen 3   */
	$cmb_demo->add_field( array(
		'name' => esc_html__( 'Экран 3 Заголовок', 'cmb2' ),
		'id'   => 'rspl_theme_frontpage_screen_3_title',
		'type' => 'text_medium',
	) );

	$cmb_demo->add_field( array(
		'name' => esc_html__( 'Экран 3 Описание', 'cmb2' ),
		'id'   => 'rspl_theme_frontpage_screen_3_description',
		'type' => 'textarea',
	) );

	/*    Screen 4   */
	$cmb_demo->add_field( array(
		'name' => esc_html__( 'Экран 4 Заголовок', 'cmb2' ),
		'id'   => 'rspl_theme_frontpage_screen_4_title',
		'type' => 'text_medium',
	) );

	$cmb_demo->add_field( array(
		'name' => esc_html__( 'Экран 4 Описание', 'cmb2' ),
		'id'   => 'rspl_theme_frontpage_screen_4_description',
		'type' => 'textarea',
	) );

	/*    Screen 5   */
	$cmb_demo->add_field( array(
		'name' => esc_html__( 'Экран 5 Заголовок', 'cmb2' ),
		'id'   => 'rspl_theme_frontpage_screen_5_title',
		'type' => 'text_medium',
	) );

	$cmb_demo->add_field( array(
		'name' => esc_html__( 'Экран 5 Описание', 'cmb2' ),
		'id'   => 'rspl_theme_frontpage_screen_5_description',
		'type' => 'textarea',
	) );

	/*    Screen 6   */
	$cmb_demo->add_field( array(
		'name' => esc_html__( 'Экран 6 Заголовок', 'cmb2' ),
		'id'   => 'rspl_theme_frontpage_screen_6_title',
		'type' => 'text_medium',
	) );

	/*    Screen 7   */
	$cmb_demo->add_field( array(
		'name' => esc_html__( 'Экран 7 Заголовок', 'cmb2' ),
		'id'   => 'rspl_theme_frontpage_screen_7_title',
		'type' => 'text_medium',
	) );

	$cmb_demo->add_field( array(
		'name' => esc_html__( 'Экран 7 Описание', 'cmb2' ),
		'id'   => 'rspl_theme_frontpage_screen_7_description',
		'type' => 'textarea',
	) );

	// /*    Screen 8   */
	// $cmb_demo->add_field( array(
	// 	'name' => esc_html__( 'Экран 8 текст "Политика конфиденциальности"', 'cmb2' ),
	// 	'id'   => 'rspl_theme_frontpage_screen_8_title',
	// 	'type' => 'text_medium',
	// ) );

}



add_action( 'cmb2_admin_init', 'rspl_theme_register_coursepromo_metabox' );
function rspl_theme_register_coursepromo_metabox() {
	/**
	 * Metabox to Course Promo page
	 */
	$cmb_demo = new_cmb2_box( array(
		'id'            => 'rspl_theme_coursepromo_metabox',
		'title'         => esc_html__( 'Метабокс для course promo', 'cmb2' ),
		'object_types'  => array( 'page' ), // Post type
		'show_on'      => array( 'key' => 'page-template', 'value' => [ 'templates/template-course-1-theme.php', 'templates/template-course-2-theme.php', 'templates/template-course-3-theme.php' ] ),
	) );

	$cmb_demo->add_field( array(
		'name' => esc_html__( 'ID товара для добавления в корзину', 'cmb2' ),
		'id'   => 'rspl_theme_coursepromo_metabox_product_id',
		'type' => 'text_small',
	) );

	$cmb_demo->add_field( array(
		'name' => esc_html__( 'Стоимость', 'cmb2' ),
		'desc' => esc_html__( 'Должна совпадать с ценой в товаре', 'cmb2' ),
		'id'   => 'rspl_theme_coursepromo_metabox_product_price',
		'type' => 'text_small',
	) );

	$cmb_demo->add_field( array(
		'name' => esc_html__( 'Подзаголовок', 'cmb2' ),
		'id'   => 'rspl_theme_coursepromo_metabox_subtitle',
		'type' => 'text_medium',
	) );

	$cmb_demo->add_field( array(
		'name' => esc_html__( 'Первый параграф', 'cmb2' ),
		// 'desc' => esc_html__( 'field description (optional)', 'cmb2' ),
		'id'   => 'rspl_theme_coursepromo_metabox_p_1',
		'type' => 'textarea',
	) );

	$cmb_demo->add_field( array(
		'name' => esc_html__( 'Второй параграф', 'cmb2' ),
		// 'desc' => esc_html__( 'field description (optional)', 'cmb2' ),
		'id'   => 'rspl_theme_coursepromo_metabox_p_2',
		'type' => 'textarea',
	) );

	$cmb_demo->add_field( array(
		'name' => esc_html__( 'Третий параграф', 'cmb2' ),
		// 'desc' => esc_html__( 'field description (optional)', 'cmb2' ),
		'id'   => 'rspl_theme_coursepromo_metabox_p_3',
		'type' => 'textarea',
	) );
}