<?php

add_action( 'wp_ajax_hello', 'say_hello' );
add_action( 'wp_ajax_nopriv_hello', 'say_hello' );

function say_hello() {

	$name = empty( $_POST['name']) ? 'пользователь не указан' : esc_attr($_POST['name'] );
	$email = empty( $_POST['email']) ? 'Почта не узазана' : esc_attr($_POST['email'] );
	$message = empty( $_POST['message']) ? 'Сообщение не написано' : esc_attr($_POST['message'] );


	$token = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";
	$chat_id = " ";

	$arr = array(
		'Имя пользователя: '  => $name,
		'Email'               => $email,
		'Сообщение'           => $message
	);

	foreach($arr as $key => $value) {
		$txt .= "<b>".$key."</b> ".$value."%0A";
	};

	$sendToTelegram = fopen("https://api.telegram.org/bot{$token}/sendMessage?chat_id={$chat_id}&parse_mode=html&text={$txt}","r");

	if ($sendToTelegram) {
		wp_send_json_success( ['responce' => 'Сообщение отправлено в чат'], 200 );
	} else {
		wp_send_json_error( ['responce' => 'Что-то пошло не так. Ошибка отправки в чат!'], 500);
	}

	wp_die();
}