<?php

use App\Http\Controllers\Api\VehiclesController;
use App\Http\Controllers\webservice\WebserviceController;
use Illuminate\Support\Facades\Route;

Route::apiResources([
    'vehicles' => VehiclesController::class
]);

Route::group(['prefix' => 'webservice'], function() {
    Route::post('cep', [WebserviceController::class, 'cep']);
});
