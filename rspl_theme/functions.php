<?php
/**
 * rspl-theme functions and definitions
 *
 * @link https://developer.wordpress.org/themes/basics/theme-functions/
 *
 * @package rspl-theme
 */

if ( ! defined( '_S_VERSION' ) ) {
	// Replace the version number of the theme on each release.
	define( '_S_VERSION', '1.0.0' );
}

if ( ! function_exists( 'rspl_theme_setup' ) ) :
	/**
	 * Sets up theme defaults and registers support for various WordPress features.
	 *
	 * Note that this function is hooked into the after_setup_theme hook, which
	 * runs before the init hook. The init hook is too late for some features, such
	 * as indicating support for post thumbnails.
	 */
	function rspl_theme_setup() {
		/*
		 * Make theme available for translation.
		 * Translations can be filed in the /languages/ directory.
		 * If you're building a theme based on rspl-theme, use a find and replace
		 * to change 'rspl_theme' to the name of your theme in all the template files.
		 */
		load_theme_textdomain( 'rspl_theme', get_template_directory() . '/languages' );

		// Add default posts and comments RSS feed links to head.
		add_theme_support( 'automatic-feed-links' );

		/*
		 * Let WordPress manage the document title.
		 * By adding theme support, we declare that this theme does not use a
		 * hard-coded <title> tag in the document head, and expect WordPress to
		 * provide it for us.
		 */
		add_theme_support( 'title-tag' );

		/*
		 * Enable support for Post Thumbnails on posts and pages.
		 *
		 * @link https://developer.wordpress.org/themes/functionality/featured-images-post-thumbnails/
		 */
		add_theme_support( 'post-thumbnails' );

		// This theme uses wp_nav_menu() in one location.
		register_nav_menus(
			array(
				'primary'	=> __( 'Primary menu', 'rspl_theme' ),
				'social'	=> __( 'Social Links menu', 'rspl_theme' ),
				'footer'	=> __( 'Footer menu', 'rspl_theme' ),
			)
		);

		/*
		 * Switch default core markup for search form, comment form, and comments
		 * to output valid HTML5.
		 */
		add_theme_support(
			'html5',
			array(
				'comment-form',
				'comment-list',
				'gallery',
				'caption',
				'style',
				'script',
				'navigation-widgets',
			)
		);

		/**
		 * Add support for core custom logo.
		 *
		 * @link https://codex.wordpress.org/Theme_Logo
		 */
		$logo_width  = 300;
		$logo_height = 100;

		add_theme_support(
			'custom-logo',
			array(
				'height'               => $logo_height,
				'width'                => $logo_width,
				'flex-width'           => true,
				'flex-height'          => true,
				'unlink-homepage-logo' => true,
			)
		);

		// Add theme support for selective refresh for widgets.
		add_theme_support( 'customize-selective-refresh-widgets' );

		// Add support for Block Styles.
		// add_theme_support( 'wp-block-styles' );

		// Add support for full and wide align images.
		add_theme_support( 'align-wide' );

		// Custom background color.
		add_theme_support(
			'custom-background',
			array(
				'default-color' => 'ffffff',
			)
		);

		// Add support for responsive embedded content.
		// add_theme_support( 'responsive-embeds' );

		// Add support for custom line height controls.
		// add_theme_support( 'custom-line-height' );

		// Add support for experimental link color control.
		add_theme_support( 'experimental-link-color' );

		// Add support for experimental cover block spacing.
		// add_theme_support( 'custom-spacing' );

		// Add support for custom units.
		// This was removed in WordPress 5.6 but is still required to properly support WP 5.5.
		// add_theme_support( 'custom-units' );
	}
endif;
add_action( 'after_setup_theme', 'rspl_theme_setup' );

/**
 * Add Google webfonts.
 */
function rspl_theme_fonts_url() {

	$fonts_url = '';

	/* Translators: If there are characters in your language that are not
	* supported by Roboto, translate this to 'off'. Do not translate
	* into your own language.
	*/
	$roboto = esc_html_x( 'on', 'Roboto font: on or off', 'rspl_theme' );
	// <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,400;0,700;1,100;1,400;1,700&display=swap" rel="stylesheet">
	
	/* Translators: If there are characters in your language that are not
	* supported by Raleway, translate this to 'off'. Do not translate
	* into your own language.
	*/
	$raleway = esc_html_x( 'off', 'Raleway font: on or off', 'rspl_theme' );
	// <link href="https://fonts.googleapis.com/css2?family=Raleway:ital,wght@0,100;0,400;0,700;1,100;1,400;1,700&family=Roboto:ital,wght@0,100;0,400;0,700;1,100;1,400;1,700&display=swap" rel="stylesheet">

	if ( 'off' !== $roboto || 'off' !== $raleway ) {
		$font_families = array();

		if ( 'off' !== $roboto ) {
			$font_families[] = 'Roboto:ital,wght@0,100;0,400;0,700;1,100;1,400;1,700'; 
		}

		if ( 'off' !== $raleway ) {
			$font_families[] = 'Raleway:ital,wght@0,100;0,400;0,700;1,100;1,400;1,700';
		}

		$query_args = array(
			'family' => urlencode( implode( '|', $font_families ) ),
			'subset' => urlencode( 'cyrillic-ext' ),
		);

		$fonts_url = add_query_arg( $query_args, 'https://fonts.googleapis.com/css2' );
	}

	return esc_url_raw( $fonts_url );
}

/**
 * Register widget area.
 *
 * @link https://developer.wordpress.org/themes/functionality/sidebars/#registering-a-sidebar
 */
function rspl_theme_widgets_init() {

	register_sidebar(
		array(
			'name'          => esc_html__( 'Header', 'rspl_theme' ),
			'id'            => 'sidebar-3',
			'description'   => esc_html__( 'Add widgets here to appear in your header.', 'rspl_theme' ),
			'before_widget' => '<section id="%1$s" class="widget %2$s">',
			'after_widget'  => '</section>',
			'before_title'  => '<h2 class="widget-title">',
			'after_title'   => '</h2>',
		)
	);

	register_sidebar(
		array(
			'name'          => esc_html__( 'Footer', 'rspl_theme' ),
			'id'            => 'sidebar-2',
			'description'   => esc_html__( 'Add widgets here to appear in your footer.', 'rspl_theme' ),
			'before_widget' => '<section id="%1$s" class="widget %2$s">',
			'after_widget'  => '</section>',
			'before_title'  => '<h2 class="widget-title">',
			'after_title'   => '</h2>',
		)
	);

	register_sidebar(
		array(
			'name'          => esc_html__( 'Header-top', 'rspl_theme' ),
			'id'            => 'sidebar-4',
			'description'   => esc_html__( 'Add widgets here to appear in your before header.', 'rspl_theme' ),
			'before_widget' => '<section id="%1$s" class="widget %2$s">',
			'after_widget'  => '</section>',
			'before_title'  => '<h2 class="widget-title screen-reader-text">',
			'after_title'   => '</h2>',
		)
	);

	register_sidebar(
		array(
			'name'          => esc_html__( 'Sidebar', 'rspl_theme' ),
			'id'            => 'sidebar-1',
			'description'   => esc_html__( 'Add widgets here.', 'rspl_theme' ),
			'before_widget' => '<section id="%1$s" class="widget %2$s">',
			'after_widget'  => '</section>',
			'before_title'  => '<h2 class="widget-title">',
			'after_title'   => '</h2>',
		)
	);
}
add_action( 'widgets_init', 'rspl_theme_widgets_init' );

/**
 * Set the content width in pixels, based on the theme's design and stylesheet.
 *
 * Priority 0 to make it available to lower priority callbacks.
 *
 * @global int $content_width
 */
function rspl_theme_content_width() {
	$GLOBALS['content_width'] = apply_filters( 'rspl_theme_content_width', 720 );
}
add_action( 'after_setup_theme', 'rspl_theme_content_width', 0 );


/**
 * Enqueue scripts and styles.
 */
function rspl_theme_scripts() {
	// Enqueue Google fonts
	wp_enqueue_style( 'rspl_theme-fonts', rspl_theme_fonts_url(), array(), null );

	// wp_enqueue_style( 'rspl_theme-style', get_stylesheet_uri(), array(), _S_VERSION );
	// wp_style_add_data( 'rspl_theme-style', 'rtl', 'replace' );

	// Main style temp
	wp_enqueue_style( 'rspl_theme-style-temp', get_template_directory_uri() . '/style.css', array(), filemtime(get_template_directory() . '/style.css') );

	// wp_enqueue_script( 'rspl_theme-navigation', get_template_directory_uri() . '/js/navigation.js', array(), _S_VERSION, true );

	// Main script temp
	wp_enqueue_script( 'rspl_theme-script-temp', get_template_directory_uri() . 'assets/js/navigation.js', array(), filemtime(get_template_directory() . '/assets/js/navigation.js')  );

	if ( is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
		wp_enqueue_script( 'comment-reply' );
	}
}
add_action( 'wp_enqueue_scripts', 'rspl_theme_scripts' );

/**
 * Implement the Custom Header feature.
 */
require get_template_directory() . '/inc/custom-header.php';

/**
 * Custom template tags for this theme.
 */
require get_template_directory() . '/inc/template-tags.php';

/**
 * Functions which enhance the theme by hooking into WordPress.
 */
require get_template_directory() . '/inc/template-functions.php';

/**
 * SVG Icons class.
 */
require get_template_directory() . '/classes/class-architect-svg-icons.php';

/**
 * SVG Icons related functions.
 */
require get_template_directory() . '/inc/icon-functions.php';

/**
 * Customizer additions.
 */
require get_template_directory() . '/inc/customizer.php';

/**
 * Load Jetpack compatibility file.
 */
// if ( defined( 'JETPACK__VERSION' ) ) {
// 	require get_template_directory() . '/inc/jetpack.php';
// }

/**
 * Load WooCommerce compatibility file.
 */
// if ( class_exists( 'WooCommerce' ) ) {
// 	require get_template_directory() . '/inc/woocommerce.php';
// }
