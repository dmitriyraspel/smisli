<?php
/**
 * The template for displaying the footer
 *
 * Contains the closing of the #content div and all content after.
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package rspl-theme
 */

?>

	<footer id="colophon" class="site-footer">

	<?php
		if ( has_nav_menu( 'social' ) ) : 
			get_template_part( 'template-parts/navigation/social-nav' );
		endif; 
	?>

	<div class="container site-info">
			
			<span class="site-name"><?php echo get_bloginfo( 'name' ); ?></span>
			<span class="copyright">&copy; <?php echo esc_html( date_i18n( __( 'Y', 'rspl_theme' ) ) ); ?></span>
			<?php
			if ( function_exists( 'the_privacy_policy_link' ) ) {
				the_privacy_policy_link();
			}
			?>

			<span class="sep"> | </span>
			<?php
			/* translators: 1: Theme name, 2: Theme author. */
			printf( esc_html__( 'RSPL_theme by %2$s', 'rspl_theme' ), 'rspl_theme', '<a class="theme-author" href="http://raspel.ru">Raspel</a>' );
			?>
			
		</div><!-- .site-info -->

	</footer><!-- #colophon -->
</div><!-- #page -->

<?php wp_footer(); ?>

</body>
</html>
