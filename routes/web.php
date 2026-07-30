<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\MovementController;

Route::get('/', function () {
    return Inertia::render('login');
})->name('home');

Route::middleware(['auth'])->group(function () {
    Route::resource('employees', EmployeeController::class)
        ->except(['show', 'create', 'edit']);

    Route::resource('movements', MovementController::class)
        ->only(['index', 'store']);
});

require __DIR__.'/auth.php';
