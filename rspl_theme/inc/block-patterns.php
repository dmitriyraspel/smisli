<?php
/**
 * RSPL Theme: Block Patterns
 *
 * @package RSPL_theme
 */

/**
 * Register Block Pattern Category.
 */
if ( function_exists( 'register_block_pattern_category' ) ) {

	register_block_pattern_category(
		'rspl_blocks',
		array( 'label' => __( 'RSPL blocks', 'rspl_theme' ) )
	);
}

/**
 * Register Block Patterns.
 */
if ( function_exists( 'register_block_pattern' ) ) {

	register_block_pattern(
		'rspl_blocks/latest-posts-alternating-grid',
		array(
			'title'      => __( 'Alternating Grid of Latest Posts', 'rspl_theme' ),
			'categories' => array( 'rspl_blocks' ),
			'content'    => '<!-- wp:latest-posts {
				"postsToShow":3,
				"displayPostContent":false, 
				"displayFeaturedImage":true, 
				"addLinkToFeaturedImage":true, 
				"align":"wide", 
				"className":"is-style-rspl_theme-alternating-grid"
			} /-->',
		)
	);
	register_block_pattern(
		'rspl_blocks/progressbar',
		array(
			'title'      => __( 'Progressbar for campaign', 'rspl_theme' ),
			'categories' => array( 'rspl_blocks' ),
			'content'    => '<!-- wp:leyka/card {
				"campaign":"1332",
				"showTitle":false,
				"showImage":false,
				"showButton":false,
				"showTargetAmount":false,
				"showCollectedAmount":false
			} /-->',
		)
	);
	register_block_pattern(
		'rspl_blocks/progressbar',
		array(
			'title'      => __( 'Block Photo and content', 'rspl_theme' ),
			'categories' => array( 'rspl_blocks' ),
			'content'    => '
			<!-- wp:media-text {
				"mediaId":786,
				"mediaLink":"http://localhost/delalove-fond-new/wp-content/uploads/2021/10/logo-244_244.png/",
				"mediaType":"image"
			} -->
			<div class="wp-block-media-text alignwide is-stacked-on-mobile">
				<figure class="wp-block-media-text__media">
				<img src="http://localhost/delalove-fond-new/wp-content/uploads/2021/10/logo-244_244.png" alt="" class="wp-image-786 size-full"/>
				</figure>
				<div class="wp-block-media-text__content">
					<!-- wp:heading {
						"level":1,
						"className":"entry-title"
					} -->
						<h1 class="entry-title">Поддерживаем продуктами</h1>
					<!-- /wp:heading -->
					
					<!-- wp:paragraph -->
					<p>Рыбатекст поможет дизайнеру, верстальщику, вебмастеру сгенерировать несколько абзацев более менее осмысленного текста рыбы на русском языке, а начинающему оратору отточить навык публичных выступлений в домашних условиях. При создании генератора мы использовали небезизвестный универсальный код речей. Текст генерируется абзацами случайным образом от двух до десяти предложений в абзаце, что позволяет сделать текст более привлекательным и живым для визуально-слухового восприятия.</p>
					<!-- /wp:paragraph -->
					
					<!-- wp:heading {"level":3} -->
					<h3>Какой-то заголовок.</h3>
					<!-- /wp:heading -->
					
					<!-- wp:paragraph -->
					<p>Еще один параграф. Ниже рабочие ссылки на почту и телефон... Но стоит проверить еще раз :)</p>
					<!-- /wp:paragraph -->

					<!-- wp:heading {"level":3} -->
					<h3>Связаться с нами:</h3>
					<!-- /wp:heading -->

					<!-- wp:paragraph -->
						<p><a href="tel:+79006593929">+7 900-659-39-29</a></p>
					<!-- /wp:paragraph -->

					<!-- wp:paragraph -->
						<p><a href="mailto:vlad@dela-love@mail.ru"> dela-love@mail.ru</a></p>
					<!-- /wp:paragraph -->
					
					<!-- wp:buttons -->
					<div class="wp-block-buttons">
						<!-- wp:button -->
							<div class="wp-block-button">
							<a class="wp-block-button__link" href="#">Поддержать проект</a>
							</div>
						<!-- /wp:button --></div>
					<!-- /wp:buttons --></div>
			</div>

			<!-- /wp:media-text -->
			',
		)
	);

}
