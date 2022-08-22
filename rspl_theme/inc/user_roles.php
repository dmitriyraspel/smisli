<?php
/**
 * Functions role users
 *
 * @package rspl-theme
 */

/**
 * Adds custom role
 */

$result = add_role(
  'test_user_roles',
  __( 'Тестовая роль пользователя' ),
  array( 'read' => true, )
);

// add_action( 'woocommerce_order_status_completed', 'tb_change_role_on_purchase' );

// function tb_change_role_on_purchase( $order_id ) {

// // get order object and items
// 	$order = new WC_Order( $order_id );
// 	$items = $order->get_items();

// 	$product_id = 123; // Product ID

// 	foreach ( $items as $item ) {

// 		if( $product_id == $item['product_id'] && $order->user_id ) {
// 			$user = new WP_User( $order->user_id );

// 			// Remove old role
//             $user->remove_role( 'customer' ); 

//             // Add new role
//             $user->add_role( 'gold_membership' );
// 		}
// 	}
// }
