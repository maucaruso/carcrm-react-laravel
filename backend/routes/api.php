<?php

use App\Http\Controllers\Api\VehiclesController;
use Illuminate\Support\Facades\Route;

Route::apiResources([
    'vehicles' => VehiclesController::class
]);
