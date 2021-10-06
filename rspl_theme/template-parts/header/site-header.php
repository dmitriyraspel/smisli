<?php
/**
 * Displays the site header.
 *
 * @package RSPL-theme
 */
$wrapper_classes  = 'site-header';
$wrapper_classes .= has_custom_logo() ? ' has-logo' : '';
$wrapper_classes .= is_active_sidebar( 'sidebar-4' ) ? ' has-header-top' : '';
$wrapper_classes .= is_active_sidebar( 'sidebar-3' ) ? ' has-header-widget-area' : '';
$wrapper_classes .= has_nav_menu( 'primary' ) ? ' has-primary-menu' : '';
?>


<header id="masthead" class="<?php echo esc_attr( $wrapper_classes ); ?>" role="banner">

	<?php get_template_part( 'template-parts/header/site-header-top' ); ?>

	<div class="container header-inner">

		<div class="header-inner-left">
			<?php get_template_part( 'template-parts/header/site-branding' ); ?>
		</div><!-- /.header-inner-left -->

	</div><!-- /.header-inner -->
	
	<?php get_template_part( 'template-parts/header/site-nav' ); ?>

</header><!-- #masthead -->
