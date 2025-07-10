<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // Routes citoyennes
    Route::prefix('citizen')->name('citizen.')->middleware('auth')->group(function () {
        Route::get('/', [App\Http\Controllers\CitizenController::class, 'index'])->name('dashboard');
        Route::get('/map', [App\Http\Controllers\CitizenController::class, 'map'])->name('map');
        Route::get('/report', [App\Http\Controllers\CitizenController::class, 'reportForm'])->name('report');
        Route::post('/report', [App\Http\Controllers\CitizenController::class, 'storeReport'])->name('report.store');
        Route::put('/reports/{report}', [App\Http\Controllers\CitizenController::class, 'updateReport'])->name('reports.update');
        Route::delete('/reports/{report}', [App\Http\Controllers\CitizenController::class, 'destroyReport'])->name('reports.destroy');
        Route::get('/achievements', [App\Http\Controllers\CitizenController::class, 'achievements'])->name('achievements');
        Route::get('/profile', [App\Http\Controllers\CitizenController::class, 'profile'])->name('profile');
        Route::put('/profile', [App\Http\Controllers\CitizenController::class, 'updateProfile'])->name('profile.update');
        Route::get('/history', [App\Http\Controllers\CitizenController::class, 'history'])->name('history');
        Route::get('/notifications', [App\Http\Controllers\CitizenController::class, 'notifications'])->name('notifications');
        Route::patch('/notifications/mark-read', [App\Http\Controllers\CitizenController::class, 'markNotificationsAsRead'])->name('notifications.mark-read');
        Route::delete('/notifications', [App\Http\Controllers\CitizenController::class, 'deleteNotifications'])->name('notifications.delete');
        Route::get('/help', [App\Http\Controllers\CitizenController::class, 'help'])->name('help');
    });

    // Routes administrateur
    Route::prefix('admin')->name('admin.')->middleware(['auth', 'admin'])->group(function () {
        Route::get('/', [App\Http\Controllers\AdminController::class, 'dashboard'])->name('dashboard');

        // Gestion des zones
        Route::get('/zones', [App\Http\Controllers\AdminController::class, 'zones'])->name('zones');
        Route::post('/zones', [App\Http\Controllers\AdminController::class, 'storeZone'])->name('zones.store');
        Route::put('/zones/{zone}', [App\Http\Controllers\AdminController::class, 'updateZone'])->name('zones.update');
        Route::delete('/zones/{zone}', [App\Http\Controllers\AdminController::class, 'destroyZone'])->name('zones.destroy');
        Route::patch('/zones/{zone}/toggle', [App\Http\Controllers\AdminController::class, 'toggleZoneStatus'])->name('zones.toggle');

        // Gestion des signalements
        Route::get('/reports', [App\Http\Controllers\AdminController::class, 'reports'])->name('reports');
        Route::post('/reports/{report}/validate', [App\Http\Controllers\AdminController::class, 'validateReport'])->name('reports.validate');
        // Gestion des utilisateurs
        Route::get('/users', [App\Http\Controllers\AdminController::class, 'users'])->name('users');
        Route::post('/users', [App\Http\Controllers\AdminController::class, 'storeUser'])->name('users.store');
        Route::put('/users/{user}', [App\Http\Controllers\AdminController::class, 'updateUser'])->name('users.update');
        Route::delete('/users/{user}', [App\Http\Controllers\AdminController::class, 'destroyUser'])->name('users.destroy');
        Route::patch('/users/{user}/toggle', [App\Http\Controllers\AdminController::class, 'toggleUserStatus'])->name('users.toggle');
        Route::get('/analytics', [App\Http\Controllers\AdminController::class, 'analytics'])->name('analytics');

        // Gestion des tournées
        Route::get('/schedules', [App\Http\Controllers\AdminController::class, 'schedules'])->name('schedules');
        Route::post('/schedules', [App\Http\Controllers\AdminController::class, 'storeSchedule'])->name('schedules.store');
        Route::put('/schedules/{schedule}', [App\Http\Controllers\AdminController::class, 'updateSchedule'])->name('schedules.update');
        Route::delete('/schedules/{schedule}', [App\Http\Controllers\AdminController::class, 'destroySchedule'])->name('schedules.destroy');
        Route::patch('/schedules/{schedule}/start', [App\Http\Controllers\AdminController::class, 'startSchedule'])->name('schedules.start');
        Route::get('/settings', [App\Http\Controllers\AdminController::class, 'settings'])->name('settings');
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
