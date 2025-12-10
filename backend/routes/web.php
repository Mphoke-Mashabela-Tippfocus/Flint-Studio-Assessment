<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\FileController;
use Laravel\Sanctum\Http\Controllers\CsrfCookieController;

// CSRF route
Route::get('/sanctum/csrf-cookie', [CsrfCookieController::class, 'show']);

// Routes that require the web middleware (session + CSRF)
Route::middleware('web')->group(function () {

    // Auth
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/register', [AuthController::class, 'register']);

    // Protected routes (Sanctum)
    Route::middleware('auth:sanctum')->group(function () {

        // Current user
        Route::get('/user', fn() => auth()->user());

        // Tasks
        Route::get('/tasks', [TaskController::class, 'index']);
        Route::post('/tasks', [TaskController::class, 'store']);
        Route::get('/tasks/{task}', [TaskController::class, 'show']);
        Route::put('/tasks/{task}', [TaskController::class, 'update']);
        Route::delete('/tasks/{task}', [TaskController::class, 'destroy']);

        // File upload
        Route::post('/upload', [FileController::class, 'store']);
    });
});
