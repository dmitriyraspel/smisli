<?php

function rspl_theme_accent_color_random() {
 
  $colors = [
    1   => ' data-primarycolor="#F3A748" data-secondarycolor="#DB9338" ',
    2   => ' data-primarycolor="#389CCA" data-secondarycolor="#2E82A8" ',
    3   => ' data-primarycolor="#f5865e" data-secondarycolor="#e37a52" ',
    4   => ' data-primarycolor="#fcd259" data-secondarycolor="#e3be4f" ',
    5   => ' data-primarycolor="#fe57e4" data-secondarycolor="#e34dcc" ',
    6   => ' data-primarycolor="#f0c854" data-secondarycolor="#e3be4f" ',
    7   => ' data-primarycolor="#7b00ff" data-secondarycolor="#6d02e0" ',
    8   => ' data-primarycolor="#FF6152" data-secondarycolor="#D85144" ',
    9   => ' data-primarycolor="#73ccac" data-secondarycolor="#64b396" ',
    10  => ' data-primarycolor="#1eb848" data-secondarycolor="#199e3d" ',
    11  => ' data-primarycolor="#c5a06d" data-secondarycolor="#aa8652" ',
    
  ];
  $random = rand(1, 11);
  $color = $colors[$random];
  echo  $color ;

}
