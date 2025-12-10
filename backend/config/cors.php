<?php

return [
    'paths' => [
        'api/*',
        'sanctum/csrf-cookie',
        'login',
        'logout',
        'user',
        'tasks',
        'tasks/*',
    ],

    'allowed_methods' => ['*'],

    'allowed_origins' => ['http://localhost:5173'], // React dev server

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true, // needed for Sanctum + cookies
];
