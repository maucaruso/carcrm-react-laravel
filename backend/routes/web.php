<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\DataScraping;
use App\Http\Controllers\ImageController;
use App\Http\Controllers\MercadopagoNotification;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'store']);

Route::get('/olx/{id}', [DataScraping::class, 'index']);

Route::get('/thumb/{path}/{img}', [ImageController::class, 'thumb']);

Route::post('/mercadopago/notification', [MercadopagoNotification::class, 'Notification']);
