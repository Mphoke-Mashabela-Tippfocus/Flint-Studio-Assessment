<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

// CSRF cookie route (required for SPA)
Route::get('/sanctum/csrf-cookie', [
    \Laravel\Sanctum\Http\Controllers\CsrfCookieController::class,
    'show'
]);

// Session-based auth routes
Route::middleware('web')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/register', [AuthController::class, 'register']);
});
