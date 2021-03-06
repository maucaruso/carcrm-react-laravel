<?php

use App\Http\Controllers\Api\AppController;
use App\Http\Controllers\Api\NotesController;
use App\Http\Controllers\Api\OwnersController;
use App\Http\Controllers\Api\PayController;
use App\Http\Controllers\Api\TransactionsController;
use App\Http\Controllers\Api\UnitsController;
use App\Http\Controllers\Api\Uploads\LogoController;
use App\Http\Controllers\Api\Uploads\VehicleUploadController;
use App\Http\Controllers\Api\VehiclesController;
use App\Http\Controllers\webservice\WebserviceController;
use Illuminate\Support\Facades\Route;

Route::apiResources([
    'vehicles' => VehiclesController::class,
    'notes' => NotesController::class,
    'owners' => OwnersController::class,
    'units' => UnitsController::class,
]);

Route::resource('app', AppController::class);
Route::resource('transactions', TransactionsController::class)->only('index', 'show');

Route::get('vehicles/{vehicle_type}/brand', [VehiclesController::class, 'brand']);
Route::get('vehicles/{vehicle_type}/{vehicle_brand}/model', [VehiclesController::class, 'model']);
Route::get('vehicles/{vehicle_brand}/{vehicle_model}/version', [VehiclesController::class, 'version']);

Route::group(['prefix' => 'webservice'], function () {
    Route::post('cep', [WebserviceController::class, 'cep']);
});

Route::group(['prefix' => 'upload'], function () {
    Route::resource('logo', LogoController::class)->only(['store', 'update', 'destroy']);
    Route::resource('vehicle', VehicleUploadController::class)->only(['store', 'destroy']);
});

Route::group(['prefix' => 'pay'], function () {
    Route::post('card', [PayController::class, 'card']);
    Route::post('pec', [PayController::class, 'pec']);
    Route::get('plans', [PayController::class, 'plans']);
});
