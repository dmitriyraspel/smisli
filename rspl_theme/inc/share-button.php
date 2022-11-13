<?php

add_shortcode( 'rspl_share_button', 'rspl_share_button_render_callback' );
function rspl_share_button_render_callback( $atts ) {
  $atts = shortcode_atts( [
		'text' => 'ПОРЕКОМЕНДОВАТЬ БЛИЗКИМ'
	], $atts );

  $share_text   = $atts['text'];
  $share_url    = get_permalink();
  $share_title  = get_the_title(); 

  $share_whatsapp_link = 'https://api.whatsapp.com/send/?text=' . $share_url;
  $share_telegram_link = 'https://t.me/share/url?url='. $share_url .'&text=ДУМАЮ ТЕБЕ МОЖЕТ ЭТО ПОНРАВИТЬСЯ:';

	
  if (isset($_GET['course_id'])) {
      $share_post_id  = $_GET["course_id"];
      $share_title    = get_the_title( $_GET["course_id"] );
      $share_url      = get_permalink($_GET["course_id"] );
  }

  $share_whatsapp_link = 'https://api.whatsapp.com/send/?text=' . $share_url;
  $share_telegram_link = 'https://t.me/share/url?url='. $share_url .'&text=ДУМАЮ ТЕБЕ МОЖЕТ ЭТО ПОНРАВИТЬСЯ:';

  $html = '
  <div class="is-layout-flex wp-block-buttons">
    <div class="wp-block-button button-share">
    ' . $share_text . '
    
      <span class="share-action-button">
          <i class="share-action-button__icon"></i>
      </span>
      <ul class="share-buttons">
        <li class="share-buttons__item">
          <a target="_blank" rel="noopener" href=" ' . $share_telegram_link . ' " class="share-buttons__link" data-tooltip="telegram">
            <i class="icon-material icon-material_tg"></i>
          </a>
        </li>
        <li class="share-buttons__item">
          <a target="_blank" rel="noopener" href=" ' . $share_whatsapp_link . ' " class="share-buttons__link" data-tooltip="whatsapp">
            <i class="icon-material icon-material_wa"></i>
          </a>
        </li>
      </ul>
    </div>
  </div>';

  return $html;
}