<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\EmployeeController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth'])->group(function () {
    Route::resource('employees', EmployeeController::class)
        ->except(['show', 'create', 'edit']);
});

require __DIR__.'/auth.php';
