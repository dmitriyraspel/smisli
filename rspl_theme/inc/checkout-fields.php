<?php

/**
 * Filter & remove woocommerce_checkout_fields
 */
add_filter( 'woocommerce_checkout_fields', 'rspl_theme_checkout_fields' );
function rspl_theme_checkout_fields( $fields ){
	$fields[ 'billing' ][ 'billing_last_name' ][ 'required' ] = 0;
  $fields[ 'billing' ][ 'billing_country'   ][ 'required' ] = 0;
  $fields[ 'billing' ][ 'billing_address_1' ][ 'required' ] = 0;
  $fields[ 'billing' ][ 'billing_address_2' ][ 'required' ] = 0;
  $fields[ 'billing' ][ 'billing_city'      ][ 'required' ] = 0;
  $fields[ 'billing' ][ 'billing_state'     ][ 'required' ] = 0;
  $fields[ 'billing' ][ 'billing_postcode'  ][ 'required' ] = 0;
  $fields[ 'billing' ][ 'billing_company'  ][ 'required' ] = 0;
  $fields[ 'billing' ][ 'billing_phone'  ][ 'required' ] = 0;
	
  // remove fields
   unset( $fields['billing'] ['billing_company'] );
  unset( $fields['billing'] ['billing_country'] );
  unset( $fields['billing'] ['billing_address_1'] );
  unset( $fields['billing'] ['billing_address_2'] );
  unset( $fields['billing'] ['billing_city'] );
  unset( $fields['billing'] ['billing_state'] );
  unset( $fields['billing'] ['billing_postcode'] );
  
  return $fields;
}