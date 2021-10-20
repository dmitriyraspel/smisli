<?php
/**
 * Customizer settings for rspl-theme theme.
 *
 * @package rspl-theme
 */

if ( ! class_exists( 'RSPL_Theme_Customize' ) ) {
	/**
	 * Customizer Settings.
	 *
	 */
	class RSPL_Theme_Customize {

		/**
		 * Constructor. Instantiate the object.
		 * 
		 * @access public
		 * 
		 */
		public function __construct() {
			add_action( 'customize_register', array( $this, 'register' ) );
		}

		/**
		 * Register customizer options.
		 *
		 * @param WP_Customize_Manager $wp_customize Theme Customizer object.
		 * @return void
		 */
		public function register( $wp_customize ) {

			// Change site-title & description to postMessage.
			$wp_customize->get_setting( 'blogname' )->transport        = 'postMessage'; // @phpstan-ignore-line. Assume that this setting exists.
			$wp_customize->get_setting( 'blogdescription' )->transport = 'postMessage'; // @phpstan-ignore-line. Assume that this setting exists.

			// Add partial for blogname.
			$wp_customize->selective_refresh->add_partial(
				'blogname',
				array(
					'selector'        => '.site-title',
					'render_callback' => array( $this, 'partial_blogname' ),
				)
			);

			// Add partial for blogdescription.
			$wp_customize->selective_refresh->add_partial(
				'blogdescription',
				array(
					'selector'        => '.site-description',
					'render_callback' => array( $this, 'partial_blogdescription' ),
				)
			);

			// Add "display_site_title" setting for displaying the site-title.
			$wp_customize->add_setting(
				'display_site_title',
				array(
					'capability'        => 'edit_theme_options',
					'default'           => true,
					'sanitize_callback' => array( __CLASS__, 'sanitize_checkbox' ),
				)
			);

			// Add control for the "display_site_title" setting.
			$wp_customize->add_control(
				'display_site_title',
				array(
					'type'    => 'checkbox',
					'section' => 'title_tagline',
					// 'priority'    => 10,
					'label'   => esc_html__( 'Display Site Title', 'rspl_theme' ),
				)
			);

			// Add "display_site_tagline" setting for displaying the site description.
			$wp_customize->add_setting(
				'display_site_tagline',
				array(
					'capability'        => 'edit_theme_options',
					'default'           => true,
					'sanitize_callback' => array( __CLASS__, 'sanitize_checkbox' ),
				)
			);

			// Add control for the "display_site_tagline" setting.
			$wp_customize->add_control(
				'display_site_tagline',
				array(
					'type'    => 'checkbox',
					'section' => 'title_tagline',
					// 'priority'    => 11,
					'label'   => esc_html__( 'Display Site Description', 'rspl_theme' ),
				)
			);

			/**
			 * Theme Options
			 */
			$wp_customize->add_section(
				'options',
				array(
					'title'      => __( 'Theme Options', 'rspl_theme' ),
					'priority'   => 40,
					'capability' => 'edit_theme_options',
				)
			);

			// Remove field "URL" from Comment form.
			$wp_customize->add_setting(
				'remove_comment_field_url',
				array(
					'capability'        => 'edit_theme_options',
					'default'           => true,
					'sanitize_callback' => array( __CLASS__, 'sanitize_checkbox' ),
				)
			);

			$wp_customize->add_control(
				'remove_comment_field_url',
				array(
					'type'     => 'checkbox',
					'section'  => 'options',
					'priority' => 10,
					'label'    => __( 'Remove field "URL" from Comment form', 'rspl_theme' ),
				)
			);

			// Display the_post_navigation on Campaign page.
			$wp_customize->add_setting(
				'display_post_navigation_campaign_page',
				array(
					'capability'        => 'edit_theme_options',
					'default'           => false,
					'sanitize_callback' => array( __CLASS__, 'sanitize_checkbox' ),
				)
			);

			$wp_customize->add_control(
				'display_post_navigation_campaign_page',
				array(
					'type'     => 'checkbox',
					'section'  => 'options',
					'priority' => 10,
					'label'    => __( 'Display Post navigation on Campaign page', 'rspl_theme' ),
				)
			);

		}

		/**
		 * Sanitize boolean for checkbox.
		 *
		 * @param bool $checked Whether or not a box is checked.
		 * @return bool
		 */
		public static function sanitize_checkbox( $checked = null ) {
			return (bool) isset( $checked ) && true === $checked;
		}

		/**
		 * Render the site title for the selective refresh partial.
		 *
		 * @return void
		 */
		public function partial_blogname() {
			bloginfo( 'name' );
		}

		/**
		 * Render the site tagline for the selective refresh partial.
		 *
		 * @return void
		 */
		public function partial_blogdescription() {
			bloginfo( 'description' );
		}
	}

	new RSPL_Theme_Customize();

}
