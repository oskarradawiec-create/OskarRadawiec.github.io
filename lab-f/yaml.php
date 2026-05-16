<?php

$data = [
    'name' => 'Oskar Radawiec',
    'index' => '57845',
    'date' => date(DATE_ATOM),
];

$yaml = yaml_emit($data);

echo $yaml;