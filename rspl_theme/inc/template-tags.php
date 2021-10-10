<?php
/**
 * Custom template tags for this theme
 *
 * Eventually, some of the functionality here could be replaced by core features.
 *
 * @package rspl-theme
 */

//  Posted_on date & Updated.
if ( ! function_exists( 'rspl_theme_posted_on' ) ) {
	/**
	 * Prints HTML with meta information for the current post-date/time.
	 */
	function rspl_theme_posted_on() {
		$time_string = '<time class="entry-date published updated" datetime="%1$s">%2$s</time>';
		
		if ( get_the_time( 'U' ) !== get_the_modified_time( 'U' ) ) {
			$time_string = '<time class="entry-date published" datetime="%1$s">%2$s</time><time class="updated" datetime="%3$s">%4$s</time>';
			// change for update data display
			// $time_string = '<time class="entry-date" datetime="%1$s">%2$s</time><time class="updated published" datetime="%3$s">%4$s</time>';
		}

		$time_string = sprintf(
			$time_string,
			esc_attr( get_the_date( DATE_W3C ) ),
			esc_html( get_the_date() ),
			esc_attr( get_the_modified_date( DATE_W3C ) ),
			esc_html( get_the_modified_date() )
		);

		printf(
			'<span class="posted-on">%1$s<a href="%2$s" rel="bookmark">%3$s</a></span>',
			rspl_theme_get_icon_svg( 'calendar', 16 ),
			esc_url( get_permalink() ),
			$time_string
		);
	}
}

// By author.
if ( ! function_exists( 'rspl_theme_posted_by' ) ) {
	/**
	 * Prints HTML with meta information for the current author.
	 */
	function rspl_theme_posted_by() {
		printf(
			/* translators: 1: SVG icon. 2: post author, only visible to screen readers. 3: author link. */
			'<span class="byline">%1$s<span class="screen-reader-text">%2$s</span><span class="author vcard"><a class="url fn n" href="%3$s">%4$s</a></span></span>',
			rspl_theme_get_icon_svg( 'person', 16 ),
			__( 'Posted by', 'rspl_theme' ),
			esc_url( get_author_posts_url( get_the_author_meta( 'ID' ) ) ),
			esc_html( get_the_author() )
		);
	}
}

// Comments link.
if ( ! function_exists( 'rspl_theme_comment_link' ) ) {
	/**
	 * Prints HTML with the comment link for the current post.
	 */
	function rspl_theme_comment_link() {
		if ( ! post_password_required() && ( comments_open() || get_comments_number() ) ) {
			echo '<span class="comments-link">';
			echo rspl_theme_get_icon_svg( 'comment', 16 );

			/* translators: %s: Name of current post. Only visible to screen readers. */
			comments_popup_link(
				sprintf( 
					__( 'Leave a comment<span class="screen-reader-text"> on %s</span>', 'rspl_theme' ), 
					get_the_title() ) );

			echo '</span>';
		}
	}
}

// Categories.
if ( ! function_exists( 'rspl_theme_category_list' ) ) {
	function rspl_theme_category_list() {
		/* translators: used between list items, there is a space after the comma. */
		$categories_list = get_the_category_list( esc_html__( ', ', 'rspl_theme' ) );
		if ( $categories_list ) {
			printf(
				/* translators: 1: SVG icon. 2: Posted in - screen reader text. 3: List of categories. */
				'<span class="cat-links">%1$s<span class="screen-reader-text">%2$s</span>%3$s</span>',
				rspl_theme_get_icon_svg( 'category', 16 ),
				esc_html__( 'Posted in', 'rspl_theme' ),
				$categories_list
			); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		}
	}
}

// Tags.
if ( ! function_exists( 'rspl_theme_tag_list' ) ) {
	function rspl_theme_tag_list() {
		/* translators: used between list items, there is a space after the comma. */
		$tags_list = get_the_tag_list( '', __( ', ', 'rspl_theme' ) );
		if ( $tags_list ) {
			printf(
				/* translators: 1: SVG icon. 2: Posted in - screen reader text. 3: List of tags. */
				'<span class="tags-links">%1$s<span class="screen-reader-text">%2$s</span>%3$s</span>',
				rspl_theme_get_icon_svg( 'tag', 16 ),
				__( 'Tags:', 'rspl_theme' ),
				$tags_list
			); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		}
	}
}

// Edit link.
if ( ! function_exists( 'rspl_theme_edit_link' ) ) {
	function rspl_theme_edit_link() {
		edit_post_link(
			sprintf(
				wp_kses(
					/* translators: %s: Name of current post. Only visible to screen readers. */
					__( 'Edit <span class="screen-reader-text">%s</span>', 'rspl_theme' ),
					array(
						'span' => array(
							'class' => array(),
						),
					)
				),
				get_the_title()
			),
			'<span class="edit-link">' . rspl_theme_get_icon_svg( 'edit', 16 ),
			'</span>'
		);
	}
}


if ( ! function_exists( 'rspl_theme_entry_footer' ) ) :
	/**
	 * Prints HTML with meta information for the categories, tags and comments.
	 */
	function rspl_theme_entry_footer() {

		rspl_theme_category_list();
		
		if ( is_singular() ) {
			rspl_theme_tag_list();
		}

		rspl_theme_comment_link();

		rspl_theme_edit_link();

	}
endif;

if ( ! function_exists( 'rspl_theme_post_thumbnail' ) ) :
	/**
	 * Displays an optional post thumbnail.
	 *
	 * Wraps the post thumbnail in an anchor element on index views, or a div
	 * element when on single views.
	 */
	function rspl_theme_post_thumbnail() {
		if ( post_password_required() || is_attachment() || ! has_post_thumbnail() ) {
			return;
		}

		if ( is_singular() ) :
			?>

			<div class="post-thumbnail">
				<?php the_post_thumbnail(); ?>
			</div><!-- .post-thumbnail -->

		<?php else : ?>

			<a class="post-thumbnail" href="<?php the_permalink(); ?>" aria-hidden="true" tabindex="-1">
				<?php
					the_post_thumbnail(
						'post-thumbnail',
						array(
							'alt' => the_title_attribute(
								array(
									'echo' => false,
								)
							),
						)
					);
				?>
			</a>

			<?php
		endif; // End is_singular().
	}
endif;

