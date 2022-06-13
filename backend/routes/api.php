<?php

use App\Http\Controllers\Api\Uploads\VehicleUploadController;
use App\Http\Controllers\Api\VehiclesController;
use App\Http\Controllers\webservice\WebserviceController;
use Illuminate\Support\Facades\Route;

Route::apiResources([
    'vehicles' => VehiclesController::class
]);

Route::get('vehicles/{vehicle_type}/brand', [VehiclesController::class, 'brand']);
Route::get('vehicles/{vehicle_type}/{vehicle_brand}/model', [VehiclesController::class, 'model']);
Route::get('vehicles/{vehicle_brand}/{vehicle_model}/version', [VehiclesController::class, 'version']);

Route::group(['prefix' => 'webservice'], function() {
    Route::post('cep', [WebserviceController::class, 'cep']);
});

Route::group(['prefix' => 'upload'], function() {
    Route::resource('vehicle', VehicleUploadController::class)->only(['create', 'update', 'destroy']);
});
